import { serverSupabaseClient } from "#supabase/server";
import { startsWith } from "lodash-es";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";
import { PROTECTED_ROUTES, STATUS_CODE_MESSAGE_MAP } from "../constants/server.const";

export default defineEventHandler(async (event) => {
    // Only run auth check on protected routes
    const url = event.node.req.url;

    // Skip auth check for public routes
    const isProtected = PROTECTED_ROUTES.some((route) => startsWith(url, route));

    if (isProtected) {
        try {
            const supabase = await serverSupabaseClient(event);

            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                throw createError({
                    statusCode: SERVER_STATUS_CODES.UNAUTHORIZED,
                    message: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.UNAUTHORIZED],
                });
            }

            event.context.user = user;
        } catch (error) {
            console.error(error);
            throw createError({
                statusCode: SERVER_STATUS_CODES.UNAUTHORIZED,
                statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.UNAUTHORIZED],
            });
        }
    }
});
