import { rsvpInput } from "@/lib/validation";

export type RsvpDeps = {
  findGuestId: (code: string) => Promise<string | null>;
  upsert: (guestId: string, status: "yes" | "no", wish: string | null) => Promise<void>;
  deadline: Date;
  now: Date;
};
export type RsvpResult =
  | { ok: true; status: "yes" | "no"; wish: string | null }
  | { ok: false; error: "invalid" | "not_found" | "closed" };

export const isRsvpOpen = (now: Date, deadline: Date) => now.getTime() <= deadline.getTime();

export async function saveRsvp(code: string, body: unknown, d: RsvpDeps): Promise<RsvpResult> {
  const parsed = rsvpInput.safeParse(body);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const id = await d.findGuestId(code);
  if (!id) return { ok: false, error: "not_found" };
  if (!isRsvpOpen(d.now, d.deadline)) return { ok: false, error: "closed" };
  await d.upsert(id, parsed.data.status, parsed.data.wish);
  return { ok: true, status: parsed.data.status, wish: parsed.data.wish };
}
