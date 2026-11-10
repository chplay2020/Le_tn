import { z } from "zod";
import { guard, json } from "@/lib/api";
import { removeImage } from "@/lib/gallery";

export const DELETE = (_req: Request, ctx: { params: Promise<{ id: string }> }) => guard(async () => {
  const id = z.string().uuid().safeParse((await ctx.params).id);
  if (!id.success) return json({ error: "invalid" }, 400);
  await removeImage(id.data);
  return json({ ok: true });
});
