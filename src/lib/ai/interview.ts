/**
 * Generates the clarifying-interview questions for a set of gap controls — one
 * short, plain-English yes/no question per control, asking whether the shop
 * actually performs the practice their documents were silent on. Uses the cheap
 * interview model, with a deterministic fallback so the interview still works
 * with no API key configured.
 */
import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getAnthropic, hasAnthropicKey, MODELS } from "./client";
import { FAMILY_BY_ID } from "@/lib/sprs/families";
import type { Control } from "@/lib/sprs/types";

export type InterviewQuestion = { controlId: string; question: string };

/** A serviceable question straight from the control title (no AI needed). */
function fallbackQuestion(c: Control): string {
  const t = c.title.trim();
  const lowered = t.charAt(0).toLowerCase() + t.slice(1);
  return `Do you ${lowered}?`;
}

const questionsTool: Anthropic.Tool = {
  name: "record_interview_questions",
  description: "Return exactly one plain-English yes/no question per control listed in the user message.",
  input_schema: {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            control_id: { type: "string", description: 'NIST control id, e.g. "3.6.1".' },
            question: {
              type: "string",
              description:
                "One short, plain-English yes/no question a non-technical owner can answer, asking whether they actually do this in practice. No jargon, no control numbers.",
            },
          },
          required: ["control_id", "question"],
        },
      },
    },
    required: ["questions"],
  },
};

const schema = z.object({
  questions: z.array(z.object({ control_id: z.string(), question: z.string() })),
});

const SYSTEM = `You help a small defense subcontractor self-assess NIST SP 800-171. For each control, write ONE short, plain-English yes/no question that asks whether they actually perform that practice day-to-day. Avoid jargon and control numbers; a non-technical owner should understand it. Ask whether they DO it, not for evidence.`;

export async function generateInterviewQuestions(controls: Control[]): Promise<InterviewQuestion[]> {
  if (!controls.length) return [];
  if (!hasAnthropicKey()) {
    return controls.map((c) => ({ controlId: c.id, question: fallbackQuestion(c) }));
  }
  try {
    const client = getAnthropic();
    const list = controls
      .map((c) => `${c.id} (${FAMILY_BY_ID[c.family]?.name ?? c.family}) — ${c.title}`)
      .join("\n");
    const res = await client.messages.create({
      model: MODELS.interview,
      max_tokens: 2048,
      system: SYSTEM,
      tools: [questionsTool],
      tool_choice: { type: "tool", name: questionsTool.name },
      messages: [{ role: "user", content: `Write one yes/no question for each control:\n\n${list}` }],
    });
    const block = res.content.find((b) => b.type === "tool_use");
    const parsed = block && block.type === "tool_use" ? schema.safeParse(block.input) : null;
    const byId = new Map<string, string>();
    if (parsed?.success) for (const q of parsed.data.questions) byId.set(q.control_id, q.question);
    // One question per control; fall back for any the model omitted.
    return controls.map((c) => ({ controlId: c.id, question: byId.get(c.id) ?? fallbackQuestion(c) }));
  } catch (e) {
    console.error("[interview] question generation failed, using fallback:", e);
    return controls.map((c) => ({ controlId: c.id, question: fallbackQuestion(c) }));
  }
}
