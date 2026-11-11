"use client";
import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { THEMES, type Tier } from "@/config/event";
import { Envelope } from "@/components/envelope";
import { MusicToggle } from "@/components/music-toggle";

export function InviteExperience({ name, tier, children }: { name: string; tier: Tier; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const t = THEMES[tier];

  useEffect(() => {
    if (!open || reduce || t.effect !== "confetti") return;
    let alive = true;
    import("canvas-confetti").then(({ default: confetti }) => {
      if (!alive) return;
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.3 }, colors: [t.accent, "#ffffff", "#f3ead6"], disableForReducedMotion: true });
    });
    return () => { alive = false; };
  }, [open, reduce, t.accent, t.effect]);

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <Envelope key="env" name={name} tier={tier} onOpen={() => setOpen(true)} />
      ) : (
        <motion.div key="card" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          {children}
          <MusicToggle tier={tier} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
