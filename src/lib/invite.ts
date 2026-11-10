import { CODE_RE } from "@/lib/code";
import type { Tier } from "@/config/event";

export type Rsvp = { status: "yes" | "no"; wish: string | null; updatedAt: string } | null;
export type PublicInvite = { name: string; tier: Tier; message: string | null; rsvp: Rsvp };

type Row = {
  name: string; tier: Tier; personal_message: string | null;
  rsvps: { status: "yes" | "no"; wish: string | null; updated_at: string } | { status: "yes" | "no"; wish: string | null; updated_at: string }[] | null;
};
export type InviteFetcher = (code: string) => Promise<Row | null>;

/** Returns only the guest's own public fields (no id, no code, no other guests). */
export async function getInvite(code: string, fetchRow: InviteFetcher): Promise<PublicInvite | null> {
  if (!CODE_RE.test(code)) return null;
  const row = await fetchRow(code);
  if (!row) return null;
  const r = Array.isArray(row.rsvps) ? row.rsvps[0] : row.rsvps;
  return {
    name: row.name, tier: row.tier, message: row.personal_message,
    rsvp: r ? { status: r.status, wish: r.wish, updatedAt: r.updated_at } : null,
  };
}
