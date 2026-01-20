import type { TUser } from "~~/shared/types/entity.types";
import { z } from "zod";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { checkAccountBelongsToUser, deleteAccountForUser } from "~~/server/handlers/account.handler";
import { isDev } from "~~/server/utils/api.utils";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";
import { ZDeleteAccountSchema } from "~~/shared/schemas/zod.schema";

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
        const canDelete = await checkAccountBelongsToUser(id!, user.id);
        if (!canDelete) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.FORBIDDEN,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.FORBIDDEN],
                message: "You are not allowed to delete this account",
            });
        }

        const body = await readBody(event);
        const result = ZDeleteAccountSchema.safeParse(body);

        if (!result.success) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Invalid input",
                data: result.error.issues,
            });
        }

        const deletedAccount = await deleteAccountForUser(user.id, id!, result.data.keep_transactions);

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Account deleted successfully!",
            data: {
                account: deletedAccount,
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
