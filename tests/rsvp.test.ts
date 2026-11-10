import { describe, expect, it } from "vitest";
import { saveRsvp, type RsvpDeps } from "@/lib/rsvp";
import { rateLimit } from "@/lib/rate-limit";

const store = new Map<string, { status: string; wish: string | null }>();
const mk = (over: Partial<RsvpDeps> = {}): RsvpDeps => ({
  findGuestId: async (c) => (c === "AAAAAAAA" ? "g1" : c === "BBBBBBBB" ? "g2" : null),
  upsert: async (id, status, wish) => { store.set(id, { status, wish }); },
  deadline: new Date("2026-11-17T23:59:59+07:00"), now: new Date("2026-11-10T00:00:00Z"), ...over,
});

describe("saveRsvp", () => {
  it("creates then changes mind", async () => {
    expect((await saveRsvp("AAAAAAAA", { status: "yes", wish: " chúc " }, mk())).ok).toBe(true);
    expect(store.get("g1")).toEqual({ status: "yes", wish: "chúc" });
    await saveRsvp("AAAAAAAA", { status: "no" }, mk());
    expect(store.get("g1")).toEqual({ status: "no", wish: null });
  });
  it("only writes the guest of the code", async () => {
    store.clear();
    await saveRsvp("AAAAAAAA", { status: "yes" }, mk());
    expect(store.has("g2")).toBe(false);
  });
  it("blocked after deadline", async () => {
    const r = await saveRsvp("AAAAAAAA", { status: "yes" }, mk({ now: new Date("2026-11-17T17:00:01Z") }));
    expect(r).toEqual({ ok: false, error: "closed" });
  });
  it("allowed at 23:59 GMT+7 on 17/11", async () => {
    expect((await saveRsvp("AAAAAAAA", { status: "yes" }, mk({ now: new Date("2026-11-17T16:59:00Z") }))).ok).toBe(true);
  });
  it("rejects long wish, bad status, extra fields; unknown code", async () => {
    expect((await saveRsvp("AAAAAAAA", { status: "yes", wish: "x".repeat(301) }, mk()))).toEqual({ ok: false, error: "invalid" });
    expect((await saveRsvp("AAAAAAAA", { status: "maybe" }, mk()))).toEqual({ ok: false, error: "invalid" });
    expect((await saveRsvp("AAAAAAAA", { status: "yes", guest_id: "g2" }, mk()))).toEqual({ ok: false, error: "invalid" });
    expect((await saveRsvp("CCCCCCCC", { status: "yes" }, mk()))).toEqual({ ok: false, error: "not_found" });
  });
});

describe("rateLimit", () => {
  it("blocks over max and resets after window", () => {
    expect([1, 2, 3].map(() => rateLimit("k", 2, 1000, 0))).toEqual([true, true, false]);
    expect(rateLimit("k", 2, 1000, 1001)).toBe(true);
  });
});
