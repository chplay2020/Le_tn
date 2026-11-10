type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

/** Fixed-window limiter, per server instance (best-effort on serverless). Returns true if allowed. */
export function rateLimit(key: string, max: number, windowMs: number, now = Date.now()): boolean {
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.reset <= now) { buckets.set(key, { count: 1, reset: now + windowMs }); return true; }
  b.count += 1;
  return b.count <= max;
}
