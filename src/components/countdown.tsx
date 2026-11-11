"use client";
import { useEffect, useState } from "react";
import { EVENT } from "@/config/event";

const target = new Date(EVENT.startsAt).getTime();

export function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return <div className="h-16" aria-hidden />;
  if (left <= 0) return <p className="font-serif-d text-xl">Hôm nay là ngày vui!</p>;
  const s = Math.floor(left / 1000);
  const parts: [number, string][] = [[Math.floor(s / 86400), "ngày"], [Math.floor((s % 86400) / 3600), "giờ"], [Math.floor((s % 3600) / 60), "phút"], [s % 60, "giây"]];
  return (
    <div role="timer" aria-label="Đếm ngược đến lễ tốt nghiệp" className="flex justify-center gap-4">
      {parts.map(([n, l]) => (<div key={l} className="min-w-12"><div className="font-serif-d text-2xl tabular-nums">{String(n).padStart(2, "0")}</div><div className="text-xs opacity-70">{l}</div></div>))}
    </div>
  );
}
