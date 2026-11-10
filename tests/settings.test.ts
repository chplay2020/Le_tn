import { describe, expect, it } from "vitest";
import { settingsInput } from "@/lib/validation";
import { deadlineToDate, parseDeadline } from "@/lib/settings";

describe("settings", () => {
  it("validates", () => {
    expect(settingsInput.safeParse({ rsvpDate: "2026-11-17", notes: "", afterParty: null }).success).toBe(true);
    expect(settingsInput.safeParse({ rsvpDate: "17/11/2026" }).success).toBe(false);
    expect(settingsInput.safeParse({ notes: "x".repeat(1001) }).success).toBe(false);
    expect(settingsInput.safeParse({ evil: 1 }).success).toBe(false);
  });
  it("default deadline is 17/11 in VN time, round-trips", () => {
    expect(deadlineToDate(undefined)).toBe("2026-11-17");
    expect(parseDeadline("2026-11-20T23:59:59+07:00").toISOString()).toBe("2026-11-20T16:59:59.000Z");
    expect(deadlineToDate("2026-11-20T23:59:59+07:00")).toBe("2026-11-20");
  });
});
