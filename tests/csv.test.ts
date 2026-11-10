import { describe, expect, it } from "vitest";
import { guestsToCsv } from "@/lib/csv";

describe("csv", () => {
  it("has expected columns", () => {
    const c = guestsToCsv([{ name: "An", tier: "friend", rsvp: { status: "yes", wish: "hi, there", updatedAt: "2026-11-10" } }]);
    expect(c.split("\r\n")[0]).toBe("﻿Tên,Loại,Trạng thái,Lời chúc,Thời điểm trả lời");
    expect(c).toContain('An,Bạn bè,Tham dự,"hi, there",2026-11-10');
  });
  it("neutralises formula injection", () => {
    const c = guestsToCsv([{ name: "=HYPERLINK(1)", tier: "friend", rsvp: { status: "no", wish: "@cmd", updatedAt: "t" } }]);
    expect(c).toContain("'=HYPERLINK(1)"); expect(c).toContain("'@cmd");
  });
  it("unanswered", () => {
    expect(guestsToCsv([{ name: "B", tier: "bestie", rsvp: null }])).toContain("B,Anh em chí cốt,Chưa trả lời,,");
  });
});
