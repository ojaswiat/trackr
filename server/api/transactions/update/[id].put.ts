import type { TUser } from "~~/shared/types/entity.types";
import { z } from "zod";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { checkAccountBelongsToUser } from "~~/server/handlers/account.handler";
import {
    canUserUpdateTransaction,
    checkTransactionExists,
    updateTransactionForUser,
} from "~~/server/handlers/transaction.handler";
import { isDev } from "~~/server/utils/api.utils";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";
import { ZEditTransactionSchema } from "~~/shared/schemas/zod.schema";

export default defineEventHandler(async (event) => {
    const dev = isDev();

    try {
        const user = event.context.user as TUser;
        const id = getRouterParam(event, "id");

        // Validate ID
        const idSchema = z.uuidv4("Invalid transaction ID");
        const idResult = idSchema.safeParse(id);
        if (!idResult.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid transaction ID",
            });
        }

        // Check existence
        const exists = await checkTransactionExists(id!);
        if (!exists) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.NOT_FOUND,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.NOT_FOUND],
                message: "Transaction not found",
            });
        }

        // Check ownership
        const canUpdate = await canUserUpdateTransaction(id!, user.id);
        if (!canUpdate) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.FORBIDDEN,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.FORBIDDEN],
                message: "You are not allowed to update this transaction",
            });
        }

        const body = await readBody(event);
        const result = ZEditTransactionSchema.safeParse(body);

        if (!result.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid input",
                data: result.error.issues,
            });
        }

        // Check the new account if altered belongs to the user or not
        if (result.data.account_id) {
            const accountBelongsToUser = await checkAccountBelongsToUser(
                result.data.account_id,
                user.id,
            );

            if (!accountBelongsToUser) {
                throw createError({
                    statusCode: SERVER_STATUS_CODES.FORBIDDEN,
                    statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.FORBIDDEN],
                    message: "You are not allowed to assign transactions to this account",
                });
            }
        }

        const updatedTransaction = await updateTransactionForUser(user.id, {
            id: id!,
            ...result.data,
        });

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Transaction updated successfully!",
            data: {
                transaction: updatedTransaction,
            },
        };
    } catch (error) {
        if (dev) {
            console.error(error);
        }

        throw createError({
            statusCode: SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR],
            message: "Internal server error!",
        });
    }
});
