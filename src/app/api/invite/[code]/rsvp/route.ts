import { NextResponse } from "next/server";
import { CODE_RE } from "@/lib/code";
import { rateLimit } from "@/lib/rate-limit";
import { submitRsvp } from "@/lib/rsvp-db";

export const dynamic = "force-dynamic";
const json = (b: unknown, status = 200) => NextResponse.json(b, { status, headers: { "Cache-Control": "no-store" } });

export async function PUT(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  if (!CODE_RE.test(code)) return json({ error: "not_found" }, 404);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`rsvp:${ip}:${code}`, 10, 60_000)) return json({ error: "rate_limited" }, 429);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "invalid" }, 400); }
  try {
    const r = await submitRsvp(code, body);
    if (r.ok) return json({ status: r.status, wish: r.wish });
    return json({ error: r.error }, { invalid: 400, not_found: 404, closed: 403 }[r.error]);
  } catch {
    return json({ error: "server_error" }, 500);
  }
}
