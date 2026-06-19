"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTROLS } from "@/lib/sprs/controls";
import { FAMILY_BY_ID } from "@/lib/sprs/families";
import { scoreVerdict } from "@/lib/sprs/scoring";
import { computeCoverage, type FamilyCoverage } from "@/lib/sprs/coverage";
import { POLICY_BY_FAMILY } from "@/lib/policies/library";
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

const COVERAGE_META: Record<FamilyCoverage["status"], { label: string; dot: string; text: string }> = {
  covered: { label: "Covered", dot: "bg-cleared-600", text: "text-cleared-700" },
  partial: { label: "Partial", dot: "bg-amber-500", text: "text-amber-600" },
  missing: { label: "Missing", dot: "bg-slate-300", text: "text-slate-500" },
};

/** One policy area: status badge + (for gaps) what it should cover and a copyable starter. */
function PolicyCard({ fam }: { fam: FamilyCoverage }) {
  const policy = POLICY_BY_FAMILY[fam.id];
  const meta = COVERAGE_META[fam.status];
  const [copied, setCopied] = useState(false);
  if (!policy) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(policy.starter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <li className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`h-2.5 w-2.5 flex-none rounded-full ${meta.dot}`} aria-hidden />
          <p className="truncate text-sm font-medium text-navy-900">{policy.name}</p>
        </div>
        <span className={`flex-none text-xs font-semibold ${meta.text}`}>{meta.label}</span>
      </div>
      {fam.status !== "covered" && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs font-medium text-cleared-700 hover:underline">
            What this policy should cover
          </summary>
          <p className="mt-2 text-sm text-slate-600">{policy.purpose}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {policy.keyElements.map((el) => (
              <li key={el}>{el}</li>
            ))}
          </ul>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-steel-700">
                Starter template
              </span>
              <button
                type="button"
                onClick={copy}
                className="rounded-md border border-line bg-paper px-2.5 py-1 text-xs font-semibold text-navy-900 hover:border-steel-500"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="mt-1.5 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3 text-xs leading-relaxed text-slate-700">
              {policy.starter}
            </pre>
          </div>
        </details>
      )}
    </li>
  );
}

export default function DualResults({
  result,
  findings = [],
  aiAnalyzed = true,
  onStartInterview,
}: {
  result: DualScoreResult;
  findings?: Finding[];
  aiAnalyzed?: boolean;
  onStartInterview?: () => void;
}) {
  const verdict = scoreVerdict(result.defensible.score);
  const coverage = computeCoverage(findings);
  const hasGaps = findings.some((f) => f.status === "not_met" || f.needsClarification);
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
      {aiAnalyzed && !coverage.looksLikePolicy && (
        <div className="mb-6 rounded-xl border border-amber-500 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-navy-900">
            Are you sure these are policy documents?
          </p>
          <p className="mt-1.5 text-sm text-slate-600">
            We found almost no security-policy content to assess, so the score below isn&rsquo;t
            meaningful. Double-check you uploaded your written security policies (SSP, access
            control, incident response, etc.) &mdash; not a résumé, a contract, or another kind of
            document.
          </p>
          <Link
            href="/assessment/run"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Upload different files
          </Link>
        </div>
      )}

      {!aiAnalyzed && (
        <div className="mb-6 rounded-xl border border-steel-500 bg-paper p-5">
          <p className="text-sm font-semibold text-navy-900">
            Demo mode &mdash; AI review isn&rsquo;t switched on yet
          </p>
          <p className="mt-1.5 text-sm text-slate-600">
            This score is a placeholder (every control defaulted to &ldquo;not met&rdquo;) because no
            AI key is configured on the server. Set <code className="font-mono text-xs">ANTHROPIC_API_KEY</code>{" "}
            in your Vercel project&rsquo;s environment variables to get a real policy review.
          </p>
        </div>
      )}

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

      {aiAnalyzed && coverage.looksLikePolicy && (
        <>
          <h2 className="mt-12 text-2xl font-bold">Your policy coverage</h2>
          <p className="mt-1 text-sm text-slate-500">
            The 14 standard NIST 800-171 policy areas. Open any gap to see what it should include and
            copy a starter you can fill in.
          </p>
          <ul className="mt-5 grid gap-2.5">
            {coverage.families.map((fam) => (
              <PolicyCard key={fam.id} fam={fam} />
            ))}
          </ul>
        </>
      )}

      {onStartInterview && hasGaps && (
        <div className="mt-12 rounded-2xl border border-steel-500 bg-white p-7 sm:p-8">
          <h2 className="text-2xl font-bold text-navy-900">Raise your score in a few minutes</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            Some controls weren&rsquo;t covered by your documents &mdash; but you may already do them
            in practice. Answer a short set of targeted questions and we&rsquo;ll fold your answers
            into an updated score.
          </p>
          <button
            type="button"
            onClick={onStartInterview}
            className="mt-5 inline-flex items-center justify-center rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Answer gap questions
          </button>
        </div>
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
