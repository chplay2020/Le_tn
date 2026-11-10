import { describe, expect, it } from "vitest";
import { inviteMessage } from "@/lib/invite-message";
import { parseBulk, toAdminGuest } from "@/lib/guests";
import { guestInput, guestPatch } from "@/lib/validation";

describe("guests", () => {
  it("parseBulk trims, drops blanks, caps", () => {
    expect(parseBulk(" An \r\n\n Bình\n")).toEqual(["An", "Bình"]);
    expect(parseBulk(Array(400).fill("x").join("\n")).length).toBe(300);
  });
  it("validates input", () => {
    expect(guestInput.safeParse({ name: "A", tier: "bestie" }).success).toBe(true);
    expect(guestInput.safeParse({ name: "", tier: "bestie" }).success).toBe(false);
    expect(guestInput.safeParse({ name: "A", tier: "vip" }).success).toBe(false);
    expect(guestInput.safeParse({ name: "A", tier: "friend", code: "x" }).success).toBe(false);
    expect(guestPatch.safeParse({}).success).toBe(true);
  });
  it("message contains name and link", () => {
    const m = inviteMessage({ name: "An", tier: "friend" }, "https://x/i/abc");
    expect(m).toContain("An"); expect(m).toContain("https://x/i/abc");
  });
  it("maps rows", () => {
    const g = toAdminGuest({ id: "1", code: "c", name: "n", tier: "friend", personal_message: null, created_at: "t", rsvps: null });
    expect(g.rsvp).toBeNull();
  });
});
