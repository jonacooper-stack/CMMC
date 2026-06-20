const GAUGE_MIN = -203;
const GAUGE_MAX = 110;
const gaugePct = (s: number) =>
  ((Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, s)) - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)) * 100;
const labelPct = (p: number) => Math.max(7, Math.min(93, p)); // keep edge labels in-bounds

/**
 * A bad → good thermometer for the punishing −203…110 SPRS scale. Both scores
 * are marked on it and the evidence gap is shaded between them, so a raw number
 * turns into "where am I, and how far to the goal". Reused for the live score in
 * the evidence interview.
 */
export function ScoreGauge({
  defensible,
  selfAssessed,
  className = "mt-6",
}: {
  defensible: number;
  selfAssessed: number;
  className?: string;
}) {
  const dPos = gaugePct(defensible);
  const sPos = gaugePct(selfAssessed);
  const zeroPos = gaugePct(0);
  const passPos = gaugePct(88);
  const progress = Math.round((Math.max(0, Math.min(110, defensible)) / 110) * 100);
  const to110 = Math.max(0, 110 - defensible);
  const to88 = Math.max(0, 88 - defensible);
  const hasGap = selfAssessed > defensible;

  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 ${className}`}>
      {/* value pill above the audit-ready marker */}
      <div className="relative mb-1.5 h-6">
        <div
          className="absolute -translate-x-1/2 rounded-md bg-white px-2 py-0.5 text-sm font-bold text-navy-900 transition-all"
          style={{ left: `${labelPct(dPos)}%` }}
        >
          {defensible}
        </div>
      </div>

      {/* zoned track */}
      <div className="relative h-4 w-full overflow-hidden rounded-full ring-1 ring-white/10">
        <div className="absolute inset-y-0 left-0 bg-rose-500" style={{ width: `${zeroPos}%` }} />
        <div
          className="absolute inset-y-0 bg-amber-500"
          style={{ left: `${zeroPos}%`, width: `${passPos - zeroPos}%` }}
        />
        <div className="absolute inset-y-0 right-0 bg-cleared-500" style={{ left: `${passPos}%` }} />
        {hasGap && (
          <div
            className="absolute inset-y-0 bg-white/20 transition-all"
            style={{ left: `${dPos}%`, width: `${sPos - dPos}%` }}
          />
        )}
        <div
          className="absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all"
          style={{ left: `${dPos}%` }}
        />
        {hasGap && (
          <div
            className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white/60 transition-all"
            style={{ left: `${sPos}%` }}
          />
        )}
      </div>

      {/* numeric ticks */}
      <div className="relative mt-1.5 h-4 text-[10px] text-steel-200/50">
        <span className="absolute left-0">−203</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${zeroPos}%` }}>
          0
        </span>
        <span
          className="absolute -translate-x-1/2 font-semibold text-cleared-500"
          style={{ left: `${labelPct(passPos)}%` }}
        >
          88
        </span>
        <span className="absolute right-0">110</span>
      </div>

      {/* zone names */}
      <div className="relative mt-1 h-4 text-[11px] font-medium text-steel-200/50">
        <span className="absolute -translate-x-1/2" style={{ left: `${zeroPos / 2}%` }}>
          Early stage
        </span>
        <span className="absolute -translate-x-1/2" style={{ left: `${(zeroPos + passPos) / 2}%` }}>
          Material gaps
        </span>
        <span
          className="absolute -translate-x-1/2 text-cleared-500"
          style={{ left: `${labelPct((passPos + 100) / 2)}%` }}
        >
          Strong
        </span>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="text-sm text-steel-200/80">
          You&rsquo;re about <strong className="text-white">{progress}%</strong> of the way to a
          perfect 110
          {to110 > 0 ? (
            <>
              {" "}
              &mdash; <strong className="text-white">{to110}</strong> points to go
              {to88 > 0 ? <>, {to88} to a conditional pass (88)</> : null}.
            </>
          ) : (
            <>.</>
          )}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-steel-200/60">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-1 rounded-sm bg-white" aria-hidden /> Audit-ready{" "}
            <strong className="text-white">{defensible}</strong> &mdash; only what you can prove
            today
          </span>
          {hasGap && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-0.5 rounded-sm bg-white/60" aria-hidden />{" "}
              Self-assessed <strong className="text-white">{selfAssessed}</strong> &mdash; what
              your policies claim
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
