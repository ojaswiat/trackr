import type { TUser } from "~~/shared/types/entity.types";
import { isEmpty } from "lodash-es";
import { DEMO_PROTECTED_ROUTES, STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";
import { isDemoUser } from "../handlers/user.handler";

export default defineEventHandler(async (event) => {
    const path = event.path;

    // Check if this is a restricted endpoint
    const isRestricted = DEMO_PROTECTED_ROUTES.some((endpoint) =>
        path.startsWith(endpoint),
    );

    if (!isRestricted) {
        return; // Allow non-restricted endpoints
    }

    // Check if user is demo
    const user = event.context.user as TUser | undefined;

    if (isEmpty(user)) {
        throw createError({
            statusCode: SERVER_STATUS_CODES.NOT_FOUND,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.NOT_FOUND],
            message: "User not found!",
        });
    }

    const isDemo = await isDemoUser(user?.id ?? "");

    if (isDemo) {
        throw createError({
            statusCode: SERVER_STATUS_CODES.FORBIDDEN,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.FORBIDDEN],
            message: "Demo users cannot perform this action. Sign up for a free account to get full access!",
        });
    }
});
