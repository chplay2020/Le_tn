"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { EVENT, THEMES, type Tier } from "@/config/event";
import { Countdown } from "@/components/countdown";
import { Particles } from "@/components/particles";
import { googleCalendarUrl } from "@/lib/ics";
import { eventDateText, eventTimeText } from "@/lib/format";

type Props = {
  name: string; tier: Tier; message: string | null; notes?: string | null; afterParty?: string | null;
  portrait?: string | null; rsvp: ReactNode; extra?: ReactNode;
};

export function InviteCard({ name, tier, message, notes, afterParty, portrait, rsvp, extra }: Props) {
  const t = THEMES[tier];
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".card", { scale: 0.9, opacity: 0, duration: 0.9 })
        .from(".frame", { y: -70, opacity: 0, duration: 0.8 }, "-=0.45")
        .from(".line", { y: 28, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=0.35");
    }, root);
    return () => ctx.revert();
  }, []);

  const pill = "rounded-full border px-5 py-3 min-h-11 text-sm";
  return (
    <div ref={root} data-tier={tier} style={{ background: t.bg, color: t.fg }} className="relative min-h-dvh overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {portrait && <div className="absolute inset-0 scale-125 opacity-25 blur-3xl" style={{ backgroundImage: `url(${portrait})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: t.accent }} />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full opacity-15 blur-3xl" style={{ background: t.accent }} />
      </div>
      <Particles color={t.accent} />

      <main className="relative z-10 grid place-items-center px-4 py-8 md:py-12">
        <article style={{ background: `${t.card}d9`, borderColor: t.accent }}
          className="card w-full max-w-[420px] md:max-w-5xl overflow-hidden rounded-3xl border shadow-2xl backdrop-blur md:grid md:grid-cols-2">
          <div className="frame p-5 md:p-8">
            <div style={{ borderColor: t.accent }} className="relative w-full aspect-[3/4] max-h-[70vh] md:max-h-none md:sticky md:top-8 rounded-2xl border-2 p-2">
              <div className="relative h-full w-full overflow-hidden rounded-xl" style={{ background: t.bg }}>
                {portrait ? (
                  <Image src={portrait} alt={`Ảnh cử nhân ${EVENT.host}`} fill priority sizes="(max-width: 768px) 90vw, 480px" className="object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-center" style={{ color: t.accent }}>
                    <div><p className="font-serif-d text-7xl">TT</p><p className="mt-2 text-xs uppercase tracking-[0.3em]">Class of 2026</p></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-10 pt-2 text-center md:px-10 md:py-12 md:text-left md:self-center">
            <p className="line font-serif-d text-xl" style={{ color: t.accent }}>{t.greeting(name)}</p>
            <p className="line mt-2 opacity-90 leading-relaxed">{t.intro}</p>
            <p className="line mt-6 text-xs font-medium uppercase tracking-[0.35em]" style={{ color: t.accent }}>Thiệp mời tốt nghiệp</p>
            <h1 className="line font-serif-d mt-2 text-4xl leading-tight">{EVENT.host}</h1>
            <p className="line mt-1 text-sm tracking-wide opacity-80">{EVENT.school}</p>
            <div style={{ background: t.accent }} className="line mx-auto my-6 h-px w-16 md:mx-0" aria-hidden />
            <dl className="space-y-4">
              <div className="line"><dt className="text-xs uppercase tracking-widest opacity-70">Thời gian</dt><dd className="mt-1 text-lg capitalize">{eventTimeText()} · {eventDateText()}</dd></div>
              <div className="line"><dt className="text-xs uppercase tracking-widest opacity-70">Địa điểm</dt><dd className="mt-1 text-lg">{EVENT.venue}</dd></div>
            </dl>
            <div className="line mt-6"><Countdown /></div>
            <div className="line mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href={EVENT.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.bg, borderColor: t.accent }} className={`${pill} font-medium`}>Xem bản đồ</a>
              <a href="/api/calendar" style={{ borderColor: t.accent }} className={pill}>Lưu vào lịch (.ics)</a>
              <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" style={{ borderColor: t.accent }} className={pill}>Google Calendar</a>
            </div>
            {notes && <section className="line mt-8 text-left"><h2 className="text-xs uppercase tracking-widest opacity-70">Lưu ý</h2><p className="mt-1 whitespace-pre-line">{notes}</p></section>}
            {tier === "bestie" && afterParty && <section style={{ borderColor: t.accent }} className="line mt-8 rounded-xl border p-4 text-left"><h2 className="font-serif-d text-lg">After-party</h2><p className="mt-1 whitespace-pre-line">{afterParty}</p></section>}
            {message && <p style={{ borderColor: t.accent }} className="line mt-8 border-l-2 pl-4 text-left italic whitespace-pre-line">{message}</p>}
            <p className="line font-serif-d mt-8">{t.cta}</p>
            <div className="line mt-8 text-left">{rsvp}</div>
          </div>
        </article>
        {extra}
      </main>
    </div>
  );
}
