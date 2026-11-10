import { NextResponse } from "next/server";
import { loadInvite } from "@/lib/invite-db";

export const dynamic = "force-dynamic";
const NF = () => NextResponse.json({ error: "not_found" }, { status: 404, headers: { "Cache-Control": "no-store" } });

export async function GET(_req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  try {
    const invite = await loadInvite(code);
    if (!invite) return NF();
    return NextResponse.json(invite, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
