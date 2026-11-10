import { db } from "@/lib/db";
import { generateCode } from "@/lib/code";
import type { Tier } from "@/config/event";

export type AdminGuest = {
  id: string; code: string; name: string; tier: Tier; personalMessage: string | null; createdAt: string;
  rsvp: { status: "yes" | "no"; wish: string | null; updatedAt: string } | null;
};

type Row = {
  id: string; code: string; name: string; tier: Tier; personal_message: string | null; created_at: string;
  rsvps: { status: "yes" | "no"; wish: string | null; updated_at: string } | { status: "yes" | "no"; wish: string | null; updated_at: string }[] | null;
};

export const toAdminGuest = (r: Row): AdminGuest => {
  const v = Array.isArray(r.rsvps) ? r.rsvps[0] : r.rsvps;
  return {
    id: r.id, code: r.code, name: r.name, tier: r.tier, personalMessage: r.personal_message, createdAt: r.created_at,
    rsvp: v ? { status: v.status, wish: v.wish, updatedAt: v.updated_at } : null,
  };
};

const COLS = "id,code,name,tier,personal_message,created_at,rsvps(status,wish,updated_at)";

export async function listGuests(): Promise<AdminGuest[]> {
  const { data, error } = await db().from("guests").select(COLS).order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Row[]).map(toAdminGuest);
}

type NewGuest = { name: string; tier: Tier; personalMessage: string | null };

export async function createGuests(items: NewGuest[]): Promise<AdminGuest[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const rows = items.map((g) => ({ code: generateCode(), name: g.name, tier: g.tier, personal_message: g.personalMessage }));
    const { data, error } = await db().from("guests").insert(rows).select(COLS);
    if (!error) return (data as unknown as Row[]).map(toAdminGuest);
    if (error.code !== "23505") throw error; // retry only on code collision
  }
  throw new Error("code collision");
}

export async function updateGuest(id: string, p: Partial<NewGuest>): Promise<AdminGuest | null> {
  const patch: Record<string, unknown> = {};
  if (p.name !== undefined) patch.name = p.name;
  if (p.tier !== undefined) patch.tier = p.tier;
  if (p.personalMessage !== undefined) patch.personal_message = p.personalMessage;
  if (!Object.keys(patch).length) return null;
  const { data, error } = await db().from("guests").update(patch).eq("id", id).select(COLS).maybeSingle();
  if (error) throw error;
  return data ? toAdminGuest(data as unknown as Row) : null;
}

export async function deleteGuest(id: string): Promise<void> {
  const { error } = await db().from("guests").delete().eq("id", id);
  if (error) throw error;
}

export function parseBulk(text: string): string[] {
  return text.split(/\r?\n/).map((l) => l.trim().slice(0, 100)).filter(Boolean).slice(0, 300);
}
