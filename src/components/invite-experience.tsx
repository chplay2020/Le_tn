"use client";
import { useState, type ReactNode } from "react";
import type { Tier } from "@/config/event";
import { Envelope } from "@/components/envelope";

export function InviteExperience({ name, tier, children }: { name: string; tier: Tier; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <>
      {open && children}
      {!done && <Envelope name={name} tier={tier} onOpen={() => setOpen(true)} onDone={() => setDone(true)} />}
    </>
  );
}
