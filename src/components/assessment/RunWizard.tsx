"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Eyebrow } from "@/components/ui";
import DualResults from "./DualResults";
import InterviewWizard from "./InterviewWizard";
import type { DualScoreResult, Finding } from "@/lib/sprs/types";

type Step = "upload" | "processing" | "results" | "error" | "interview";

const ACCEPT = ".pdf,.docx,.txt,.md";

export default function RunWizard() {
  const [step, setStep] = useState<Step>("upload");
  const [phase, setPhase] = useState<"uploading" | "analyzing">("uploading");
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [linkError, setLinkError] = useState("");
  const [attested, setAttested] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DualScoreResult | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [aiAnalyzed, setAiAnalyzed] = useState(true);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Append newly picked files to the existing selection (deduped by name+size)
  // so opening the picker again adds to the list instead of replacing it.
  function addFiles(selected: FileList | null) {
    if (!selected?.length) return;
    // Snapshot the picked files NOW: resetting the input below empties this
    // FileList, and setFiles' updater runs later (after this handler returns).
    const picked = Array.from(selected);
    // Clear the native input so re-picking the same file still fires onChange.
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFiles((prev) => {
      const seen = new Set(prev.map((f) => `${f.name}:${f.size}`));
      const additions = picked.filter((f) => !seen.has(`${f.name}:${f.size}`));
      return additions.length ? [...prev, ...additions] : prev;
    });
  }

  function removeFile(name: string, size: number) {
    setFiles((prev) => prev.filter((f) => !(f.name === name && f.size === size)));
  }

  function addLink() {
    const raw = linkInput.trim();
    if (!raw) return;
    let normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const u = new URL(normalized);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("bad protocol");
      normalized = u.toString();
    } catch {
      setLinkError("That doesn't look like a valid web address.");
      return;
    }
    setLinks((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    setLinkInput("");
    setLinkError("");
  }

  function removeLink(url: string) {
    setLinks((prev) => prev.filter((l) => l !== url));
  }

  async function run() {
    if ((!files.length && !links.length) || !attested) return;
    setStep("processing");
    setPhase(files.length ? "uploading" : "analyzing");
    setError("");

    // --- Upload phase: files go straight from the browser to Blob storage.
    // Hard timeout so a stalled upload surfaces an error instead of spinning forever. ---
    const uploaded: { url: string; filename: string; contentType?: string }[] = [];
    const uploadController = new AbortController();
    const uploadTimeout = setTimeout(() => uploadController.abort(), 120_000);
    try {
      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: "private",
          handleUploadUrl: "/api/uploads",
          contentType: file.type || undefined,
          abortSignal: uploadController.signal,
        });
        uploaded.push({ url: blob.url, filename: file.name, contentType: file.type || undefined });
      }
    } catch (e) {
      setError(
        uploadController.signal.aborted
          ? "The upload timed out before finishing. Check your connection and that Blob storage is connected to the project, then try again."
          : `Couldn't upload your files: ${e instanceof Error ? e.message : "unknown error"}. ` +
              "This usually means Blob storage isn't connected to the project yet.",
      );
      setStep("error");
      return;
    } finally {
      clearTimeout(uploadTimeout);
    }

    // --- Analyze phase. Hard timeout so the spinner can never hang forever. ---
    setPhase("analyzing");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 240_000);
    try {
      const res = await fetch("/api/assessment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documents: uploaded, links }),
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
      setAiAnalyzed(data.aiAnalyzed !== false);
      setAssessmentId((data.assessmentId as string) ?? null);
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

  function reset() {
    setStep("upload");
    setFiles([]);
    setLinks([]);
    setLinkInput("");
    setLinkError("");
    setAttested(false);
    setError("");
    setResult(null);
    setFindings([]);
    setAssessmentId(null);
    setAiAnalyzed(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  if (step === "interview" && assessmentId) {
    return (
      <InterviewWizard
        assessmentId={assessmentId}
        baseFindings={findings}
        onComplete={(r, f) => {
          setResult(r);
          setFindings(f);
          setStep("results");
          if (typeof window !== "undefined") window.scrollTo({ top: 0 });
        }}
        onCancel={() => {
          setStep("results");
          if (typeof window !== "undefined") window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  if (step === "results" && result) {
    return (
      <DualResults
        result={result}
        findings={findings}
        aiAnalyzed={aiAnalyzed}
        onReset={reset}
        onStartInterview={
          assessmentId
            ? () => {
                setStep("interview");
                if (typeof window !== "undefined") window.scrollTo({ top: 0 });
              }
            : undefined
        }
      />
    );
  }

  if (step === "processing") {
    const uploading = phase === "uploading";
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-cleared-500" />
        <h2 className="mt-6 text-xl font-bold text-white">
          {uploading ? "Uploading your documents…" : "Reviewing your policies…"}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-steel-200/80">
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
        <h2 className="text-xl font-bold text-white">That didn&rsquo;t work</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-steel-200/80">{error}</p>
        <button
          type="button"
          onClick={() => setStep("upload")}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-cleared-700/20 transition-colors hover:bg-cleared-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Eyebrow tone="dark">AI policy review</Eyebrow>
      <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Upload your policies</h1>
      <p className="mt-2 text-steel-200/80">
        Add your written security policies and procedures &mdash; SSP, policies, plans. We&rsquo;ll
        read them, map them to all 110 NIST 800-171 controls, and give you your estimated SPRS
        score in about a minute.
      </p>

      <div className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-steel-200/80">
        <strong className="text-white">Upload policies, not CUI.</strong> These should be your
        security <em>documentation</em> (PDF, Word, or text) — never controlled technical data, ITAR
        material, or other CUI. We never need your CUI to assess you.
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm font-medium text-white">Policy documents</p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            id="policy-files"
            type="file"
            multiple
            accept={ACCEPT}
            onChange={(e) => addFiles(e.target.files)}
            className="sr-only"
          />
          <label
            htmlFor="policy-files"
            className="inline-flex cursor-pointer items-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {files.length ? "Add more files" : "Choose files"}
          </label>
          <span className="text-sm text-steel-200/60">
            {files.length
              ? `${files.length} file${files.length === 1 ? "" : "s"} selected`
              : "PDF, Word, or text"}
          </span>
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-steel-200/80">
            {files.map((f) => (
              <li key={`${f.name}:${f.size}`} className="flex items-center justify-between gap-3">
                <span className="truncate">{f.name}</span>
                <span className="flex flex-none items-center gap-3">
                  <span className="text-steel-200/50">{Math.ceil(f.size / 1024)} KB</span>
                  <button
                    type="button"
                    onClick={() => removeFile(f.name, f.size)}
                    aria-label={`Remove ${f.name}`}
                    className="font-medium text-steel-200/50 transition-colors hover:text-amber-400"
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-sm font-medium text-white">Or link to a public document</p>
          <p className="mt-1 text-xs text-steel-200/60">
            Paste a URL to a policy hosted online (e.g. your public privacy policy) and we&rsquo;ll
            fetch and read the page &mdash; no download needed.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              inputMode="url"
              value={linkInput}
              onChange={(e) => {
                setLinkInput(e.target.value);
                if (linkError) setLinkError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLink();
                }
              }}
              placeholder="https://example.com/privacy-policy"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-steel-500 focus:border-cleared-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={addLink}
              disabled={!linkInput.trim()}
              className="flex-none rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              Add link
            </button>
          </div>
          {linkError && <p className="mt-1.5 text-xs text-amber-400">{linkError}</p>}
          {links.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-steel-200/80">
              {links.map((l) => (
                <li key={l} className="flex items-center justify-between gap-3">
                  <span className="truncate" title={l}>
                    {l}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLink(l)}
                    aria-label={`Remove ${l}`}
                    className="flex-none font-medium text-steel-200/50 transition-colors hover:text-amber-400"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="mt-5 flex items-start gap-2.5 text-sm text-steel-200/80">
          <input
            type="checkbox"
            checked={attested}
            onChange={(e) => setAttested(e.target.checked)}
            className="mt-0.5 h-4 w-4 flex-none accent-cleared-600"
          />
          <span>
            I confirm these documents are our security policies/procedures and do not contain CUI or
            controlled technical data.
          </span>
        </label>

        <button
          type="button"
          onClick={run}
          disabled={(!files.length && !links.length) || !attested}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-cleared-700/20 transition-colors hover:bg-cleared-700 disabled:opacity-50"
        >
          Analyze my policies
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-steel-200/60">
        No policies written yet, or not ready to share them?{" "}
        <a href="/assessment/questionnaire" className="font-medium text-cleared-500 underline">
          Take the guided questionnaire instead
        </a>
        .
      </p>
    </div>
  );
}
