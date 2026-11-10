import { describe, expect, it } from "vitest";
import { getInvite } from "@/lib/invite";

const row = {
  name: "An", tier: "friend" as const, personal_message: "hi",
  rsvps: { status: "yes" as const, wish: "chúc mừng", updated_at: "2026-11-10T00:00:00Z" },
};

describe("getInvite", () => {
  it("returns only the guest's public fields", async () => {
    const r = await getInvite("Abcd1234", async () => ({ ...row, id: "x", code: "Abcd1234" } as never));
    expect(Object.keys(r!).sort()).toEqual(["message", "name", "rsvp", "tier"]);
    expect(r!.rsvp).toEqual({ status: "yes", wish: "chúc mừng", updatedAt: "2026-11-10T00:00:00Z" });
  });
  it("null rsvp when none; handles array relation", async () => {
    expect((await getInvite("Abcd1234", async () => ({ ...row, rsvps: null })))!.rsvp).toBeNull();
    expect((await getInvite("Abcd1234", async () => ({ ...row, rsvps: [row.rsvps] })))!.rsvp?.status).toBe("yes");
  });
  it("invalid or unknown code -> null without hitting db for invalid", async () => {
    let called = false;
    expect(await getInvite("../x", async () => { called = true; return null; })).toBeNull();
    expect(called).toBe(false);
    expect(await getInvite("Abcd1234", async () => null)).toBeNull();
  });
});
