import { listGuests } from "@/lib/guests";
import { AdminApp } from "@/components/admin-app";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  return <AdminApp initial={await listGuests()} />;
}
