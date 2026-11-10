import { z } from "zod";
import { guard, json } from "@/lib/api";
import { deleteGuest, updateGuest } from "@/lib/guests";
import { guestPatch } from "@/lib/validation";

export const dynamic = "force-dynamic";
const uuid = z.string().uuid();
type Ctx = { params: Promise<{ id: string }> };

export const PATCH = (req: Request, ctx: Ctx) => guard(async () => {
  const id = uuid.safeParse((await ctx.params).id);
  const p = guestPatch.safeParse(await req.json().catch(() => null));
  if (!id.success || !p.success) return json({ error: "invalid" }, 400);
  const g = await updateGuest(id.data, p.data);
  return g ? json(g) : json({ error: "not_found" }, 404);
});

export const DELETE = (_req: Request, ctx: Ctx) => guard(async () => {
  const id = uuid.safeParse((await ctx.params).id);
  if (!id.success) return json({ error: "invalid" }, 400);
  await deleteGuest(id.data);
  return json({ ok: true });
});
