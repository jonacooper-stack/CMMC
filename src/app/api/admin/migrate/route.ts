/**
 * One-time database bootstrap. Visit `/api/admin/migrate` while signed in to
 * create the schema in the connected Postgres. Idempotent (safe to re-run):
 * enums + foreign keys are guarded with duplicate_object handlers and tables /
 * indexes use IF NOT EXISTS.
 *
 * Note: gated to any signed-in user (fine while only the founder has an
 * account). Lock down or remove once the platform has real users.
 */
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

const STATEMENTS: string[] = [
  `DO $$ BEGIN CREATE TYPE "assessment_status" AS ENUM('draft','uploading','analyzing','interview','complete','failed'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE "finding_source" AS ENUM('ai_policy','interview','manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE "finding_status" AS ENUM('met_evidence','met_no_evidence','partial','not_met'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN CREATE TYPE "plan" AS ENUM('free','paid'); EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `CREATE TABLE IF NOT EXISTS "accounts" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "clerk_org_id" text,
    "clerk_user_id" text,
    "company_name" text,
    "plan" "plan" DEFAULT 'free' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "accounts_clerk_org_id_unique" UNIQUE("clerk_org_id")
  );`,
  `CREATE TABLE IF NOT EXISTS "assessments" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "account_id" uuid NOT NULL,
    "status" "assessment_status" DEFAULT 'draft' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "control_findings" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "assessment_id" uuid NOT NULL,
    "control_id" text NOT NULL,
    "status" "finding_status" NOT NULL,
    "source" "finding_source" DEFAULT 'ai_policy' NOT NULL,
    "rationale" text,
    "citation_excerpt" text,
    "confidence" real,
    "needs_clarification" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "documents" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "assessment_id" uuid NOT NULL,
    "account_id" uuid NOT NULL,
    "filename" text NOT NULL,
    "content_type" text,
    "byte_size" integer,
    "blob_url" text NOT NULL,
    "extracted_text" text,
    "extraction_error" text,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "interview_questions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "assessment_id" uuid NOT NULL,
    "control_id" text NOT NULL,
    "question" text NOT NULL,
    "answer" text,
    "answered_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS "score_snapshots" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "assessment_id" uuid NOT NULL,
    "result" jsonb NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
  );`,
  `DO $$ BEGIN ALTER TABLE "assessments" ADD CONSTRAINT "assessments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN ALTER TABLE "control_findings" ADD CONSTRAINT "control_findings_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN ALTER TABLE "documents" ADD CONSTRAINT "documents_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN ALTER TABLE "documents" ADD CONSTRAINT "documents_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `DO $$ BEGIN ALTER TABLE "score_snapshots" ADD CONSTRAINT "score_snapshots_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade; EXCEPTION WHEN duplicate_object THEN null; END $$;`,
  `CREATE INDEX IF NOT EXISTS "assessments_account_idx" ON "assessments" ("account_id");`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "findings_assessment_control_idx" ON "control_findings" ("assessment_id","control_id");`,
  `CREATE INDEX IF NOT EXISTS "documents_assessment_idx" ON "documents" ("assessment_id");`,
  `CREATE INDEX IF NOT EXISTS "interview_assessment_idx" ON "interview_questions" ("assessment_id");`,
  `CREATE INDEX IF NOT EXISTS "snapshots_assessment_idx" ON "score_snapshots" ("assessment_id");`,
];

async function runMigration(): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in first, then reload this URL." }, { status: 401 });
  }
  try {
    const db = getDb();
    for (const statement of STATEMENTS) {
      await db.execute(sql.raw(statement));
    }
    return NextResponse.json({ ok: true, message: "Database is set up. You can run an assessment now." });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Migration failed" },
      { status: 500 },
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return runMigration();
}

export async function POST(): Promise<NextResponse> {
  return runMigration();
}
