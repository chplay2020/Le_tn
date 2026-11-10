import { buildIcs } from "@/lib/ics";

export function GET() {
  return new Response(buildIcs(), {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="le-tot-nghiep.ics"' },
  });
}
