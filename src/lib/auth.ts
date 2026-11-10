import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { COOKIE, verifySession } from "@/lib/session";

const h = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time compare against PASS_ADMIN from env. */
export function checkPassword(input: string, expected = process.env.PASS_ADMIN): boolean {
  if (!expected) return false;
  return timingSafeEqual(h(input), h(expected));
}

export async function isAdmin(): Promise<boolean> {
  return verifySession((await cookies()).get(COOKIE)?.value);
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}
