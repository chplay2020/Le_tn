import { describe, expect, it } from "vitest";
import { eventTimeText } from "@/lib/format";

describe("format", () => {
  it("shows 10:30 regardless of server timezone", () => { expect(eventTimeText()).toBe("10:30"); });
});

import { eventParts } from "@/lib/format";
describe("eventParts", () => {
  it("is 18/11/2026 Wednesday in VN time", () => {
    expect(eventParts()).toEqual({ weekday: "THỨ TƯ", day: "18", month: "11", year: "2026" });
  });
});
