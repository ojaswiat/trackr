// server/api/auth/demo-signin.post.ts
import { serverSupabaseClient } from "#supabase/server";
import { STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export default defineEventHandler(async (event) => {
    try {
        const supabase = await serverSupabaseClient(event);

        const runtimeConfig = useRuntimeConfig();
        const demoEmail = runtimeConfig.demoUserEmail;
        const demoPassword = runtimeConfig.demoUserPassword;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
        });

        if (error || !data.user || !data.session) {
            throw createError({
                statusCode: SERVER_STATUS_CODES.UNAUTHORIZED,
                message: "Demo sign-in failed",
            });
        }

        await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        });

        return {
            statusCode: SERVER_STATUS_CODES.OK,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.OK],
            message: "Demo user signed in successfully",
        };
    } catch (error: any) {
        console.error("Demo sign-in error:", error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Demo sign-in failed",
        });
    }
});
