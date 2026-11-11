const PATHS = [
  "M-50 120 C 200 20, 420 220, 700 120 S 1200 20, 1500 140",
  "M-50 170 C 250 80, 480 270, 760 160 S 1220 60, 1500 190",
  "M-50 70 C 180 -10, 460 160, 720 70 S 1180 -20, 1500 90",
];

function Ribbons({ color, flip }: { color: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 260" preserveAspectRatio="none" className={`absolute inset-x-0 h-[30vh] min-h-48 w-full ${flip ? "bottom-0 -scale-y-100" : "top-0"}`}>
      <defs>
        <filter id={`glow-${flip ? "b" : "t"}`} x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {PATHS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={2.4 - i * 0.6} opacity={0.6 - i * 0.17} filter={`url(#glow-${flip ? "b" : "t"})`}
          className="ribbon" style={{ animationDelay: `${i * -4}s`, animationDuration: `${14 + i * 3}s` }} />
      ))}
    </svg>
  );
}

/** Layered luxury backdrop: tinted glows, drifting light ribbons, vignette. Pure CSS/SVG, no JS. */
export function Backdrop({ accent, bg, portrait }: { accent: string; bg: string; portrait?: string | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ background: `radial-gradient(120% 70% at 50% 0%, ${accent}30, transparent 60%), radial-gradient(110% 60% at 50% 100%, ${accent}26, transparent 60%), ${bg}` }}>
      {portrait && <div className="absolute inset-0 scale-125 opacity-20 blur-3xl" style={{ backgroundImage: `url(${portrait})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
      <Ribbons color={accent} />
      <Ribbons color={accent} flip />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.5))" }} />
    </div>
  );
}
