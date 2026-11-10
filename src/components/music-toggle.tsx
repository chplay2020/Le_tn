"use client";
import { useRef, useState } from "react";
import { EVENT, THEMES, type Tier } from "@/config/event";

export function MusicToggle({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const t = THEMES[tier];
  if (!EVENT.musicSrc) return null;

  async function toggle() {
    const a = ref.current; if (!a) return;
    if (on) { a.pause(); setOn(false); return; }
    try { await a.play(); setOn(true); } catch { setOn(false); }
  }
  return (
    <>
      <audio ref={ref} src={EVENT.musicSrc} loop preload="none" />
      <button type="button" onClick={toggle} aria-pressed={on} aria-label={on ? "Tắt nhạc" : "Bật nhạc"}
        style={{ background: t.card, color: t.fg, borderColor: t.accent }}
        className="fixed bottom-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full border shadow">
        <span aria-hidden>{on ? "♪" : "🔇"}</span>
      </button>
    </>
  );
}
