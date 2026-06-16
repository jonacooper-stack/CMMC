"use client";

import Link from "next/link";
import { FAMILY_BY_ID } from "@/lib/sprs/families";
import { scoreVerdict } from "@/lib/sprs/scoring";
import type { ControlStatus, ScoreResult } from "@/lib/sprs/types";

const STATUS_LABEL: Record<Exclude<ControlStatus, "met">, string> = {
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
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel-700">
        Your estimated SPRS score
      </p>
      <div className="mt-3 flex items-end gap-3">
        <span className={`text-6xl font-bold ${good ? "text-cleared-600" : "text-amber-500"}`}>
          {result.score}
        </span>
        <span className="pb-2 text-lg text-slate-500">/ 110</span>
      </div>
      <p className="mt-1 text-sm font-semibold text-navy-900">{verdict.label}</p>

      <div className="mt-6">
        <div className="relative h-2 rounded-full bg-line">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-cleared-500"
            style={{ width: `${markerPct}%` }}
          />
          <div
            className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-navy-900 shadow"
            style={{ left: `${markerPct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-xs text-slate-400">
          <span>-203</span>
          <span>110</span>
        </div>
      </div>

      <p className="mt-6 text-slate-600">{verdict.summary}</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Answered" value={`${result.answered}/${result.totalControls}`} />
        <Stat label="In place" value={result.metCount} />
        <Stat label="Partly" value={result.partialCount} />
        <Stat label="Not in place" value={result.notMetCount} />
      </div>

      <h2 className="mt-12 text-2xl font-bold">Fix these first</h2>
      <p className="mt-1 text-sm text-slate-500">
        Ordered by how many points each one adds back to your score.
      </p>
      <ul className="mt-5 space-y-2.5">
        {topGaps.map((g) => (
          <li
            key={g.id}
            className="flex items-start gap-4 rounded-xl border border-line bg-white p-4"
          >
            <span className="mt-0.5 inline-flex h-9 min-w-[2.75rem] items-center justify-center rounded-lg bg-cleared-50 px-2 text-sm font-bold text-cleared-700">
              +{g.points}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-navy-900">
                <span className="font-mono text-xs text-steel-700">{g.id}</span> {g.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {FAMILY_BY_ID[g.family]?.name} · {STATUS_LABEL[g.status]}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {restGaps > 0 && (
        <p className="mt-3 text-sm text-slate-500">
          + {restGaps} more {restGaps === 1 ? "gap" : "gaps"} in your full report.
        </p>
      )}

      <h2 className="mt-12 text-2xl font-bold">Posture by family</h2>
      <ul className="mt-5 space-y-3">
        {result.byFamily.map((f) => {
          const pct = f.total ? Math.round((f.met / f.total) * 100) : 0;
          return (
            <li key={f.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-navy-900">
                  <span className="font-mono text-xs text-steel-700">{f.id}</span> {f.name}
                </span>
                <span className="text-slate-500">
                  {f.met}/{f.total} in place{f.pointsLost ? ` · −${f.pointsLost} pts` : ""}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-cleared-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 rounded-2xl border border-cleared-500 bg-cleared-50 p-7 sm:p-8">
        <h2 className="text-2xl font-bold text-navy-900">
          Want this as a report you can act on?
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          We&rsquo;ll turn this into a 15&ndash;25 page report mapped to all 110 controls &mdash;
          your current and target score, a prioritized remediation plan, and a free mock review
          with a founder. We never ask for your CUI.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700"
          >
            Get my full report
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-steel-500"
          >
            Book a mock review
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        This is a good-faith <strong>estimate</strong> to show where you stand &mdash; it is not an
        official SPRS posting and is not a certification. Your score is computed deterministically
        in code from your answers; an RP/CCP-reviewed score is what gets posted (by you) at
        onboarding.
      </p>

      {onRestart && (
        <button
          type="button"
          onClick={onRestart}
          className="mt-6 text-sm font-medium text-steel-700 underline underline-offset-2 hover:text-navy-900"
        >
          Start over
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-3">
      <div className="text-xl font-bold text-navy-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
