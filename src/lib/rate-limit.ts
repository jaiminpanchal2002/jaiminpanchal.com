/**
 * Fixed-window rate limiter.
 *
 * In-memory: effective per server instance. On serverless platforms instances are
 * short-lived and not shared, so this is a best-effort first line of defence. For
 * strict limits, back it with a shared store (e.g. Upstash Redis). See KNOWN_LIMITATIONS.md.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    sweep(now);
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (b.count >= limit) return { ok: false, remaining: 0, resetAt: b.resetAt };
  b.count++;
  return { ok: true, remaining: limit - b.count, resetAt: b.resetAt };
}

function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
}

export function __resetRateLimit() {
  buckets.clear();
}
