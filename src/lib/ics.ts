import { EVENT } from "@/config/event";

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");

export const eventTitle = () => `Lễ tốt nghiệp của ${EVENT.host}`;

export function buildIcs(now = new Date()): string {
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Le Tot Nghiep//VI", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", "UID:le-tot-nghiep-2026-11-18@le-tn",
    `DTSTAMP:${utc(now.toISOString())}`, `DTSTART:${utc(EVENT.startsAt)}`, `DTEND:${utc(EVENT.endsAt)}`,
    `SUMMARY:${esc(eventTitle())}`, `LOCATION:${esc(EVENT.venue)}`, `DESCRIPTION:${esc(`${EVENT.school}\nBản đồ: ${EVENT.mapUrl}`)}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n") + "\r\n";
}

export function googleCalendarUrl(): string {
  const q = new URLSearchParams({
    action: "TEMPLATE", text: eventTitle(), dates: `${utc(EVENT.startsAt)}/${utc(EVENT.endsAt)}`,
    location: EVENT.venue, details: `${EVENT.school}\n${EVENT.mapUrl}`,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}
