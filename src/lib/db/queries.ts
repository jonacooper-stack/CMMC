/**
 * Tenant-scoped data access for the assessment platform. Every read/write is
 * keyed by `accountId` (resolved from Clerk in src/lib/account.ts).
 */
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "./index";
import {
  assessments,
  controlFindings,
  documents,
  interviewQuestions,
  scoreSnapshots,
} from "./schema";
import type { DualScoreResult, Finding } from "@/lib/sprs/types";

export type AssessmentRow = typeof assessments.$inferSelect;
export type AssessmentStatus = AssessmentRow["status"];

export async function createAssessment(accountId: string): Promise<AssessmentRow> {
  const db = getDb();
  const [row] = await db
    .insert(assessments)
    .values({ accountId, status: "analyzing" })
    .returning();
  return row;
}

export async function setStatus(assessmentId: string, status: AssessmentStatus): Promise<void> {
  const db = getDb();
  await db
    .update(assessments)
    .set({ status, updatedAt: new Date() })
    .where(eq(assessments.id, assessmentId));
}

export type NewDocument = {
  filename: string;
  contentType?: string;
  byteSize?: number;
  blobUrl: string;
  extractedText?: string;
  extractionError?: string;
};

export async function addDocuments(
  accountId: string,
  assessmentId: string,
  docs: NewDocument[],
): Promise<void> {
  if (!docs.length) return;
  const db = getDb();
  await db.insert(documents).values(docs.map((d) => ({ ...d, accountId, assessmentId })));
}

/** Replace all findings for an assessment (analysis is recomputed wholesale). */
export async function saveFindings(assessmentId: string, findings: Finding[]): Promise<void> {
  const db = getDb();
  await db.delete(controlFindings).where(eq(controlFindings.assessmentId, assessmentId));
  if (!findings.length) return;
  await db.insert(controlFindings).values(
    findings.map((f) => ({
      assessmentId,
      controlId: f.controlId,
      status: f.status,
      source: f.source ?? "ai_policy",
      rationale: f.rationale,
      citationExcerpt: f.citationExcerpt,
      confidence: f.confidence,
      needsClarification: f.needsClarification ?? false,
    })),
  );
}

export async function saveSnapshot(assessmentId: string, result: DualScoreResult): Promise<void> {
  const db = getDb();
  await db.insert(scoreSnapshots).values({ assessmentId, result });
}

export type InterviewQuestionRow = typeof interviewQuestions.$inferSelect;

/** Replace the interview questions for an assessment and return the saved rows. */
export async function saveInterviewQuestions(
  assessmentId: string,
  items: { controlId: string; question: string }[],
): Promise<InterviewQuestionRow[]> {
  const db = getDb();
  await db.delete(interviewQuestions).where(eq(interviewQuestions.assessmentId, assessmentId));
  if (!items.length) return [];
  return db
    .insert(interviewQuestions)
    .values(items.map((i) => ({ assessmentId, controlId: i.controlId, question: i.question })))
    .returning();
}

export async function getInterviewQuestionsForAssessment(
  assessmentId: string,
): Promise<InterviewQuestionRow[]> {
  const db = getDb();
  return db.select().from(interviewQuestions).where(eq(interviewQuestions.assessmentId, assessmentId));
}

/** Record the respondent's answers against the stored questions. */
export async function saveInterviewAnswers(
  assessmentId: string,
  answers: { controlId: string; answer: string }[],
): Promise<void> {
  const db = getDb();
  const now = new Date();
  for (const a of answers) {
    await db
      .update(interviewQuestions)
      .set({ answer: a.answer, answeredAt: now })
      .where(
        and(
          eq(interviewQuestions.assessmentId, assessmentId),
          eq(interviewQuestions.controlId, a.controlId),
        ),
      );
  }
}

export async function listAssessmentsForAccount(accountId: string): Promise<AssessmentRow[]> {
  const db = getDb();
  return db
    .select()
    .from(assessments)
    .where(eq(assessments.accountId, accountId))
    .orderBy(desc(assessments.createdAt));
}

/** Fetch an assessment (tenant-scoped) plus its latest score snapshot + findings. */
export async function getAssessmentForAccount(accountId: string, assessmentId: string) {
  const db = getDb();
  const [assessment] = await db
    .select()
    .from(assessments)
    .where(and(eq(assessments.id, assessmentId), eq(assessments.accountId, accountId)))
    .limit(1);
  if (!assessment) return null;

  const [snapshot] = await db
    .select()
    .from(scoreSnapshots)
    .where(eq(scoreSnapshots.assessmentId, assessmentId))
    .orderBy(desc(scoreSnapshots.createdAt))
    .limit(1);

  const findings = await db
    .select()
    .from(controlFindings)
    .where(eq(controlFindings.assessmentId, assessmentId));

  return { assessment, result: snapshot?.result ?? null, findings };
}
