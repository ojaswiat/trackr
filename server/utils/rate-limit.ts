// Fixed-size sliding-window rate limiter kept in memory.
// State is per server instance: on serverless hosts (e.g. Vercel) each warm
// instance keeps its own counters, so this is a best-effort limit, not a global one.

const attempts = new Map<string, number[]>();

export type TRateLimitResult = {
    allowed: boolean;
    retryAfterMs: number;
};

export function checkRateLimit(key: string, max: number, windowMs: number, now = Date.now()): TRateLimitResult {
    const windowStart = now - windowMs;
    const recent = (attempts.get(key) ?? []).filter((t) => t > windowStart);

    if (recent.length >= max) {
        attempts.set(key, recent);
        return { allowed: false, retryAfterMs: recent[0]! + windowMs - now };
    }

    recent.push(now);
    attempts.set(key, recent);

    // Drop stale keys occasionally so the map does not grow without bound
    if (attempts.size > 10_000) {
        for (const [k, times] of attempts) {
            if (times.every((t) => t <= windowStart)) {
                attempts.delete(k);
            }
        }
    }

    return { allowed: true, retryAfterMs: 0 };
}
