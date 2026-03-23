/**
 * In-memory rate limiter for API routes.
 * Each limiter instance maintains its own Map of attempts keyed by identifier (IP, userId, etc.).
 * Expired entries are automatically cleaned up.
 */

interface RateLimitEntry {
    count: number;
    firstAttempt: number;
}

interface RateLimitResult {
    limited: boolean;
    retryAfterSeconds: number;
}

// Store separate Maps for different rate limit contexts
const limiters = new Map<string, Map<string, RateLimitEntry>>();

// Cleanup interval: every 5 minutes, purge expired entries
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setInterval(() => {
        const now = Date.now();
        for (const [name, store] of limiters) {
            for (const [key, entry] of store) {
                // We don't know the window here, so use a generous 30-min max
                if (now - entry.firstAttempt > 30 * 60 * 1000) {
                    store.delete(key);
                }
            }
            if (store.size === 0) limiters.delete(name);
        }
        if (limiters.size === 0 && cleanupTimer) {
            clearInterval(cleanupTimer);
            cleanupTimer = null;
        }
    }, CLEANUP_INTERVAL);
    // Don't block Node from exiting
    if (cleanupTimer && typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
        cleanupTimer.unref();
    }
}

/**
 * Check and record a rate-limited action.
 * @param name   - Unique name for this limiter (e.g. 'login', 'register', 'otp-send')
 * @param key    - Identifier to rate-limit by (e.g. IP address, user ID)
 * @param max    - Maximum attempts allowed within the window
 * @param windowMs - Time window in milliseconds
 * @returns { limited, retryAfterSeconds }
 */
export function rateLimit(
    name: string,
    key: string,
    max: number,
    windowMs: number
): RateLimitResult {
    ensureCleanup();

    if (!limiters.has(name)) {
        limiters.set(name, new Map());
    }
    const store = limiters.get(name)!;
    const now = Date.now();
    const entry = store.get(key);

    if (entry) {
        // Window expired → reset
        if (now - entry.firstAttempt > windowMs) {
            store.set(key, { count: 1, firstAttempt: now });
            return { limited: false, retryAfterSeconds: 0 };
        }

        // Within window — check if over limit
        if (entry.count >= max) {
            const retryAfterSeconds = Math.ceil(
                (windowMs - (now - entry.firstAttempt)) / 1000
            );
            return { limited: true, retryAfterSeconds };
        }

        // Under limit — increment
        entry.count++;
        return { limited: false, retryAfterSeconds: 0 };
    }

    // First attempt
    store.set(key, { count: 1, firstAttempt: now });
    return { limited: false, retryAfterSeconds: 0 };
}

/**
 * Clear rate limit entries for a specific key (e.g. on successful login).
 */
export function clearRateLimit(name: string, key: string): void {
    limiters.get(name)?.delete(key);
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(headersList: Headers): string {
    return (
        headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        headersList.get('x-real-ip') ||
        'unknown'
    );
}
