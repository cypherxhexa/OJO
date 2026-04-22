/**
 * Simple in-memory rate limiter.
 * Resets on server restart — acceptable for this scale.
 * For production with multiple serverless instances, use Redis or Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms
}

const store = new Map<string, RateLimitEntry>();

/**
 * Check and record a rate-limited action.
 * @param key      Unique key (e.g. `login:1.2.3.4`)
 * @param limit    Max allowed hits in the window
 * @param windowMs Window duration in milliseconds
 * @returns `{ allowed: boolean; remaining: number; retryAfterMs: number }`
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // Fresh window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterMs: 0 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, retryAfterMs: 0 };
}
