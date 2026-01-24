// server/api/accounts/history/[id].get.ts
import type { TUser } from "~~/shared/types/entity.types";
import { z } from "zod";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import {
    checkAccountBelongsToUser,
    checkAccountExists,
    getAccountTransactionHistory,
} from "~~/server/handlers/account.handler";
import { isDev } from "~~/server/utils/api.utils";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export default defineEventHandler(async (event) => {
    const dev = isDev();

    try {
        const user = event.context.user as TUser;
        const accountId = getRouterParam(event, "id");
        const { id: userId } = user;

        // Validate ID
        const idSchema = z.string().uuid("Invalid account ID");
        const idResult = idSchema.safeParse(accountId);

        if (!idResult.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid account ID",
            });
        }

        const accountExists = await checkAccountExists(accountId!);

        if (!accountExists) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.NOT_FOUND,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.NOT_FOUND],
                message: "Account not found!",
            });
        }

        const accountBelongsToUser = await checkAccountBelongsToUser(accountId!, userId);
        if (!accountBelongsToUser) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.FORBIDDEN,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.FORBIDDEN],
                message: "You're not allowed to access this account!",
            });
        }

        const history = await getAccountTransactionHistory(accountId!);

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Account transaction history fetched successfully!",
            data: {
                history,
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
