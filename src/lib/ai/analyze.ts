/**
 * AI policy analysis. Claude reviews uploaded policy text against the 110 NIST
 * 800-171 controls and assigns each a 4-state FindingStatus + citation +
 * rationale. It does NOT compute the score — computeDualScore() does that in
 * code (the moat). One pass per family (14) maximizes prompt-cache reuse of the
 * policy text and isolates failures; results are reconciled so every control
 * always has a finding.
 */
import type Anthropic from "@anthropic-ai/sdk";
import pLimit from "p-limit";
import { z } from "zod";
import { CONTROLS } from "@/lib/sprs/controls";
import { FAMILIES } from "@/lib/sprs/families";
import type { Control, Finding, FindingStatus } from "@/lib/sprs/types";
import { getAnthropic, hasAnthropicKey, MODELS } from "./client";

/** Cap on combined policy text sent to the model (keeps token cost bounded). */
const MAX_POLICY_CHARS = 200_000;
/** Parallelism for the cache-warm fan-out (kept modest to avoid rate limits). */
const FAMILY_CONCURRENCY = 6;
/** Output cap per family — one short finding per control, so this is generous. */
const MAX_OUTPUT_TOKENS = 4096;

export type PolicyDocument = { filename: string; text: string };

const STATUS_VALUES = ["met_evidence", "met_no_evidence", "partial", "not_met"] as const;

const findingSchema = z.object({
  control_id: z.string(),
  status: z.enum(STATUS_VALUES),
  citation_excerpt: z.string().optional(),
  rationale: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  needs_clarification: z.boolean().optional(),
});
const toolInputSchema = z.object({ findings: z.array(findingSchema) });

const recordFindingsTool: Anthropic.Tool = {
  name: "record_control_findings",
  description:
    "Record an implementation finding for each NIST SP 800-171 control listed in the user message, based ONLY on the provided policy documents.",
  input_schema: {
    type: "object",
    properties: {
      findings: {
        type: "array",
        description: "Exactly one entry per control listed in the user message.",
        items: {
          type: "object",
          properties: {
            control_id: { type: "string", description: 'NIST control id, e.g. "3.1.1".' },
            status: {
              type: "string",
              enum: [...STATUS_VALUES],
              description:
                "met_evidence = policy specifically and fully documents the requirement (defensible written basis); met_no_evidence = asserted/implied but lacking specifics that would hold up in an assessment; partial = only some aspects addressed; not_met = absent or silent.",
            },
            citation_excerpt: {
              type: "string",
              description: "Short verbatim quote from the policy supporting the status (empty if none).",
            },
            rationale: { type: "string", description: "One-sentence justification." },
            confidence: { type: "number", description: "Confidence 0..1." },
            needs_clarification: {
              type: "boolean",
              description: "True if the policy is silent or too vague to judge — a clarifying question is needed.",
            },
          },
          required: ["control_id", "status", "needs_clarification"],
        },
      },
    },
    required: ["findings"],
  },
};

const SYSTEM_INSTRUCTIONS = `You are an experienced NIST SP 800-171 / CMMC assessor reviewing a defense subcontractor's written security policies.

For each control you are asked about, decide how well the PROVIDED POLICY DOCUMENTS address it, using exactly one status:
- "met_evidence": the policy specifically and fully documents the requirement — a defensible, auditable written basis.
- "met_no_evidence": the requirement is asserted or implied, but the policy lacks the specifics that would hold up under assessment.
- "partial": only some aspects of the requirement are addressed.
- "not_met": the requirement is absent or the documents are silent on it.

Rules:
- Judge ONLY from the provided documents. Do not assume a control is met because it is "common".
- If the documents are silent or too vague to judge, use "not_met" or "partial" AND set needs_clarification = true.
- Provide a short verbatim citation_excerpt when you find supporting text.
- Do NOT compute or mention any score — scoring is handled separately in code.
- Call record_control_findings with exactly one finding per control listed.`;

function buildPolicyBlob(documents: PolicyDocument[]): string {
  const joined = documents.map((d) => `=== ${d.filename} ===\n${d.text}`).join("\n\n");
  return joined.length > MAX_POLICY_CHARS ? joined.slice(0, MAX_POLICY_CHARS) : joined;
}

function defaultFinding(controlId: string, rationale: string): Finding {
  return {
    controlId,
    status: "not_met",
    source: "ai_policy",
    rationale,
    needsClarification: true,
  };
}

async function analyzeFamily(
  client: Anthropic,
  familyId: string,
  familyName: string,
  controls: Control[],
  policyBlob: string,
): Promise<Finding[]> {
  const controlList = controls.map((c) => `${c.id} — ${c.title}`).join("\n");
  const res = await client.messages.create({
    model: MODELS.analysis,
    max_tokens: MAX_OUTPUT_TOKENS,
    system: [
      { type: "text", text: SYSTEM_INSTRUCTIONS },
      {
        type: "text",
        text: `POLICY DOCUMENTS:\n${policyBlob}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [recordFindingsTool],
    tool_choice: { type: "tool", name: recordFindingsTool.name },
    messages: [
      {
        role: "user",
        content: `Assess these NIST 800-171 controls in family ${familyId} (${familyName}). Return exactly one finding per control:\n\n${controlList}`,
      },
    ],
  });

  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") return [];
  const parsed = toolInputSchema.safeParse(block.input);
  if (!parsed.success) return [];

  const validIds = new Set(controls.map((c) => c.id));
  return parsed.data.findings
    .filter((f) => validIds.has(f.control_id))
    .map((f) => ({
      controlId: f.control_id,
      status: f.status as FindingStatus,
      source: "ai_policy" as const,
      rationale: f.rationale,
      citationExcerpt: f.citation_excerpt,
      confidence: f.confidence,
      needsClarification: f.needs_clarification ?? false,
    }));
}

/**
 * Analyze uploaded policy documents and return one Finding per control (all 110).
 * Falls back to a deterministic stub (everything not_met + needs clarification)
 * when no API key is configured, so the flow is testable offline.
 */
export async function analyzePolicies(documents: PolicyDocument[]): Promise<Finding[]> {
  if (!hasAnthropicKey()) {
    return CONTROLS.map((c) =>
      defaultFinding(c.id, "AI analysis stub — no ANTHROPIC_API_KEY configured."),
    );
  }

  const client = getAnthropic();
  const policyBlob = buildPolicyBlob(documents);

  const byFamily = new Map<string, Control[]>();
  for (const f of FAMILIES) byFamily.set(f.id, []);
  for (const c of CONTROLS) byFamily.get(c.family)?.push(c);

  // Warm the prompt cache with the first family: this single call writes the
  // (potentially large) policy text to the ephemeral cache. If it fails — bad
  // key, auth, or a rate limit that survived the SDK's retries — it's fatal for
  // the whole run, so let it propagate to the route's error handler.
  const [first, ...rest] = FAMILIES;
  const warm = await analyzeFamily(
    client,
    first.id,
    first.name,
    byFamily.get(first.id) ?? [],
    policyBlob,
  );

  // Fan the remaining families out concurrently; they read the warm cache, so
  // fresh-input token pressure (the real rate-limit risk on big policy sets)
  // stays low. A single family failing degrades to defaults for its controls
  // rather than failing the whole assessment.
  const limit = pLimit(FAMILY_CONCURRENCY);
  const restResults = await Promise.all(
    rest.map((f) =>
      limit(async () => {
        try {
          return await analyzeFamily(client, f.id, f.name, byFamily.get(f.id) ?? [], policyBlob);
        } catch (e) {
          console.error(`[analyze] family ${f.id} failed:`, e);
          return [] as Finding[];
        }
      }),
    ),
  );

  // Reconcile: every control must have a finding; default any the model omitted.
  const found = new Map<string, Finding>();
  for (const finding of [warm, ...restResults].flat()) found.set(finding.controlId, finding);
  return CONTROLS.map(
    (c) => found.get(c.id) ?? defaultFinding(c.id, "Not addressed in the provided policies."),
  );
}

/** Bridge findings → the status map that computeDualScore expects. */
export function findingsToStatusMap(findings: Finding[]): Record<string, FindingStatus> {
  const map: Record<string, FindingStatus> = {};
  for (const f of findings) map[f.controlId] = f.status;
  return map;
}
