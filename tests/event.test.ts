import { describe, expect, it } from "vitest";
import { EVENT, THEMES } from "@/config/event";

describe("event config", () => {
  it("starts at 10:30 on 18/11/2026 GMT+7", () => {
    expect(new Date(EVENT.startsAt).toISOString()).toBe("2026-11-18T03:30:00.000Z");
  });
  it("has 3 distinct themes", () => {
    expect(new Set(Object.values(THEMES).map((t) => t.bg)).size).toBe(3);
  });
});

describe("tier distinction", () => {
  it("each tier has its own accent and invitee line", () => {
    expect(new Set(Object.values(THEMES).map((t) => t.accent)).size).toBe(3);
    expect(THEMES.bestie.invitee).toBe("Thân gửi cốt :v");
  });
});
