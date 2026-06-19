/**
 * Clarifying-interview endpoint for an assessment.
 * - GET  ?assessmentId=…  → the gap questions (generated + persisted on first call).
 * - POST { assessmentId, answers } → fold answers into the findings, re-score, persist.
 *
 * A "yes" becomes a `met_no_evidence` finding: it counts toward the self-assessed
 * score but is flagged as at-risk until documented — exactly the evidence gap the
 * product is built around. Re-scoring is deterministic (no second AI pass).
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentAccount } from "@/lib/account";
import {
  getAssessmentForAccount,
  getInterviewQuestionsForAssessment,
  saveFindings,
  saveInterviewAnswers,
  saveInterviewQuestions,
  saveSnapshot,
  setStatus,
} from "@/lib/db/queries";
import { gapControls } from "@/lib/sprs/coverage";
import { generateInterviewQuestions } from "@/lib/ai/interview";
import { computeDualScore } from "@/lib/sprs/scoring";
import { findingsToStatusMap } from "@/lib/ai/analyze";
import { CONTROLS } from "@/lib/sprs/controls";
import { FAMILY_BY_ID } from "@/lib/sprs/families";
import type { Finding, FindingStatus } from "@/lib/sprs/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const CONTROL_BY_ID = new Map(CONTROLS.map((c) => [c.id, c]));

type FindingRow = {
  controlId: string;
  status: string;
  source: "ai_policy" | "interview" | "manual";
  rationale: string | null;
  citationExcerpt: string | null;
  confidence: number | null;
  needsClarification: boolean;
};

function toFinding(r: FindingRow): Finding {
  return {
    controlId: r.controlId,
    status: r.status as FindingStatus,
    source: r.source,
    rationale: r.rationale ?? undefined,
    citationExcerpt: r.citationExcerpt ?? undefined,
    confidence: r.confidence ?? undefined,
    needsClarification: r.needsClarification,
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  const account = await getCurrentAccount().catch(() => null);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assessmentId = new URL(request.url).searchParams.get("assessmentId") ?? "";
  const data = await getAssessmentForAccount(account.id, assessmentId);
  if (!data) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  // Reuse questions already generated for this assessment; otherwise build them
  // from the current gaps and persist so refreshes are stable.
  let rows = await getInterviewQuestionsForAssessment(assessmentId);
  if (!rows.length) {
    const gaps = gapControls(data.findings.map(toFinding));
    const generated = await generateInterviewQuestions(gaps);
    if (generated.length) rows = await saveInterviewQuestions(assessmentId, generated);
  }

  const questions = rows.map((r) => {
    const control = CONTROL_BY_ID.get(r.controlId);
    return {
      controlId: r.controlId,
      question: r.question,
      controlTitle: control?.title ?? r.controlId,
      familyName: control ? FAMILY_BY_ID[control.family]?.name ?? "" : "",
      answer: r.answer,
    };
  });
  return NextResponse.json({ questions });
}

const RESPONSE_TO_STATUS: Record<"yes" | "partial" | "no", FindingStatus> = {
  yes: "met_no_evidence",
  partial: "partial",
  no: "not_met",
};

const RATIONALE: Record<"yes" | "partial" | "no", string> = {
  yes: "Confirmed in the clarifying interview — not yet documented.",
  partial: "Partially in place per the clarifying interview.",
  no: "Confirmed not in place in the clarifying interview.",
};

const bodySchema = z.object({
  assessmentId: z.string().uuid(),
  answers: z
    .array(
      z.object({
        controlId: z.string(),
        response: z.enum(["yes", "partial", "no"]),
        note: z.string().max(2000).optional(),
      }),
    )
    .min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  const account = await getCurrentAccount().catch(() => null);
  if (!account) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  const { assessmentId, answers } = parsed.data;

  const data = await getAssessmentForAccount(account.id, assessmentId);
  if (!data) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

  try {
    // Merge interview answers over the existing findings.
    const merged = new Map<string, Finding>();
    for (const r of data.findings) merged.set(r.controlId, toFinding(r));
    for (const a of answers) {
      if (!CONTROL_BY_ID.has(a.controlId)) continue;
      merged.set(a.controlId, {
        controlId: a.controlId,
        status: RESPONSE_TO_STATUS[a.response],
        source: "interview",
        rationale: a.note?.trim() || RATIONALE[a.response],
        needsClarification: false,
      });
    }

    const mergedFindings = [...merged.values()];
    const result = computeDualScore(CONTROLS, findingsToStatusMap(mergedFindings));

    await saveFindings(assessmentId, mergedFindings);
    await saveSnapshot(assessmentId, result);
    await saveInterviewAnswers(
      assessmentId,
      answers.map((a) => ({
        controlId: a.controlId,
        answer: a.note?.trim() ? `${a.response}: ${a.note.trim()}` : a.response,
      })),
    );
    await setStatus(assessmentId, "complete");

    return NextResponse.json({ result, findings: mergedFindings });
  } catch (e) {
    console.error("[assessment/interview] re-score failed:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update score" },
      { status: 500 },
    );
  }
}
