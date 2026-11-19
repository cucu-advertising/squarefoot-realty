import "server-only";

/** Small in-memory limiter + idempotency cache. Per server instance; adequate for a single Node host. */
const hits = new Map<string, number[]>();
const seen = new Map<string, { at: number; response: unknown }>();

export function rateLimited(key: string, max = 6, windowMs = 10 * 60_000) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return list.length > max;
}

export function rememberSubmission(id: string, response: unknown) {
  seen.set(id, { at: Date.now(), response });
  if (seen.size > 2000) {
    const cutoff = Date.now() - 30 * 60_000;
    for (const [k, v] of seen) if (v.at < cutoff) seen.delete(k);
  }
}

export function previousSubmission(id: string) {
  const hit = seen.get(id);
  return hit && Date.now() - hit.at < 30 * 60_000 ? hit.response : undefined;
}
