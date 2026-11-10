import { describe, expect, it } from "vitest";
import { buildIcs, googleCalendarUrl } from "@/lib/ics";

describe("ics", () => {
  const ics = buildIcs(new Date("2026-11-10T00:00:00Z"));
  it("starts 10:30 GMT+7 on 18/11/2026 (03:30Z)", () => {
    expect(ics).toContain("DTSTART:20261118T033000Z");
    expect(ics).toContain("DTEND:20261118T060000Z");
  });
  it("is well-formed with CRLF", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
    expect(ics).toContain("SUMMARY:Lễ tốt nghiệp của Trần Thành");
  });
  it("google link carries same UTC window", () => {
    expect(decodeURIComponent(googleCalendarUrl())).toContain("20261118T033000Z/20261118T060000Z");
  });
});
