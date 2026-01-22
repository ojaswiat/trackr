import type { TUser } from "~~/shared/types/entity.types";
import { z } from "zod";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { updateUser } from "~~/server/handlers/user.handler";
import { isDev } from "~~/server/utils/api.utils";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

const UpdateUserSchema = z.object({
    first_name: z.string().max(30).optional(),
    last_name: z.string().max(30).optional(),
    currency: z.string().length(3).optional(),
});

export default defineEventHandler(async (event) => {
    const dev = isDev();

    try {
        const user = event.context.user as TUser;
        const body = await readBody(event);
        const validatedBody = UpdateUserSchema.parse(body);

        const updatedUser = await updateUser(user.id, validatedBody);

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "User profile updated successfully",
            data: updatedUser,
        };
    } catch (error) {
        if (dev) {
            console.error(error);
        }

        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.BAD_REQUEST,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.BAD_REQUEST],
                message: "Validation failed",
                data: (error as z.ZodError).issues,
            });
        }

        throw createError({
            statusCode: SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.INTERNAL_SERVER_ERROR],
            message: "Internal server error!",
        });
    }
});
