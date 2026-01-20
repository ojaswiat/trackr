import type { TUser } from "~~/shared/types/entity.types";
import { z } from "zod";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { checkAccountBelongsToUser, updateAccountForUser } from "~~/server/handlers/account.handler";
import { isDev } from "~~/server/utils/api.utils";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";
import { ZEditAccountSchema } from "~~/shared/schemas/zod.schema";

export default defineEventHandler(async (event) => {
    const dev = isDev();

    try {
        const user = event.context.user as TUser;
        const id = getRouterParam(event, "id");

        // Validate ID
        const idSchema = z.uuidv4("Invalid account ID");
        const idResult = idSchema.safeParse(id);
        if (!idResult.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid account ID",
            });
        }

        // Check ownership
        const canUpdate = await checkAccountBelongsToUser(id!, user.id);
        if (!canUpdate) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.FORBIDDEN,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.FORBIDDEN],
                message: "You are not allowed to update this account",
            });
        }

        const body = await readBody(event);
        const result = ZEditAccountSchema.safeParse(body);

        if (!result.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid input",
                data: result.error.issues,
            });
        }

        const updatedAccount = await updateAccountForUser(user.id, {
            id: id!,
            ...result.data,
        });

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Account updated successfully!",
            data: {
                account: updatedAccount,
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
