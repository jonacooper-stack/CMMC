import Anthropic from "@anthropic-ai/sdk";

/**
 * Current Claude model ids used across the assessment. The deterministic SPRS
 * score is always computed in code (see src/lib/sprs/scoring.ts); these models
 * only assign per-control statuses, generate clarifying questions, and write
 * narrative.
 */
export const MODELS = {
  /** Per-family policy analysis — cost/quality balance across 14 passes. */
  analysis: "claude-sonnet-4-6",
  /** Clarifying-interview answer mapping — cheap + fast. */
  interview: "claude-haiku-4-5-20251001",
  /** Reserved for paid, max-quality re-analysis. */
  premium: "claude-opus-4-8",
} as const;

let client: Anthropic | null = null;

/** True once an Anthropic API key is configured (else the analyzer uses a stub). */
export function hasAnthropicKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Lazily create the Anthropic client. Throws only when called without a key. */
export function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  if (!client) client = new Anthropic();
  return client;
}
