import { guard, json } from "@/lib/api";
import { readAdminSettings, writeSettings } from "@/lib/settings";
import { settingsInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export const GET = () => guard(async () => json(await readAdminSettings()));

export const PUT = (req: Request) => guard(async () => {
  const p = settingsInput.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: "invalid" }, 400);
  await writeSettings(p.data);
  return json(await readAdminSettings());
});
