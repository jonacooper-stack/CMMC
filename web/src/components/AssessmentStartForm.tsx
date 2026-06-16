"use client";

import { useState } from "react";
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
      <div className="rounded-2xl border border-cleared-500 bg-cleared-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cleared-600 text-white">
          <Check className="h-6 w-6 text-white" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-navy-900">You&rsquo;re in.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Check your inbox &mdash; we&rsquo;re setting up your guided SPRS
          assessment and a founder will make sure your report is on its way
          within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-7 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Work email" name="email" type="email" required />
        <Field label="Company" name="company" required />
        <div>
          <label className="text-sm font-medium text-navy-900">Employees</label>
          <select name="employees" className={selectCls} defaultValue="">
            <option value="" disabled>Select…</option>
            {EMPLOYEES.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <Field label="Primary prime(s)" name="primes" placeholder="e.g. Lockheed, RTX (optional)" className="sm:col-span-2" optional />
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-navy-900">Your SPRS score today</label>
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
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700 disabled:opacity-60"
      >
        {status === "submitting" ? "Starting…" : "Start my free assessment"}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        No spam, no obligation. We never ask you to upload CUI.
      </p>
    </form>
  );
}

const selectCls =
  "mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-steel-500";

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
      <label className="text-sm font-medium text-navy-900">
        {label}{" "}
        {optional && <span className="font-normal text-slate-400">(optional)</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-steel-500"
      />
    </div>
  );
}
