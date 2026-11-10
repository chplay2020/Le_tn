import { guard } from "@/lib/api";
import { guestsToCsv } from "@/lib/csv";
import { listGuests } from "@/lib/guests";

export const dynamic = "force-dynamic";

export const GET = () => guard(async () =>
  new Response(guestsToCsv(await listGuests()), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="khach-moi.csv"', "Cache-Control": "no-store" },
  }));
