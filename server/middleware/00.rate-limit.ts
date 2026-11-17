import { AUTH_RATE_LIMITED_ROUTES, STATUS_CODE_MESSAGE_MAP } from "~~/server/constants/server.const";
import { checkRateLimit } from "~~/server/utils/rate-limit";
import { APP_CONFIG } from "~~/shared/constants/config.const";
import { SERVER_STATUS_CODES } from "~~/shared/constants/enums";

export default defineEventHandler((event) => {
    const path = event.path.split("?")[0] ?? "";
    const route = AUTH_RATE_LIMITED_ROUTES.find((r) => path === r);

    if (!route) {
        return;
    }

    const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
    const { allowed, retryAfterMs } = checkRateLimit(
        `${route}:${ip}`,
        APP_CONFIG.AUTH_RATE_LIMIT_MAX,
        APP_CONFIG.AUTH_RATE_LIMIT_WINDOW_MS,
    );

    if (!allowed) {
        setResponseHeader(event, "Retry-After", Math.ceil(retryAfterMs / 1000));
        throw createError({
            statusCode: SERVER_STATUS_CODES.TOO_MANY_REQUESTS,
            statusMessage: STATUS_CODE_MESSAGE_MAP[SERVER_STATUS_CODES.TOO_MANY_REQUESTS],
            message: "Too many sign-in attempts. Please wait a few seconds and try again.",
        });
    }
});
