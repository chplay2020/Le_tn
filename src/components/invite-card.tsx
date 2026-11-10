import { EVENT, THEMES, type Tier } from "@/config/event";
import { Countdown } from "@/components/countdown";
import { googleCalendarUrl } from "@/lib/ics";
import { eventDateText, eventTimeText } from "@/lib/format";

type Props = { name: string; tier: Tier; message: string | null; notes?: string | null; afterParty?: string | null };

export function InviteCard({ name, tier, message, notes, afterParty }: Props) {
  const t = THEMES[tier];
  return (
    <main data-tier={tier} style={{ background: t.bg, color: t.fg }} className="min-h-screen flex items-center justify-center px-4 py-10">
      <article style={{ background: t.card, borderColor: t.accent }} className="w-full max-w-md border rounded-2xl px-6 py-10 text-center shadow-sm">
        <p className="font-serif-d text-2xl">{t.greeting(name)}</p>
        <p className="mt-3 text-base leading-relaxed opacity-90">{t.intro}</p>
        <div style={{ background: t.accent }} className="mx-auto my-8 h-px w-16" aria-hidden />
        <h1 className="font-serif-d text-3xl leading-tight">Lễ tốt nghiệp của {EVENT.host}</h1>
        <p className="mt-2 text-sm tracking-wide opacity-80">{EVENT.school}</p>
        <dl className="mt-8 space-y-4">
          <div><dt className="text-xs uppercase tracking-widest opacity-70">Thời gian</dt>
            <dd className="mt-1 text-lg capitalize">{eventTimeText()} · {eventDateText()}</dd></div>
          <div><dt className="text-xs uppercase tracking-widest opacity-70">Địa điểm</dt>
            <dd className="mt-1 text-lg">{EVENT.venue}</dd></div>
        </dl>
        <a href={EVENT.mapUrl} target="_blank" rel="noopener noreferrer" style={{ borderColor: t.accent }}
          className="mt-6 inline-block rounded-full border px-6 py-3 text-sm min-h-11">Xem bản đồ</a>
        <div className="mt-8"><Countdown /></div>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <a href="/api/calendar" style={{ borderColor: t.accent }} className="rounded-full border px-5 py-3 min-h-11">Lưu vào lịch (.ics)</a>
          <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" style={{ borderColor: t.accent }} className="rounded-full border px-5 py-3 min-h-11">Google Calendar</a>
        </div>
        {notes && (<section className="mt-8 text-left"><h2 className="text-xs uppercase tracking-widest opacity-70">Lưu ý</h2><p className="mt-1 whitespace-pre-line">{notes}</p></section>)}
        {tier === "bestie" && afterParty && (<section style={{ borderColor: t.accent }} className="mt-8 rounded-xl border p-4 text-left"><h2 className="font-serif-d text-lg">After-party</h2><p className="mt-1 whitespace-pre-line">{afterParty}</p></section>)}
        {message && (<p style={{ borderColor: t.accent }} className="mt-8 border-l-2 pl-4 text-left italic whitespace-pre-line">{message}</p>)}
        <p className="mt-8 font-serif-d">{t.cta}</p>
      </article>
    </main>
  );
}
