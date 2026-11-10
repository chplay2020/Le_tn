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
