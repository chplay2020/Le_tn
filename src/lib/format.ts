import { EVENT } from "@/config/event";

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("vi-VN", { timeZone: EVENT.timezone, ...o }).format(new Date(EVENT.startsAt));
export const eventDateText = () => fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const eventTimeText = () => fmt({ hour: "2-digit", minute: "2-digit", hour12: false });
