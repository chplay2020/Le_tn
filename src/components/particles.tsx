"use client";
import { useEffect, useRef } from "react";

type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; ph: number };

/** Lightweight drifting gold glitter. Off for reduced motion; pauses when tab hidden. */
export function Particles({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, ps: P[] = [];
    const spawn = (init: boolean): P => ({
      x: Math.random() * w, y: init ? Math.random() * h : h + 10, r: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.25, vy: -(0.15 + Math.random() * 0.5), a: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.28,
    });
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 768 ? 35 : 70;
      ps = Array.from({ length: n }, () => spawn(true));
    };
    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) ps[i] = spawn(false);
        ctx.globalAlpha = p.a * (0.5 + 0.5 * Math.sin(t / 600 + p.ph));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const vis = () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(tick); };
    resize(); raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize); document.addEventListener("visibilitychange", vis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", vis); };
  }, [color]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
