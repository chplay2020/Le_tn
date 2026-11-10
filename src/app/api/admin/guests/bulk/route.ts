import { guard, json } from "@/lib/api";
import { createGuests, parseBulk } from "@/lib/guests";
import { bulkInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const POST = (req: Request) => guard(async () => {
  const p = bulkInput.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "invalid" }, 400);
  const names = parseBulk(p.data.text);
  if (!names.length) return json({ error: "invalid" }, 400);
  return json(await createGuests(names.map((name) => ({ name, tier: p.data.tier, personalMessage: null }))), 201);
});
