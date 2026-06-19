/**
 * Drizzle schema (Postgres / Neon) for the AI policy-review assessment platform.
 *
 * Tenancy: every row hangs off an `accounts` row, which is keyed to a Clerk
 * principal (org preferred, else user). The DAL always resolves `accountId`
 * from Clerk server-side — never from client input.
 */
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  real,
  boolean,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { DualScoreResult, FindingStatus } from "../sprs/types";

export const planEnum = pgEnum("plan", ["free", "paid"]);
export const assessmentStatusEnum = pgEnum("assessment_status", [
  "draft",
  "uploading",
  "analyzing",
  "interview",
  "complete",
  "failed",
]);
export const findingStatusEnum = pgEnum("finding_status", [
  "met_evidence",
  "met_no_evidence",
  "partial",
  "not_met",
  "na",
]);
export const findingSourceEnum = pgEnum("finding_source", ["ai_policy", "interview", "manual"]);

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  /** Clerk org id (preferred tenant key). */
  clerkOrgId: text("clerk_org_id").unique(),
  /** Clerk user id (fallback tenant key when there's no org). */
  clerkUserId: text("clerk_user_id"),
  companyName: text("company_name"),
  plan: planEnum("plan").notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assessments = pgTable(
  "assessments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    status: assessmentStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("assessments_account_idx").on(t.accountId)],
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    contentType: text("content_type"),
    byteSize: integer("byte_size"),
    blobUrl: text("blob_url").notNull(),
    extractedText: text("extracted_text"),
    extractionError: text("extraction_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("documents_assessment_idx").on(t.assessmentId)],
);

export const controlFindings = pgTable(
  "control_findings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    /** NIST 800-171 control id, e.g. "3.1.1". */
    controlId: text("control_id").notNull(),
    // Stored as text (not the pgEnum) so new statuses like "na" don't require a
    // fragile ALTER TYPE ... ADD VALUE on the serverless driver. The TS union is
    // still enforced in app code via $type.
    status: text("status").$type<FindingStatus>().notNull(),
    source: findingSourceEnum("source").notNull().default("ai_policy"),
    rationale: text("rationale"),
    citationExcerpt: text("citation_excerpt"),
    confidence: real("confidence"),
    needsClarification: boolean("needs_clarification").notNull().default(false),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("findings_assessment_control_idx").on(t.assessmentId, t.controlId)],
);

export const interviewQuestions = pgTable(
  "interview_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    controlId: text("control_id").notNull(),
    question: text("question").notNull(),
    answer: text("answer"),
    answeredAt: timestamp("answered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("interview_assessment_idx").on(t.assessmentId)],
);

export const scoreSnapshots = pgTable(
  "score_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    assessmentId: uuid("assessment_id")
      .notNull()
      .references(() => assessments.id, { onDelete: "cascade" }),
    /** Serialized DualScoreResult at the time of the snapshot. */
    result: jsonb("result").$type<DualScoreResult>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("snapshots_assessment_idx").on(t.assessmentId)],
);
