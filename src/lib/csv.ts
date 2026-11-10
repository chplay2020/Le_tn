const esc = (v: string) => {
  let s = v.replace(/\r?\n/g, " ");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise spreadsheet formulas
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const TIER_LABEL = { special: "Người đặc biệt", friend: "Bạn bè", bestie: "Anh em chí cốt" } as const;
export const STATUS_LABEL = { yes: "Tham dự", no: "Không tham dự", none: "Chưa trả lời" } as const;

type G = { name: string; tier: keyof typeof TIER_LABEL; rsvp: { status: "yes" | "no"; wish: string | null; updatedAt: string } | null };

export function guestsToCsv(gs: G[]): string {
  const head = ["Tên", "Loại", "Trạng thái", "Lời chúc", "Thời điểm trả lời"];
  const rows = gs.map((g) => [g.name, TIER_LABEL[g.tier], STATUS_LABEL[g.rsvp?.status ?? "none"], g.rsvp?.wish ?? "", g.rsvp?.updatedAt ?? ""].map(esc).join(","));
  return "﻿" + [head.join(","), ...rows].join("\r\n") + "\r\n";
}
