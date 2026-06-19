"use client";

import Link from "next/link";
import { CONTROLS } from "@/lib/sprs/controls";
import { FAMILY_BY_ID } from "@/lib/sprs/families";
import { scoreVerdict } from "@/lib/sprs/scoring";
import type { DualScoreResult, Finding } from "@/lib/sprs/types";

const TITLE = new Map(CONTROLS.map((c) => [c.id, c.title]));

function ScoreTile({ label, score, hint }: { label: string; score: number; hint: string }) {
  const good = score >= 88;
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-steel-700">{label}</div>
      <div className="mt-2 flex items-end gap-2">
        <span className={`text-5xl font-bold ${good ? "text-cleared-600" : "text-amber-500"}`}>{score}</span>
        <span className="pb-1.5 text-sm text-slate-500">/ 110</span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{hint}</p>
    </div>
  );
}

export default function DualResults({
  result,
  findings = [],
}: {
  result: DualScoreResult;
  findings?: Finding[];
}) {
  const verdict = scoreVerdict(result.defensible.score);
  const gaps = findings
    .filter((f) => f.status !== "met_evidence")
    .sort((a, b) => {
      const wa = CONTROLS.find((c) => c.id === a.controlId)?.weight ?? 0;
      const wb = CONTROLS.find((c) => c.id === b.controlId)?.weight ?? 0;
      return wb - wa;
    })
    .slice(0, 10);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel-700">
        Your estimated SPRS score
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{verdict.label}</h1>
      <p className="mt-2 text-slate-600">{verdict.summary}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ScoreTile
          label="Self-assessed"
          score={result.selfAssessed.score}
          hint="What your policies say you do — counting everything you told us is in place."
        />
        <ScoreTile
          label="Audit-ready (defensible)"
          score={result.defensible.score}
          hint="What would actually survive an assessment — counting only controls with a documented evidence trail."
        />
      </div>

      {result.evidenceGap > 0 && (
        <div className="mt-4 rounded-xl border border-amber-500 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-navy-900">
            {result.evidenceGap} points at risk — things you do, but can&rsquo;t yet prove.
          </p>
          <p className="mt-1.5 text-sm text-slate-600">
            That gap between the two scores is the missing <strong>evidence trail</strong>. Closing
            it &mdash; turning what you do into documented, audit-ready proof &mdash; is exactly what
            Muster builds and holds for you.
          </p>
        </div>
      )}

      {result.atRisk.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-bold">At risk: you do it, but can&rsquo;t prove it</h2>
          <ul className="mt-5 space-y-2.5">
            {result.atRisk.slice(0, 10).map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-4 rounded-xl border border-line bg-white p-4"
              >
                <span className="mt-0.5 inline-flex h-9 min-w-[2.75rem] items-center justify-center rounded-lg bg-amber-50 px-2 text-sm font-bold text-amber-500">
                  {item.points}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-900">
                    <span className="font-mono text-xs text-steel-700">{item.id}</span> {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">{FAMILY_BY_ID[item.family]?.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {gaps.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-bold">What we found</h2>
          <p className="mt-1 text-sm text-slate-500">
            The biggest gaps, with what your policies did (or didn&rsquo;t) say.
          </p>
          <ul className="mt-5 space-y-3">
            {gaps.map((f) => (
              <li key={f.controlId} className="rounded-xl border border-line bg-white p-4">
                <p className="text-sm font-medium text-navy-900">
                  <span className="font-mono text-xs text-steel-700">{f.controlId}</span>{" "}
                  {TITLE.get(f.controlId)}
                </p>
                {f.rationale && <p className="mt-1 text-sm text-slate-600">{f.rationale}</p>}
                {f.citationExcerpt && (
                  <p className="mt-1.5 border-l-2 border-line pl-3 text-xs italic text-slate-500">
                    &ldquo;{f.citationExcerpt}&rdquo;
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-12 rounded-2xl border border-cleared-500 bg-cleared-50 p-7 sm:p-8">
        <h2 className="text-2xl font-bold text-navy-900">Close the gap with us</h2>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          Book a free consultation and we&rsquo;ll turn this into a fixed-price plan: we build your
          SSP, POA&amp;M, and the evidence trail behind every control &mdash; then keep your SPRS
          score correct every quarter. We never ask for your CUI.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700"
          >
            Book a consultation
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-steel-500"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        This is a good-faith <strong>estimate</strong> from your policies &mdash; not an official
        SPRS posting or a certification. The score is computed deterministically in code from the
        control statuses; an RP/CCP-reviewed score is what gets posted (by you) at onboarding.
      </p>
    </div>
  );
}
