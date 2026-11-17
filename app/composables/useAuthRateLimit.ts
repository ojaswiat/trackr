import { APP_CONFIG } from "~~/shared/constants/config.const";

// Client-side throttle for sign-in buttons: at most AUTH_RATE_LIMIT_MAX attempts
// per AUTH_RATE_LIMIT_WINDOW_MS. OAuth requests go straight from the browser to
// Supabase, so this is a UX guard only; the demo sign-in endpoint is also limited on the server.
const attempts: number[] = [];

export function useAuthRateLimit() {
    const toast = useToast();

    function tryAttempt(): boolean {
        const now = Date.now();
        const windowStart = now - APP_CONFIG.AUTH_RATE_LIMIT_WINDOW_MS;

        while (attempts.length && attempts[0]! <= windowStart) {
            attempts.shift();
        }

        if (attempts.length >= APP_CONFIG.AUTH_RATE_LIMIT_MAX) {
            const waitSeconds = Math.ceil((attempts[0]! + APP_CONFIG.AUTH_RATE_LIMIT_WINDOW_MS - now) / 1000);
            toast.add({
                title: "Too many sign-in attempts",
                description: `Please wait ${waitSeconds}s and try again.`,
                color: "warning",
            });
            return false;
        }

        attempts.push(now);
        return true;
    }

    return { tryAttempt };
}
