import { db } from "@/lib/db";
import { EVENT } from "@/config/event";

export async function getSettings(): Promise<Record<string, string>> {
  const { data, error } = await db().from("settings").select("key,value");
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
}

export function parseDeadline(v: string | undefined): Date {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d : new Date(EVENT.defaultRsvpDeadline);
}

const KEYS = { rsvpDate: "rsvp_deadline", notes: "notes", afterParty: "after_party" } as const;

export type AdminSettings = { rsvpDate: string; notes: string; afterParty: string };

export const deadlineToDate = (v: string | undefined) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: EVENT.timezone }).format(parseDeadline(v));

export async function readAdminSettings(): Promise<AdminSettings> {
  const s = await getSettings();
  return { rsvpDate: deadlineToDate(s.rsvp_deadline), notes: s.notes ?? "", afterParty: s.after_party ?? "" };
}

export async function writeSettings(p: { rsvpDate?: string | null; notes?: string | null; afterParty?: string | null }) {
  const upserts: { key: string; value: string }[] = [];
  const dels: string[] = [];
  const put = (k: string, v: string | null | undefined) => { if (v === undefined) return; if (v) upserts.push({ key: k, value: v }); else dels.push(k); };
  put(KEYS.rsvpDate, p.rsvpDate ? `${p.rsvpDate}T23:59:59+07:00` : p.rsvpDate);
  put(KEYS.notes, p.notes); put(KEYS.afterParty, p.afterParty);
  if (upserts.length) { const { error } = await db().from("settings").upsert(upserts); if (error) throw error; }
  if (dels.length) { const { error } = await db().from("settings").delete().in("key", dels); if (error) throw error; }
}
