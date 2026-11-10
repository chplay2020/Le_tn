import { listGuests } from "@/lib/guests";
import { SettingsPanel } from "@/components/settings-panel";
import { readAdminSettings } from "@/lib/settings";
import { GalleryAdmin } from "@/components/gallery-admin";
import { listGallery } from "@/lib/gallery";
import { AdminApp } from "@/components/admin-app";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [guests, settings, gallery] = await Promise.all([listGuests(), readAdminSettings(), listGallery()]);
  return <AdminApp initial={guests} settings={<><SettingsPanel initial={settings} /><GalleryAdmin initial={gallery} /></>} />;
}
