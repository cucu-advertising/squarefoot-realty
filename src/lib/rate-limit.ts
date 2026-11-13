/**
 * Sliding-window rate limiter kept in process memory.
 *
 * Good enough for a single Node server or a warm serverless instance. For a
 * multi-region deployment swap this for a shared store (e.g. Upstash Redis);
 * the call site only needs `limit(key)` to return { ok, retryAfter }.
 */
const buckets = new Map<string, number[]>();

export function limit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const hits = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return { ok: false as const, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return { ok: true as const, retryAfter: 0 };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Duplicate guard: remembers a successfully delivered enquiry for a short time so a
 * double-click, retry or refresh does not send the same lead twice.
 */
const delivered = new Map<string, number>();
export function wasDelivered(key: string, ttlMs = 60_000) {
  const t = delivered.get(key);
  return !!t && Date.now() - t < ttlMs;
}
export function markDelivered(key: string, ttlMs = 60_000) {
  const now = Date.now();
  delivered.set(key, now);
  if (delivered.size > 2000) for (const [k, t] of delivered) if (now - t > ttlMs) delivered.delete(k);
}
