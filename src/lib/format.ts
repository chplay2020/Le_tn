import { EVENT } from "@/config/event";

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("vi-VN", { timeZone: EVENT.timezone, ...o }).format(new Date(EVENT.startsAt));
export const eventDateText = () => fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const eventTimeText = () => fmt({ hour: "2-digit", minute: "2-digit", hour12: false });

export function eventParts() {
  const p = new Intl.DateTimeFormat("vi-VN", { timeZone: EVENT.timezone, weekday: "long", day: "numeric", month: "numeric", year: "numeric" })
    .formatToParts(new Date(EVENT.startsAt));
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return { weekday: g("weekday").toUpperCase(), day: g("day"), month: g("month"), year: g("year") };
}
