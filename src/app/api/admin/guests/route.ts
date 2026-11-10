import { guard, json } from "@/lib/api";
import { createGuests, listGuests } from "@/lib/guests";
import { guestInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const GET = () => guard(async () => json(await listGuests()));

export const POST = (req: Request) => guard(async () => {
  const p = guestInput.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "invalid" }, 400);
  return json((await createGuests([p.data]))[0], 201);
});
