"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { THEMES, type Tier } from "@/config/event";
import { Backdrop } from "@/components/backdrop";
import { Particles } from "@/components/particles";

type Props = { name: string; tier: Tier; onOpen: () => void; onDone: () => void };

async function burst(colors: string[], x: number, y: number, count: number, spread = 360, velocity = 45) {
  const { default: confetti } = await import("canvas-confetti");
  confetti({ particleCount: count, spread, startVelocity: velocity, origin: { x, y }, colors, ticks: 90, scalar: 1.1, disableForReducedMotion: true });
}

export function Envelope({ name, tier, onOpen, onDone }: Props) {
  const t = THEMES[tier];
  const root = useRef<HTMLDivElement>(null);
  const opened = useRef(false);
  const cbs = useRef({ onOpen, onDone });
  cbs.current = { onOpen, onDone };
  const tl = useRef<gsap.core.Timeline | null>(null);
  const colors = [t.accent, "#ffffff", "#ffe9a8"];
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Intro: envelope drops in with a bounce, then floats; seal pulses.
  useLayoutEffect(() => {
    if (reduce()) return;
    const ctx = gsap.context(() => {
      gsap.from(".env-wrap", { y: "-110vh", rotation: -14, duration: 1.4, ease: "bounce.out" });
      gsap.from(".env-fade", { opacity: 0, y: 20, duration: 0.8, delay: 1, stagger: 0.15 });
      gsap.to(".env-float", { y: -8, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.4 });
      gsap.to(".seal-glow", { scale: 1.9, opacity: 0, duration: 1.6, ease: "power1.out", repeat: -1, delay: 1.4 });
      gsap.to(".hint", { opacity: 0.35, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.6 });
    }, root);
    return () => ctx.revert();
  }, []);

  useEffect(() => () => { tl.current?.kill(); }, []);

  function open() {
    if (opened.current) return;
    opened.current = true;
    if (reduce()) { cbs.current.onOpen(); cbs.current.onDone(); return; }
    const q = gsap.utils.selector(root);
    gsap.killTweensOf(q(".env-float, .seal-glow, .hint"));
    const T = gsap.timeline({ onComplete: () => cbs.current.onDone() });
    tl.current = T;
    T.to(q(".env-float"), { y: 0, duration: 0.15 })
      .to(q(".hint, .env-fade"), { opacity: 0, duration: 0.3 }, 0)
      // seal charges up, then pops with a shockwave
      .to(q(".seal"), { scale: 1.35, rotation: 12, duration: 0.35, ease: "power2.in" }, 0)
      .to(q(".stage"), { keyframes: { x: [-7, 7, -5, 5, -2, 0] }, duration: 0.35, ease: "none" }, 0)
      .to(q(".seal"), { scale: 0, opacity: 0, duration: 0.25, ease: "back.in(3)" })
      .fromTo(q(".ring"), { scale: 0.4, opacity: 1 }, { scale: 9, opacity: 0, duration: 0.9, ease: "power2.out" }, "<")
      .call(() => { burst(colors, 0.5, 0.5, 60, 360, 30); })
      // flap flips open in 3D
      .to(q(".flap"), { rotateX: -180, duration: 0.55, ease: "power3.inOut" }, "-=0.15")
      .set(q(".flap"), { zIndex: 1 }, "-=0.35")
      // letter rises, then flies toward the viewer
      .set(q(".letter"), { zIndex: 6 })
      .to(q(".letter"), { y: "-62%", duration: 0.55, ease: "back.out(1.4)" })
      .call(() => { burst(colors, 0.15, 0.6, 70, 70, 55); burst(colors, 0.85, 0.6, 70, 70, 55); })
      .to(q(".letter"), { y: "-10%", scale: 1.15, rotation: 0, duration: 0.35, ease: "power2.inOut" })
      .call(() => { burst(colors, 0.5, 0.3, 90, 360, 50); burst(colors, 0.25, 0.4, 50, 360, 40); burst(colors, 0.75, 0.4, 50, 360, 40); })
      .to(q(".letter"), { scale: 9, duration: 0.6, ease: "power4.in" })
      .to(q(".envelope-all"), { opacity: 0, duration: 0.3 }, "<0.45")
      .to(q(".flash"), { opacity: 1, duration: 0.3, ease: "power2.in" }, "<0.2")
      .call(() => { cbs.current.onOpen(); })
      .to(q(".flash"), { opacity: 0, duration: 0.7, ease: "power2.out" })
      .call(() => { burst(colors, 0.5, 0.6, 140, 100, 60); burst(colors, 0, 0.7, 60, 60, 60); burst(colors, 1, 0.7, 60, 60, 60); }, undefined, "<0.1");
  }

  const GOLD_DARK = `color-mix(in srgb, ${t.accent} 70%, #000)`;
  return (
    <div ref={root} style={{ background: t.bg, color: t.fg }} className="fixed inset-0 z-50 overflow-hidden">
      <Backdrop accent={t.accent} bg={t.bg} />
      <Particles color={t.accent} />
      <div className="stage relative z-10 flex h-full flex-col items-center justify-center gap-10 px-4 text-center">
        <p className="env-fade font-serif-d text-xl envelope-all" style={{ color: t.accent }}>{t.greeting(name)}</p>
        <div className="env-wrap envelope-all" style={{ perspective: 900 }}>
          <button type="button" onClick={open} aria-label="Mở thiệp" className="env-float relative block w-[min(82vw,340px)] aspect-[4/3] cursor-pointer outline-offset-8" style={{ transformStyle: "preserve-3d" }}>
            <span className="absolute inset-0 rounded-md" style={{ background: GOLD_DARK }} />
            <span className="letter absolute inset-x-[6%] top-[8%] bottom-[8%] z-[2] grid place-items-center rounded-sm shadow" style={{ background: "#fffaf0", color: "#3b3326" }}>
              <span className="text-center"><span className="font-script block text-3xl" style={{ color: GOLD_DARK }}>Graduation</span><span className="mt-1 block text-[9px] tracking-[0.3em]">THIỆP MỜI</span></span>
            </span>
            <span className="absolute inset-0 z-[3] rounded-md shadow-lg" style={{ background: t.card, clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)", outline: `1px solid ${t.accent}` }} />
            <span className="flap absolute inset-x-0 top-0 z-[4] block h-[52%]" style={{ transformOrigin: "top", background: `linear-gradient(${t.accent}, ${GOLD_DARK})`, clipPath: "polygon(0 0, 100% 0, 50% 100%)", backfaceVisibility: "visible" }} />
            <span className="absolute left-1/2 top-[52%] z-[5] -translate-x-1/2 -translate-y-1/2">
              <span className="ring absolute left-1/2 top-1/2 -ml-7 -mt-7 block h-14 w-14 rounded-full border-2 opacity-0" style={{ borderColor: t.accent }} />
              <span className="seal-glow absolute left-1/2 top-1/2 -ml-7 -mt-7 block h-14 w-14 rounded-full" style={{ background: t.accent, opacity: 0.5 }} />
              <span className="seal relative grid h-14 w-14 place-items-center rounded-full font-serif-d text-xl shadow-lg" style={{ background: "#9b1c2c", color: "#ffe9a8", boxShadow: "inset 0 0 0 3px rgba(255,233,168,.35), 0 4px 12px rgba(0,0,0,.4)" }}>T</span>
            </span>
          </button>
        </div>
        <p className="hint env-fade text-sm uppercase tracking-[0.35em] envelope-all">Chạm để mở thiệp</p>
      </div>
      <div className="flash pointer-events-none absolute inset-0 z-20 opacity-0" style={{ background: `radial-gradient(circle, #fff 0%, ${t.accent} 70%)` }} />
    </div>
  );
}
