"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTROLS } from "@/lib/sprs/controls";
import { FAMILY_BY_ID } from "@/lib/sprs/families";
import { scoreVerdict } from "@/lib/sprs/scoring";
import { computeCoverage, interviewControls, type FamilyCoverage } from "@/lib/sprs/coverage";
import { POLICY_BY_FAMILY } from "@/lib/policies/library";
import type { DualScoreResult, Finding, FindingStatus } from "@/lib/sprs/types";
import { ScoreGauge } from "./ScoreGauge";

const TITLE = new Map(CONTROLS.map((c) => [c.id, c.title]));
const CONTROL_BY_ID = new Map(CONTROLS.map((c) => [c.id, c] as const));

const COVERAGE_META: Record<FamilyCoverage["status"], { label: string; dot: string; text: string }> = {
  covered: { label: "Covered", dot: "bg-cleared-600", text: "text-cleared-700" },
  partial: { label: "Partial", dot: "bg-amber-500", text: "text-amber-600" },
  missing: { label: "Missing", dot: "bg-slate-300", text: "text-slate-500" },
};

type GapStatus = Exclude<FindingStatus, "met_evidence" | "na">;
type PolicyGap = { id: string; title: string; status: GapStatus };

const GAP_STATUS: Record<GapStatus, { label: string; cls: string }> = {
  not_met: { label: "Missing", cls: "bg-rose-100 text-rose-700" },
  partial: { label: "Partial", cls: "bg-amber-100 text-amber-700" },
  met_no_evidence: { label: "Undocumented", cls: "bg-slate-100 text-slate-600" },
};

/** One policy area: status badge, the specific control gaps in it, and (for
 *  partial/missing) what it should cover plus a copyable starter. */
function PolicyCard({ fam, gaps }: { fam: FamilyCoverage; gaps: PolicyGap[] }) {
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

  const expandable = gaps.length > 0 || fam.status !== "covered";

  return (
    <li className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`h-2.5 w-2.5 flex-none rounded-full ${meta.dot}`} aria-hidden />
          <p className="truncate text-sm font-medium text-navy-900">{policy.name}</p>
        </div>
        <span className={`flex-none text-xs font-semibold ${meta.text}`}>{meta.label}</span>
      </div>

      {expandable && (
        <details className="mt-2">
          <summary className="cursor-pointer text-xs font-medium text-cleared-700 hover:underline">
            {gaps.length > 0
              ? `${gaps.length} gap${gaps.length === 1 ? "" : "s"} to close in this policy`
              : "What this policy should cover"}
          </summary>

          {gaps.length > 0 && (
            <ul className="mt-2.5 space-y-1.5">
              {gaps.map((g) => (
                <li key={g.id} className="flex items-start gap-2 text-sm text-slate-600">
                  <span
                    className={`mt-0.5 flex-none rounded px-1.5 py-0.5 text-[10px] font-semibold ${GAP_STATUS[g.status].cls}`}
                  >
                    {GAP_STATUS[g.status].label}
                  </span>
                  <span className="min-w-0">
                    <span className="font-mono text-xs text-steel-700">{g.id}</span> {g.title}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {fam.status !== "covered" && (
            <>
              <p className="mt-3 text-sm text-slate-600">{policy.purpose}</p>
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
            </>
          )}
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
  onReset,
}: {
  result: DualScoreResult;
  findings?: Finding[];
  aiAnalyzed?: boolean;
  onStartInterview?: () => void;
  onReset?: () => void;
}) {
  const verdict = scoreVerdict(result.defensible.score);
  const coverage = computeCoverage(findings);
  const gaps = findings
    .filter((f) => f.status !== "met_evidence" && f.status !== "na")
    .sort(
      (a, b) =>
        (CONTROL_BY_ID.get(b.controlId)?.weight ?? 0) -
        (CONTROL_BY_ID.get(a.controlId)?.weight ?? 0),
    )
    .slice(0, 10);

  const gapCount = interviewControls(findings).length;
  const familyGaps = new Map<string, PolicyGap[]>();
  for (const f of findings) {
    if (f.status === "met_evidence" || f.status === "na") continue;
    const ctrl = CONTROL_BY_ID.get(f.controlId);
    if (!ctrl) continue;
    const list = familyGaps.get(ctrl.family) ?? [];
    list.push({ id: f.controlId, title: TITLE.get(f.controlId) ?? f.controlId, status: f.status });
    familyGaps.set(ctrl.family, list);
  }
  for (const list of familyGaps.values()) {
    list.sort(
      (a, b) => (CONTROL_BY_ID.get(b.id)?.weight ?? 0) - (CONTROL_BY_ID.get(a.id)?.weight ?? 0),
    );
  }

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
          <button
            type="button"
            onClick={() => (onReset ? onReset() : window.location.assign("/assessment/run"))}
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Upload different files
          </button>
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

      <ScoreGauge defensible={result.defensible.score} selfAssessed={result.selfAssessed.score} />

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

      {onStartInterview && gapCount > 0 && (
        <div className="mt-6 rounded-2xl border-2 border-navy-900/15 bg-paper p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-navy-900">
                Confirm what&rsquo;s documented &mdash; and watch your score climb
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Your audit-ready score only counts controls you can prove with a documented evidence
                trail, so policies you have but can&rsquo;t yet show don&rsquo;t count. Answer{" "}
                {gapCount} quick question{gapCount === 1 ? "" : "s"} about what&rsquo;s documented and
                your score updates live.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartInterview}
              className="inline-flex flex-none items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              Start the evidence check <span aria-hidden>&rarr;</span>
            </button>
          </div>
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
              <PolicyCard key={fam.id} fam={fam} gaps={familyGaps.get(fam.id) ?? []} />
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
