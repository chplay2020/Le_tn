import { NextResponse } from "next/server";
import { z } from "zod";
import { checkPassword, clientIp } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { COOKIE, MAX_AGE, signSession } from "@/lib/session";

export const dynamic = "force-dynamic";
const body = z.object({ password: z.string().min(1).max(200) }).strict();
const res = (b: unknown, status: number) => NextResponse.json(b, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (!rateLimit(`login:${clientIp(req)}`, 5, 15 * 60_000)) return res({ error: "rate_limited" }, 429);
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success || !checkPassword(parsed.data.password)) return res({ error: "unauthorized" }, 401);
  const r = res({ ok: true }, 200);
  r.cookies.set(COOKIE, await signSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
  return r;
}
