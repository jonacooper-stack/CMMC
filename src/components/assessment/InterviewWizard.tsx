"use client";

import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/ui";
import type { DualScoreResult, Finding } from "@/lib/sprs/types";

type Q = {
  controlId: string;
  question: string;
  controlTitle: string;
  familyName: string;
  answer?: string | null;
};
type Response = "yes" | "partial" | "no";

const OPTIONS: { value: Response; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "partial", label: "Partly" },
  { value: "no", label: "No" },
];

const BASE_OPT =
  "rounded-lg border border-line bg-paper px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-steel-500";
const SELECTED: Record<Response, string> = {
  yes: "rounded-lg border border-cleared-500 bg-cleared-600 px-3 py-2 text-xs font-semibold text-white",
  partial: "rounded-lg border border-amber-500 bg-amber-500 px-3 py-2 text-xs font-semibold text-white",
  no: "rounded-lg border border-navy-900 bg-navy-900 px-3 py-2 text-xs font-semibold text-white",
};

export default function InterviewWizard({
  assessmentId,
  onComplete,
  onCancel,
}: {
  assessmentId: string;
  onComplete: (result: DualScoreResult, findings: Finding[]) => void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Q[]>([]);
  const [responses, setResponses] = useState<Record<string, Response>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
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
        if (active) setQuestions((data.questions as Q[]) ?? []);
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

  const answeredCount = questions.filter((q) => responses[q.controlId]).length;

  async function submit() {
    const answers = questions
      .filter((q) => responses[q.controlId])
      .map((q) => ({
        controlId: q.controlId,
        response: responses[q.controlId],
        note: notes[q.controlId]?.trim() || undefined,
      }));
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
        <h2 className="text-xl font-bold text-navy-900">Nothing left to clarify</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {error || "Your documents already covered everything we'd ask about. Nice work."}
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
      <Eyebrow>Clarifying interview</Eyebrow>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">A few quick questions</h1>
      <p className="mt-2 text-slate-600">
        Your documents were silent on these. If you actually do them, say so &mdash; we&rsquo;ll fold
        it into your score and flag it as something to get documented. Answer what you can; skip the
        rest.
      </p>

      <ul className="mt-7 space-y-3">
        {questions.map((q) => (
          <li key={q.controlId} className="rounded-xl border border-line bg-white p-4 sm:p-5">
            {q.familyName && (
              <p className="text-xs font-semibold uppercase tracking-wide text-steel-700">
                {q.familyName}
              </p>
            )}
            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="min-w-0 text-sm font-medium text-navy-900">{q.question}</p>
              <div role="radiogroup" aria-label={q.question} className="flex flex-none gap-1.5">
                {OPTIONS.map((o) => {
                  const selected = responses[q.controlId] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setResponses((p) => ({ ...p, [q.controlId]: o.value }))}
                      className={selected ? SELECTED[o.value] : BASE_OPT}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {responses[q.controlId] === "yes" && (
              <textarea
                value={notes[q.controlId] ?? ""}
                onChange={(e) => setNotes((p) => ({ ...p, [q.controlId]: e.target.value }))}
                placeholder="Optional: a sentence on how you do this (helps when it's time to document it)"
                rows={2}
                className="mt-3 block w-full rounded-lg border border-line bg-paper p-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-steel-500 focus:outline-none"
              />
            )}
          </li>
        ))}
      </ul>

      {error && <p className="mt-4 text-sm text-amber-600">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
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
          {submitting ? "Updating…" : `Update my score (${answeredCount})`}
        </button>
      </div>
    </div>
  );
}
