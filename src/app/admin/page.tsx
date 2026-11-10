import { listGuests } from "@/lib/guests";
import { SettingsPanel } from "@/components/settings-panel";
import { readAdminSettings } from "@/lib/settings";
import { AdminApp } from "@/components/admin-app";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [guests, settings] = await Promise.all([listGuests(), readAdminSettings()]);
  return <AdminApp initial={guests} settings={<SettingsPanel initial={settings} />} />;
}
