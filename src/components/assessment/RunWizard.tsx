"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { Eyebrow } from "@/components/ui";
import DualResults from "./DualResults";
import type { DualScoreResult, Finding } from "@/lib/sprs/types";

type Step = "upload" | "processing" | "results" | "error";

const ACCEPT = ".pdf,.docx,.txt,.md";

export default function RunWizard() {
  const [step, setStep] = useState<Step>("upload");
  const [phase, setPhase] = useState<"uploading" | "analyzing">("uploading");
  const [files, setFiles] = useState<File[]>([]);
  const [attested, setAttested] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DualScoreResult | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);

  async function run() {
    if (!files.length || !attested) return;
    setStep("processing");
    setPhase("uploading");
    setError("");

    // --- Upload phase: files go straight from the browser to Blob storage. ---
    const uploaded: { url: string; filename: string; contentType?: string }[] = [];
    try {
      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/uploads",
          contentType: file.type || undefined,
        });
        uploaded.push({ url: blob.url, filename: file.name, contentType: file.type || undefined });
      }
    } catch (e) {
      setError(
        `Couldn't upload your files: ${e instanceof Error ? e.message : "unknown error"}. ` +
          "This usually means Blob storage isn't connected to the project yet.",
      );
      setStep("error");
      return;
    }

    // --- Analyze phase. Hard timeout so the spinner can never hang forever. ---
    setPhase("analyzing");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 240_000);
    try {
      const res = await fetch("/api/assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: uploaded }),
        signal: controller.signal,
      });
      // A gateway timeout (504) returns HTML, not JSON — parse defensively.
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data?.error ||
            (res.status === 504
              ? "The analysis timed out on the server. Your policy set may be very large — try fewer or smaller documents."
              : `Analysis failed (HTTP ${res.status}).`),
        );
      }
      setResult(data.result as DualScoreResult);
      setFindings((data.findings as Finding[]) ?? []);
      setStep("results");
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === "AbortError";
      setError(
        aborted
          ? "The analysis took too long and timed out. Try fewer or smaller documents."
          : `Analysis request failed: ${e instanceof Error ? e.message : "unknown error"}`,
      );
      setStep("error");
    } finally {
      clearTimeout(timeout);
    }
  }

  if (step === "results" && result) {
    return <DualResults result={result} findings={findings} />;
  }

  if (step === "processing") {
    const uploading = phase === "uploading";
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-line border-t-cleared-600" />
        <h2 className="mt-6 text-xl font-bold text-navy-900">
          {uploading ? "Uploading your documents…" : "Reviewing your policies…"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {uploading
            ? "Securely sending your files — this is usually quick."
            : "We’re reading your documents and checking them against all 110 NIST 800-171 controls. This can take a minute or two for large policy sets — hang tight."}
        </p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <h2 className="text-xl font-bold text-navy-900">That didn&rsquo;t work</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{error}</p>
        <button
          type="button"
          onClick={() => setStep("upload")}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Eyebrow>AI policy review</Eyebrow>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Upload your policies</h1>
      <p className="mt-2 text-slate-600">
        Add your written security policies and procedures &mdash; SSP, policies, plans. We&rsquo;ll
        read them, map them to all 110 NIST 800-171 controls, and give you your estimated SPRS
        score in about a minute.
      </p>

      <div className="mt-6 rounded-xl border border-amber-500 bg-amber-50 p-4 text-sm text-slate-600">
        <strong className="text-navy-900">Upload policies, not CUI.</strong> These should be your
        security <em>documentation</em> (PDF, Word, or text) — never controlled technical data, ITAR
        material, or other CUI. We never need your CUI to assess you.
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <label className="block text-sm font-medium text-navy-900">Policy documents</label>
        <input
          type="file"
          multiple
          accept={ACCEPT}
          onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
          className="mt-2 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800"
        />
        {files.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {files.map((f) => (
              <li key={f.name} className="flex justify-between gap-3">
                <span className="truncate">{f.name}</span>
                <span className="flex-none text-slate-400">{Math.ceil(f.size / 1024)} KB</span>
              </li>
            ))}
          </ul>
        )}

        <label className="mt-5 flex items-start gap-2.5 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={attested}
            onChange={(e) => setAttested(e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-none accent-cleared-600"
          />
          <span>
            I confirm these files are our security policies/procedures and do not contain CUI or
            controlled technical data.
          </span>
        </label>

        <button
          type="button"
          onClick={run}
          disabled={!files.length || !attested}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700 disabled:opacity-50"
        >
          Analyze my policies
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        No policies written yet, or not ready to share them?{" "}
        <a href="/assessment/questionnaire" className="font-medium text-cleared-700 underline">
          Take the guided questionnaire instead
        </a>
        .
      </p>
    </div>
  );
}
