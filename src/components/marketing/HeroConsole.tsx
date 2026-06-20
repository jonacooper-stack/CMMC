"use client";

import { useEffect, useState } from "react";

const TOTAL = 110;
const COLS = 22;

// Deterministic posture heatmap so server and client render identically
// (no hydration drift). ~70% green / 18% amber / 12% rose — a realistic mix.
function tone(i: number): string {
  const m = (i * 37) % 100;
  if (m < 12) return "bg-rose-500/70";
  if (m < 30) return "bg-amber-500/70";
  return "bg-cleared-500/80";
}

/** A mission-control style readout: a live count-up to 110 and an animated
 *  "control heatmap" of all 110 NIST 800-171 objectives lighting up. */
export default function HeroConsole() {
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    if (reduce) {
      raf = requestAnimationFrame(() => setN(TOTAL));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * TOTAL));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-800/60 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cleared-500/20 blur-3xl"
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel-200/70">
          SPRS readiness
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-cleared-500">
          <span className="h-1.5 w-1.5 rounded-full bg-cleared-500 animate-pulse-dot" /> live
        </span>
      </div>

      <div className="relative mt-3 flex items-end gap-2">
        <span className="font-display text-5xl font-bold tabular-nums text-white">{n}</span>
        <span className="pb-1 text-sm text-steel-200/60">/ 110 controls mapped</span>
      </div>

      <div
        className="relative mt-4 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span
            key={i}
            className={`aspect-square rounded-[2px] animate-cell ${tone(i)}`}
            style={{ animationDelay: `${(i % COLS) * 35 + Math.floor(i / COLS) * 70}ms` }}
          />
        ))}
      </div>

      <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { k: "Families", v: "14" },
          { k: "Controls", v: "110" },
          { k: "Cadence", v: "Quarterly" },
        ].map((s) => (
          <div key={s.k} className="rounded-lg border border-white/10 bg-white/5 px-2 py-2">
            <div className="font-display text-sm font-bold text-white">{s.v}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-steel-200/50">
              {s.k}
            </div>
          </div>
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-cleared-500/10 to-transparent"
      />
    </div>
  );
}
