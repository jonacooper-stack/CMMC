"use client";

import { useEffect, useMemo, useState } from "react";
import { Eyebrow } from "@/components/ui";
import { CONTROLS } from "@/lib/sprs/controls";
import { computeDualScore, findingsToStatusMap } from "@/lib/sprs/scoring";
import type { DualScoreResult, Finding, FindingStatus } from "@/lib/sprs/types";
import { ScoreGauge } from "./ScoreGauge";

type Q = {
  controlId: string;
  question: string;
  controlTitle: string;
  familyName: string;
  answer?: string | null;
};
type Response = "documented" | "informal" | "no" | "na";

const RESPONSE_STATUS: Record<Response, FindingStatus> = {
  documented: "met_evidence",
  informal: "met_no_evidence",
  no: "not_met",
  na: "na",
};

const OPTIONS: { value: Response; label: string }[] = [
  { value: "documented", label: "Yes, documented" },
  { value: "informal", label: "Yes, informally" },
  { value: "no", label: "No" },
  { value: "na", label: "N/A" },
];

const SELECTED: Record<Response, string> = {
  documented: "border-cleared-500 bg-cleared-600 text-white",
  informal: "border-amber-500 bg-amber-500 text-white",
  no: "border-navy-900 bg-navy-900 text-white",
  na: "border-slate-400 bg-slate-500 text-white",
};
const BASE_OPT = "border-line bg-paper text-slate-600 hover:border-steel-500";

const isResponse = (v: unknown): v is Response =>
  v === "documented" || v === "informal" || v === "no" || v === "na";

export default function InterviewWizard({
  assessmentId,
  baseFindings,
  onComplete,
  onCancel,
}: {
  assessmentId: string;
  baseFindings: Finding[];
  onComplete: (result: DualScoreResult, findings: Finding[]) => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/assessment/interview?assessmentId=${encodeURIComponent(assessmentId)}`,
        );
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || `Couldn't load questions (HTTP ${res.status}).`);
        if (!active) return;
        const qs = (data.questions as Q[]) ?? [];
        setQuestions(qs);
        // Pre-fill any answers from a previous pass so the score reflects them.
        const init: Record<string, Response> = {};
        for (const q of qs) if (isResponse(q.answer)) init[q.controlId] = q.answer;
        if (Object.keys(init).length) setResponses(init);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Couldn't load questions.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [assessmentId]);

  // Live score: the current findings, with interview answers layered on top.
  const baseStatus = useMemo(() => findingsToStatusMap(baseFindings), [baseFindings]);
  const liveResult = useMemo(() => {
    const merged: Record<string, FindingStatus> = { ...baseStatus };
    for (const [controlId, resp] of Object.entries(responses)) merged[controlId] = RESPONSE_STATUS[resp];
    return computeDualScore(CONTROLS, merged);
  }, [baseStatus, responses]);

  const answeredCount = Object.keys(responses).length;

  async function submit() {
    const answers = Object.entries(responses).map(([controlId, response]) => ({ controlId, response }));
    if (!answers.length) {
      setError("Answer at least one question first.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/assessment/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, answers }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || `Couldn't save answers (HTTP ${res.status}).`);
      onComplete(data.result as DualScoreResult, (data.findings as Finding[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-line border-t-cleared-600" />
        <h2 className="mt-6 text-xl font-bold text-navy-900">Preparing your questions…</h2>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h2 className="text-xl font-bold text-navy-900">Nothing left to confirm</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {error || "Your documents already cover everything we'd ask about. Nice work."}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700"
        >
          Back to results
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Eyebrow>Evidence check</Eyebrow>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Confirm what&rsquo;s documented</h1>
      <p className="mt-2 text-slate-600">
        For each control, tell us whether you do it &mdash; and whether it&rsquo;s documented with
        records you could show an assessor. Your score updates live as you answer. Mark anything that
        doesn&rsquo;t apply as N/A, and skip anything you&rsquo;re unsure about.
      </p>

      {/* Live score — stays visible while you answer. */}
      <div className="sticky top-2 z-10 mt-5">
        <ScoreGauge
          defensible={liveResult.defensible.score}
          selfAssessed={liveResult.selfAssessed.score}
          className="shadow-md"
        />
      </div>

      <div className="mt-5 grid gap-1.5 rounded-xl border border-line bg-paper p-4 text-xs text-slate-600 sm:grid-cols-2">
        <span>
          <strong className="text-navy-900">Yes, documented</strong> &mdash; you do it, it&rsquo;s
          written down, and you keep records (counts toward audit-ready).
        </span>
        <span>
          <strong className="text-navy-900">Yes, informally</strong> &mdash; you do it, but it&rsquo;s
          not written down / no records.
        </span>
        <span>
          <strong className="text-navy-900">No</strong> &mdash; not in place yet.
        </span>
        <span>
          <strong className="text-navy-900">N/A</strong> &mdash; doesn&rsquo;t apply to you (e.g. no
          internal network). Excluded from scoring.
        </span>
      </div>

      <ul className="mt-6 space-y-3">
        {questions.map((q) => (
          <li key={q.controlId} className="rounded-xl border border-line bg-white p-4 sm:p-5">
            {q.familyName && (
              <p className="text-xs font-semibold uppercase tracking-wide text-steel-700">
                {q.familyName}
              </p>
            )}
            <p className="mt-1 text-sm font-medium text-navy-900">{q.question}</p>
            <div
              role="radiogroup"
              aria-label={q.question}
              className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap"
            >
              {OPTIONS.map((o) => {
                const selected = responses[q.controlId] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setResponses((p) => ({ ...p, [q.controlId]: o.value }))}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors sm:flex-1 ${
                      selected ? SELECTED[o.value] : BASE_OPT
                    }`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      {error && <p className="mt-4 text-sm text-amber-600">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-steel-500"
        >
          Back to results
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={submitting || !answeredCount}
          className="rounded-lg bg-cleared-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cleared-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : `Save & update score (${answeredCount})`}
        </button>
      </div>
    </div>
  );
}
