import { z } from "zod";
import { guard, json } from "@/lib/api";
import { addImage, listGallery, reorder } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export const GET = () => guard(async () => json(await listGallery()));

export const POST = (req: Request) => guard(async () => {
  const f = (await req.formData().catch(() => null))?.get("file");
  if (!(f instanceof File)) return json({ error: "invalid" }, 400);
  const r = await addImage(f);
  return r === "invalid" ? json({ error: "invalid" }, 400) : json(r, 201);
});

export const PUT = (req: Request) => guard(async () => {
  const p = z.object({ ids: z.array(z.string().uuid()).max(100) }).strict().safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "invalid" }, 400);
  await reorder(p.data.ids);
  return json({ ok: true });
});
