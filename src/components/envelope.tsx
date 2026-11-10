"use client";
import { motion } from "framer-motion";
import { THEMES, type Tier } from "@/config/event";

export function Envelope({ name, tier, onOpen }: { name: string; tier: Tier; onOpen: () => void }) {
  const t = THEMES[tier];
  return (
    <motion.main exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ background: t.bg, color: t.fg }}
      className="min-h-screen flex flex-col items-center justify-center gap-8 px-4 text-center">
      <p className="font-serif-d text-xl">{t.greeting(name)}</p>
      <button type="button" onClick={onOpen} aria-label="Mở thiệp" style={{ background: t.card, borderColor: t.accent }}
        className="relative w-72 max-w-full aspect-[4/3] rounded-lg border shadow-md overflow-hidden active:scale-95 transition-transform">
        <svg viewBox="0 0 120 90" className="absolute inset-0 w-full h-full" aria-hidden>
          <path d="M0 0 L60 50 L120 0" fill="none" stroke={t.accent} strokeWidth="0.8" />
          <path d="M0 90 L45 45 M120 90 L75 45" fill="none" stroke={t.accent} strokeWidth="0.5" opacity=".6" />
        </svg>
        <span style={{ background: t.accent, color: t.card }} className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 grid place-items-center w-14 h-14 rounded-full font-serif-d text-lg shadow">T</span>
      </button>
      <p className="text-sm tracking-widest uppercase opacity-70">Chạm để mở thiệp</p>
    </motion.main>
  );
}
