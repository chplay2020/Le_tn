"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import gsap from "gsap";
import { EVENT, THEMES, type Tier } from "@/config/event";
import { Backdrop } from "@/components/backdrop";
import { Countdown } from "@/components/countdown";
import { Particles } from "@/components/particles";
import { googleCalendarUrl } from "@/lib/ics";
import { eventParts, eventTimeText } from "@/lib/format";

type Props = {
  name: string; tier: Tier; message: string | null; notes?: string | null; afterParty?: string | null;
  portrait?: string | null; rsvp: ReactNode; extra?: ReactNode;
};

function InfoRow({ icon, label, color, children }: { icon: ReactNode; label: string; color: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="grid h-9 w-9 place-items-center rounded-full border" style={{ borderColor: color, color }}>
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>{icon}</svg>
      </span>
      <span className="text-[11px] font-medium uppercase tracking-[0.35em]" style={{ color }}>{label}</span>
      {children}
    </div>
  );
}

function Sparkle({ className, color, delay = "0s" }: { className: string; color: string; delay?: string }) {
  return (<svg aria-hidden viewBox="0 0 24 24" className={`sparkle ${className}`} style={{ animationDelay: delay, fill: color }}><path d="M12 0c.8 6.6 5.4 11.2 12 12-6.6.8-11.2 5.4-12 12-.8-6.6-5.4-11.2-12-12C6.6 11.2 11.2 6.6 12 0z" /></svg>);
}

export function InviteCard({ name, tier, message, notes, afterParty, portrait, rsvp, extra }: Props) {
  const t = THEMES[tier];
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ delay: 0.5, defaults: { ease: "power3.out" } })
        .from(".card", { scale: 0.8, opacity: 0, duration: 1, ease: "back.out(1.4)" })
        .from(".frame", { y: -70, opacity: 0, duration: 0.8 }, "-=0.45")
        .from(".line", { y: 28, opacity: 0, duration: 0.7, stagger: 0.12 }, "-=0.35");
    }, root);
    return () => ctx.revert();
  }, []);

  const pill = "rounded-full border px-5 py-3 min-h-11 text-sm";
  return (
    <div ref={root} data-tier={tier} style={{ background: t.bg, color: t.fg }} className="relative min-h-dvh overflow-hidden">
      <Backdrop accent={t.accent} bg={t.bg} portrait={portrait} />
      <Particles color={t.accent} />

      <main className="relative z-10 grid place-items-center px-4 py-8 md:py-12">
        <article style={{ background: `${t.card}d9`, borderColor: t.accent }}
          className="card w-full max-w-[420px] md:max-w-5xl overflow-hidden rounded-3xl border shadow-2xl backdrop-blur md:grid md:grid-cols-2">
          <div className="relative px-6 pt-8 text-center md:col-span-2 md:px-10 md:pt-10">
            <Sparkle className="right-6 top-0 h-6 w-6 md:right-8" color={t.accent} /><Sparkle className="left-4 top-24 h-4 w-4" color={t.accent} delay="1.2s" />
            <p className="line text-xs font-medium uppercase tracking-[0.35em]" style={{ color: t.accent }}>Thiệp mời tốt nghiệp</p>
            <h1 className="mt-6 leading-[0.95]">
              <span className="line font-script block text-5xl md:text-6xl" style={{ color: t.accent }}>Graduation</span>
              <span className="line font-script block text-5xl md:text-6xl" style={{ color: t.accent }}>Ceremony of</span>
              <span className="line font-script mt-1 block text-6xl md:text-7xl">{EVENT.host}</span>
            </h1>
            <p className="line mt-2 text-sm tracking-wide opacity-80">{EVENT.school}</p>
            <div className="frame mx-auto mt-5 w-56 md:hidden">
              <div style={{ borderColor: t.accent }} className="relative aspect-[3/4] rounded-2xl border-2 p-1.5">
                <div className="relative h-full w-full overflow-hidden rounded-xl" style={{ background: t.bg }}>
                  {portrait ? (
                    <Image src={portrait} alt={`Ảnh cử nhân ${EVENT.host}`} fill sizes="224px" className="object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-center" style={{ color: t.accent }}>
                      <div><p className="font-serif-d text-5xl">TT</p><p className="mt-2 text-[10px] uppercase tracking-[0.3em]">Class of 2026</p></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="frame hidden p-8 md:flex">
            <div style={{ borderColor: t.accent }} className="relative w-full aspect-[3/4] max-h-[70vh] md:aspect-auto md:max-h-none md:min-h-[520px] rounded-2xl border-2 p-2">
              <div className="relative h-full w-full overflow-hidden rounded-xl" style={{ background: t.bg }}>
                {portrait ? (
                  <Image src={portrait} alt={`Ảnh cử nhân ${EVENT.host}`} fill sizes="(max-width: 768px) 90vw, 480px" className="object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-center" style={{ color: t.accent }}>
                    <div><p className="font-serif-d text-7xl">TT</p><p className="mt-2 text-xs uppercase tracking-[0.3em]">Class of 2026</p></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="relative px-6 pb-2 pt-0 text-center md:px-10 md:pb-6 md:pt-6 md:self-center">
            <div style={{ background: t.accent }} className="line mx-auto my-6 h-px w-16 md:hidden" aria-hidden />
            <p className="line text-sm font-medium tracking-[0.35em]" style={{ color: t.accent }}>{t.invitee}</p>
            <p className="line font-serif-d mx-auto mt-2 max-w-xs rounded-xl bg-white/10 px-4 py-3 text-3xl uppercase tracking-[0.12em] break-words">{name}</p>
            <p className="line mt-4 leading-relaxed opacity-90">{t.intro}</p>
            <div className="line mt-8 flex items-center justify-center gap-4" aria-label={`${eventParts().weekday}, ngày ${eventParts().day} tháng ${eventParts().month} năm ${eventParts().year}`}>
              <div className="flex-1 border-y py-1 text-xs font-medium tracking-[0.3em]" style={{ borderColor: t.accent }}>{eventParts().weekday}</div>
              <div className="leading-none"><div className="font-serif-d text-6xl">{eventParts().day}</div><div className="mt-1 text-[11px] tracking-[0.3em]">THÁNG {eventParts().month}</div></div>
              <div className="flex-1 border-y py-1 text-xs font-medium tracking-[0.3em]" style={{ borderColor: t.accent }}>{eventParts().year}</div>
            </div>
            <p className="line mt-4 text-lg tracking-widest">{eventTimeText()}</p>
            <div className="line mt-7 space-y-5">
              <InfoRow icon={<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zm0-8.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />} label="Địa điểm" color={t.accent}>
                <a href={EVENT.mapUrl} target="_blank" rel="noopener noreferrer" className="font-serif-d text-2xl leading-snug">{EVENT.venue}</a>
              </InfoRow>
              {EVENT.contacts.length > 0 && (
                <InfoRow icon={<path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11 11 0 0 0 3.4.55 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.3.55 3.4a1 1 0 0 1-.25 1z" />} label="Liên hệ" color={t.accent}>
                  <span className="flex flex-wrap justify-center gap-2">
                    {EVENT.contacts.map((c) => (
                      <a key={c.phone} href={`tel:${c.phone}`} style={{ borderColor: t.accent }} className="rounded-full border px-4 py-2 min-h-11 text-base tracking-wide">
                        {c.phone.replace(/(\d{4})(\d{3})(\d{3,})/, "$1 $2 $3")} <span className="opacity-70">({c.name})</span>
                      </a>))}
                  </span>
                </InfoRow>
              )}
            </div>
            <div className="line mt-8"><Countdown /></div>
            <div className="line mt-6 flex flex-wrap justify-center gap-3">
              <a href={EVENT.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: t.accent, color: t.bg, borderColor: t.accent }} className={`${pill} font-medium`}>Xem bản đồ</a>
              <a href="/api/calendar" style={{ borderColor: t.accent }} className={pill}>Lưu vào lịch (.ics)</a>
              <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" style={{ borderColor: t.accent }} className={pill}>Google Calendar</a>
            </div>
          </div>

          <div className="px-6 pb-10 text-center md:col-span-2 md:px-10 md:pb-12">
            <div className="mx-auto max-w-xl">
            {notes && <section className="line mt-8 text-center"><h2 className="text-xs uppercase tracking-widest opacity-70">Lưu ý</h2><p className="mt-1 whitespace-pre-line">{notes}</p></section>}
            {tier === "bestie" && afterParty && <section style={{ borderColor: t.accent }} className="line mt-8 rounded-xl border p-4 text-left"><h2 className="font-serif-d text-lg">After-party</h2><p className="mt-1 whitespace-pre-line">{afterParty}</p></section>}
            {message && <p style={{ borderColor: t.accent }} className="line mt-8 border-l-2 pl-4 text-left italic whitespace-pre-line">{message}</p>}
            <p className="line font-serif-d mt-8">{t.cta}</p>
            <div className="line mt-8 text-left">{rsvp}</div>
            </div>
          </div>
        </article>
        {extra}
      </main>
    </div>
  );
}
