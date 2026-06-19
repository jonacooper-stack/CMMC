"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "./ui";

const EMPLOYEES = ["1–15", "16–50", "51–120", "121–200", "200+"];
const SPRS_STATUS = [
  "I don’t know my score",
  "Blank / never posted",
  "Posted but probably stale",
  "Current and maintained",
];

export default function AssessmentStartForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/assessment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-cleared-500 bg-cleared-500/10 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cleared-600 text-white">
          <Check className="h-6 w-6 text-white" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-white">You&rsquo;re in.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-steel-200/80">
          Let&rsquo;s get your estimated SPRS score now &mdash; the guided
          questionnaire takes about 15 minutes and you&rsquo;ll see your score the
          moment you finish. We never ask for your CUI.
        </p>
        <Link
          href="/assessment/questionnaire"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700"
        >
          Start the questionnaire
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-7 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Work email" name="email" type="email" required />
        <Field label="Company" name="company" required />
        <div>
          <label className="text-sm font-medium text-steel-200">Employees</label>
          <select name="employees" className={selectCls} defaultValue="">
            <option value="" disabled>Select…</option>
            {EMPLOYEES.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <Field label="Primary prime(s)" name="primes" placeholder="e.g. Lockheed, RTX (optional)" className="sm:col-span-2" optional />
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-steel-200">Your SPRS score today</label>
          <select name="sprs_status" className={selectCls} defaultValue="">
            <option value="" disabled>Select…</option>
            {SPRS_STATUS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-amber-500">
          Something went wrong sending that. Email us at hello@getmuster.com and we&rsquo;ll sort it.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-cleared-700/20 transition-colors hover:bg-cleared-700 disabled:opacity-60"
      >
        {status === "submitting" ? "Starting…" : "Start my free assessment"}
      </button>
      <p className="mt-3 text-center text-xs text-steel-200/60">
        No spam, no obligation. We never ask you to upload CUI.
      </p>
    </form>
  );
}

const selectCls =
  "mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-cleared-500";

function Field({
  label,
  name,
  type = "text",
  required,
  optional,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-steel-200">
        {label}{" "}
        {optional && <span className="font-normal text-steel-200/50">(optional)</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-steel-500 outline-none focus:border-cleared-500"
      />
    </div>
  );
}
