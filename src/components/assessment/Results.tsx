"use client";

import Link from "next/link";
import { FAMILY_BY_ID } from "@/lib/sprs/families";
import { scoreVerdict } from "@/lib/sprs/scoring";
import type { ControlStatus, ScoreResult } from "@/lib/sprs/types";

const STATUS_LABEL: Record<Exclude<ControlStatus, "met" | "na">, string> = {
  partial: "Partly in place",
  not_met: "Not in place",
};

export default function Results({
  result,
  onRestart,
}: {
  result: ScoreResult;
  onRestart?: () => void;
}) {
  const verdict = scoreVerdict(result.score);
  const good = result.score >= 88;
  const markerPct = Math.max(
    0,
    Math.min(100, ((result.score - result.min) / (result.max - result.min)) * 100),
  );
  const topGaps = result.remediation.slice(0, 12);
  const restGaps = result.remediation.length - topGaps.length;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-steel-200/70">
        Your estimated SPRS score
      </p>
      <div className="mt-3 flex items-end gap-3">
        <span className={`text-6xl font-bold ${good ? "text-cleared-500" : "text-amber-400"}`}>
          {result.score}
        </span>
        <span className="pb-2 text-lg text-steel-200/60">/ 110</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-white">{verdict.label}</p>

      <div className="mt-6">
        <div className="relative h-2 rounded-full bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-cleared-500"
            style={{ width: `${markerPct}%` }}
          />
          <div
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-navy-900 bg-white shadow"
            style={{ left: `${markerPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-steel-200/50">
          <span>-203</span>
          <span>110</span>
        </div>
      </div>

      <p className="mt-6 text-steel-200/80">{verdict.summary}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Answered" value={`${result.answered}/${result.totalControls}`} />
        <Stat label="In place" value={result.metCount} />
        <Stat label="Partly" value={result.partialCount} />
        <Stat label="Not in place" value={result.notMetCount} />
        {result.naCount > 0 && <Stat label="N/A" value={result.naCount} />}
      </div>

      <h2 className="mt-12 text-2xl font-bold text-white">Fix these first</h2>
      <p className="mt-1 text-sm text-steel-200/60">
        Ordered by how many points each one adds back to your score.
      </p>
      <ul className="mt-5 space-y-2.5">
        {topGaps.map((g) => (
          <li
            key={g.id}
            className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <span className="mt-0.5 inline-flex h-9 min-w-[2.75rem] items-center justify-center rounded-lg bg-cleared-500/15 px-2 text-sm font-bold text-cleared-500">
              +{g.points}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">
                <span className="font-mono text-xs text-steel-200/60">{g.id}</span> {g.title}
              </p>
              <p className="mt-0.5 text-xs text-steel-200/60">
                {FAMILY_BY_ID[g.family]?.name} · {STATUS_LABEL[g.status]}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {restGaps > 0 && (
        <p className="mt-3 text-sm text-steel-200/60">
          + {restGaps} more {restGaps === 1 ? "gap" : "gaps"} in your full report.
        </p>
      )}

      <h2 className="mt-12 text-2xl font-bold text-white">Posture by family</h2>
      <ul className="mt-5 space-y-3">
        {result.byFamily.map((f) => {
          const pct = f.total ? Math.round((f.met / f.total) * 100) : 0;
          return (
            <li key={f.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">
                  <span className="font-mono text-xs text-steel-200/60">{f.id}</span> {f.name}
                </span>
                <span className="text-steel-200/60">
                  {f.met}/{f.total} in place{f.na ? ` · ${f.na} N/A` : ""}
                  {f.pointsLost ? ` · −${f.pointsLost} pts` : ""}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cleared-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-steel-200/60">
        <strong className="text-white">One thing the score doesn&rsquo;t show:</strong> a
        documented System Security Plan (3.12.4) is a gating prerequisite &mdash; a DoD assessment
        can&rsquo;t even be scored without one. It&rsquo;s worth 0 points on its own, but it&rsquo;s
        the first thing we build with you.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-cleared-500/40 bg-cleared-500/[0.07] p-7 sm:p-8">
        <h2 className="text-2xl font-bold text-white">
          Want this as a report you can act on?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-steel-200/80">
          We&rsquo;ll turn this into a 15&ndash;25 page report mapped to all 110 controls &mdash;
          your current and target score, a prioritized remediation plan, and a free consultation
          with a founder. We never ask for your CUI.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/assessment/run"
            className="inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-cleared-700/20 transition-colors hover:bg-cleared-700"
          >
            Get my full report
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Book a consultation
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-steel-200/60">
        This is a good-faith <strong className="text-steel-200">estimate</strong> to show where you stand &mdash; it is not an
        official SPRS posting and is not a certification. Your score is computed deterministically
        in code from your answers; an RP/CCP-reviewed score is what gets posted (by you) at
        onboarding.
      </p>

      {onRestart && (
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 text-sm font-medium text-steel-200/70 underline underline-offset-2 transition-colors hover:text-white"
        >
          Start over
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-steel-200/60">{label}</div>
    </div>
  );
}
