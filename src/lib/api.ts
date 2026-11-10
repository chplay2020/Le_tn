import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const json = (b: unknown, status = 200) => NextResponse.json(b, { status, headers: { "Cache-Control": "no-store" } });

/** Defense in depth on top of middleware. */
export async function guard<T extends unknown[]>(fn: (...a: T) => Promise<Response>, ...a: T): Promise<Response> {
  if (!(await isAdmin())) return json({ error: "unauthorized" }, 401);
  try { return await fn(...a); } catch { return json({ error: "server_error" }, 500); }
}
