import { db } from "@/lib/db";
import { getSettings, parseDeadline } from "@/lib/settings";
import { saveRsvp } from "@/lib/rsvp";

export async function submitRsvp(code: string, body: unknown) {
  const settings = await getSettings();
  return saveRsvp(code, body, {
    deadline: parseDeadline(settings.rsvp_deadline),
    now: new Date(),
    findGuestId: async (c) => {
      const { data, error } = await db().from("guests").select("id").eq("code", c).maybeSingle();
      if (error) throw error;
      return data?.id ?? null;
    },
    upsert: async (guest_id, status, wish) => {
      const { error } = await db().from("rsvps").upsert({ guest_id, status, wish, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
  });
}
