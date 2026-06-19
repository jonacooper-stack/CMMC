"use client";

import { useEffect, useMemo, useState } from "react";
import { Eyebrow } from "@/components/ui";
import { CONTROLS } from "@/lib/sprs/controls";
import { FAMILIES } from "@/lib/sprs/families";
import { computeScore } from "@/lib/sprs/scoring";
import type { Answers, Control, ControlStatus } from "@/lib/sprs/types";
import Results from "./Results";

const STORAGE_KEY = "muster.sprs.answers.v1";
const NOTES_KEY = "muster.sprs.notes.v1";

const OPTIONS: { value: ControlStatus; label: string }[] = [
  { value: "met", label: "Yes" },
  { value: "partial", label: "Partly" },
  { value: "not_met", label: "No" },
  { value: "na", label: "N/A" },
];

const scrollTop = (smooth = false) => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }
};

export default function Questionnaire() {
  const [answers, setAnswers] = useState<Answers>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Restore in-progress answers/notes after mount. Starting empty on both the
  // server and the client's first render avoids a hydration mismatch, so we
  // populate from localStorage here rather than in a lazy initializer.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAnswers(JSON.parse(raw) as Answers);
      const rawNotes = localStorage.getItem(NOTES_KEY);
      if (rawNotes) setNotes(JSON.parse(rawNotes) as Record<string, string>);
    } catch {
      /* ignore unparsable/blocked storage */
    }
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
      /* ignore */
    }
  }, [answers, notes, loaded]);

  const byFamily = useMemo(() => {
    const map = new Map<string, Control[]>();
    for (const f of FAMILIES) map.set(f.id, []);
    for (const c of CONTROLS) map.get(c.family)?.push(c);
    return map;
  }, []);

  // Only step through families that actually have controls (keeps the flow
  // clean even before the full 110-control dataset is loaded).
  const steps = useMemo(
    () => FAMILIES.filter((f) => (byFamily.get(f.id)?.length ?? 0) > 0),
    [byFamily],
  );

  const total = CONTROLS.length;
  const answeredCount = useMemo(
    () => CONTROLS.reduce((n, c) => (answers[c.id] ? n + 1 : n), 0),
    [answers],
  );

  function setAnswer(id: string, value: ControlStatus) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function setNote(id: string, value: string) {
    setNotes((prev) => ({ ...prev, [id]: value }));
  }

  function go(next: number) {
    setStep(next);
    scrollTop(true);
  }

  function restart() {
    setAnswers({});
    setNotes({});
    setStep(0);
    setDone(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(NOTES_KEY);
    } catch {
      /* ignore */
    }
    scrollTop();
  }

  if (done) {
    return <Results result={computeScore(CONTROLS, answers)} onRestart={restart} />;
  }

  const family = steps[step];
  const familyControls = byFamily.get(family.id) ?? [];
  const familyAnswered = familyControls.reduce((n, c) => (answers[c.id] ? n + 1 : n), 0);
  const pct = total ? Math.round((answeredCount / total) * 100) : 0;
  const isLast = step === steps.length - 1;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Step {step + 1} of {steps.length}
        </span>
        <span>
          {answeredCount} of {total} answered
        </span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-line">
        <div
          className="h-full rounded-full bg-cleared-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-8">
        <Eyebrow>
          {family.id} · {family.name}
        </Eyebrow>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{family.name}</h1>
        <p className="mt-2 text-slate-600">{family.intro}</p>
        <p className="mt-2 text-xs text-slate-400">
          {familyAnswered}/{familyControls.length} answered in this section
        </p>
      </div>

      <ul className="mt-7 space-y-3">
        {familyControls.map((c) => (
          <li key={c.id} className="rounded-xl border border-line bg-white p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <p className="min-w-0 text-sm font-medium text-navy-900">
                <span className="font-mono text-xs text-steel-700">{c.id}</span> {c.title}
              </p>
              <div
                role="radiogroup"
                aria-label={`${c.id} status`}
                className="flex flex-none gap-1.5"
              >
                {OPTIONS.map((o) => {
                  const selected = answers[c.id] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAnswer(c.id, o.value)}
                      className={selected ? SELECTED_CLS[o.value] : BASE_OPT_CLS}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {(answers[c.id] === "na" ||
              answers[c.id] === "partial" ||
              answers[c.id] === "not_met") && (
              <input
                type="text"
                value={notes[c.id] ?? ""}
                onChange={(e) => setNote(c.id, e.target.value)}
                placeholder={
                  answers[c.id] === "na"
                    ? "Why doesn't this apply? (e.g. remote-first — no internal network)"
                    : "Add a note (optional)"
                }
                className="mt-3 block w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-steel-500 focus:outline-none"
              />
            )}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(Math.max(0, step - 1))}
          disabled={step === 0}
          className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-steel-500 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            if (isLast) {
              setDone(true);
              scrollTop();
            } else {
              go(step + 1);
            }
          }}
          className="rounded-lg bg-cleared-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cleared-700"
        >
          {isLast ? "See my score" : "Next section"}
        </button>
      </div>
    </div>
  );
}

const BASE_OPT_CLS =
  "rounded-lg border border-line bg-paper px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-steel-500";

const SELECTED_CLS: Record<ControlStatus, string> = {
  met: "rounded-lg border border-cleared-500 bg-cleared-600 px-3 py-2 text-xs font-semibold text-white",
  partial: "rounded-lg border border-amber-500 bg-amber-500 px-3 py-2 text-xs font-semibold text-white",
  not_met: "rounded-lg border border-navy-900 bg-navy-900 px-3 py-2 text-xs font-semibold text-white",
  na: "rounded-lg border border-slate-400 bg-slate-500 px-3 py-2 text-xs font-semibold text-white",
};
