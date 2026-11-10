const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 71) % 100, delay: (i * 0.9) % 8, dur: 9 + (i % 5) * 1.5, size: 10 + (i % 4) * 4,
}));

export function Petals({ color }: { color: string }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden motion-reduce:hidden">
      {PETALS.map((p, i) => (
        <span key={i} className="petal" style={{ left: `${p.left}%`, width: p.size, height: p.size, background: color, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
}
