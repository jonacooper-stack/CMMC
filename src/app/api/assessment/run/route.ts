/**
 * Runs an AI policy-review assessment: extract text from the uploaded blobs,
 * analyze against the 110 controls (Claude assigns statuses), compute the dual
 * SPRS score IN CODE, and persist everything. Synchronous within the function's
 * time budget; long bundles may need an async/queue split on larger plans.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAccount } from "@/lib/account";
import {
  addDocuments,
  createAssessment,
  saveFindings,
  saveSnapshot,
  setStatus,
  type NewDocument,
} from "@/lib/db/queries";
import { extractTextFromUrl } from "@/lib/parse/extract";
import { analyzePolicies, findingsToStatusMap, type PolicyDocument } from "@/lib/ai/analyze";
import { computeDualScore } from "@/lib/sprs/scoring";
import { CONTROLS } from "@/lib/sprs/controls";

export const runtime = "nodejs";
// Headroom for the 14-pass policy analysis (capped to the platform plan limit).
export const maxDuration = 300;

const bodySchema = z.object({
  documents: z
    .array(
      z.object({
        url: z.string().url(),
        filename: z.string().min(1),
        contentType: z.string().optional(),
      }),
    )
    .min(1)
    .max(25),
});

export async function POST(request: Request): Promise<NextResponse> {
  let accountId: string;
  try {
    accountId = (await requireAccount()).id;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  const assessment = await createAssessment(accountId);

  try {
    // 1. Pull text out of every uploaded document.
    const docRows: NewDocument[] = [];
    const policyDocs: PolicyDocument[] = [];
    for (const d of parsed.data.documents) {
      const extracted = await extractTextFromUrl(d.url, d.filename, d.contentType);
      docRows.push({
        filename: d.filename,
        contentType: d.contentType,
        blobUrl: d.url,
        extractedText: extracted.text || undefined,
        extractionError: extracted.error,
      });
      if (extracted.text) policyDocs.push({ filename: d.filename, text: extracted.text });
    }
    await addDocuments(accountId, assessment.id, docRows);

    if (!policyDocs.length) {
      await setStatus(assessment.id, "failed");
      return NextResponse.json(
        { error: "We couldn't read any text from those files. If they're scanned PDFs, try a text-based export." },
        { status: 422 },
      );
    }

    // 2. AI assigns a status per control; 3. score is computed in code.
    const findings = await analyzePolicies(policyDocs);
    const result = computeDualScore(CONTROLS, findingsToStatusMap(findings));

    // 4. Persist.
    await saveFindings(assessment.id, findings);
    await saveSnapshot(assessment.id, result);
    await setStatus(assessment.id, "complete");

    return NextResponse.json({ assessmentId: assessment.id, result, findings });
  } catch (e) {
    console.error("[assessment/run] analysis failed:", e);
    await setStatus(assessment.id, "failed").catch(() => {});
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 },
    );
  }
}
