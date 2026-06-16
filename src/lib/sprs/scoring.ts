/**
 * Deterministic SPRS scorer. This is the "moat in software" — the score is
 * computed by code (the DoD Assessment Methodology), never by an LLM. The AI
 * layer (added later) only assists with clarifying questions and narrative.
 */
import {
  type Answers,
  type Control,
  type ControlStatus,
  type FamilyPosture,
  type RemediationItem,
  type ScoreResult,
  MAX_SCORE,
  MIN_SCORE,
} from "./types";
import { FAMILIES } from "./families";

/** Points deducted for a single control given its answered status. */
export function deductionFor(control: Control, status: ControlStatus): number {
  if (status === "met") return 0;
  if (status === "partial") return control.partialWeight ?? control.weight;
  return control.weight;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/**
 * Compute the SPRS estimate from a set of answers. Unanswered controls are
 * treated as `not_met` (a conservative, honest estimate).
 */
export function computeScore(controls: Control[], answers: Answers): ScoreResult {
  const famPosture = new Map<string, FamilyPosture>(
    FAMILIES.map((f) => [
      f.id,
      { id: f.id, name: f.name, total: 0, met: 0, partial: 0, notMet: 0, pointsLost: 0 },
    ]),
  );
  const remediation: RemediationItem[] = [];

  let pointsLost = 0;
  let answered = 0;
  let metCount = 0;
  let partialCount = 0;
  let notMetCount = 0;

  for (const control of controls) {
    const answer = answers[control.id];
    if (answer) answered += 1;
    const status: ControlStatus = answer ?? "not_met";

    const fam = famPosture.get(control.family);
    if (fam) fam.total += 1;

    if (status === "met") {
      metCount += 1;
      if (fam) fam.met += 1;
      continue;
    }

    const points = deductionFor(control, status);
    pointsLost += points;

    if (status === "partial") {
      partialCount += 1;
      if (fam) fam.partial += 1;
    } else {
      notMetCount += 1;
      if (fam) fam.notMet += 1;
    }
    if (fam) fam.pointsLost += points;

    remediation.push({
      id: control.id,
      family: control.family,
      title: control.title,
      status,
      points,
    });
  }

  // Biggest point recovery first, then by control id (numeric-aware).
  remediation.sort(
    (a, b) =>
      b.points - a.points || a.id.localeCompare(b.id, undefined, { numeric: true }),
  );

  return {
    score: clamp(MAX_SCORE - pointsLost, MIN_SCORE, MAX_SCORE),
    max: MAX_SCORE,
    min: MIN_SCORE,
    totalControls: controls.length,
    answered,
    metCount,
    partialCount,
    notMetCount,
    pointsLost,
    byFamily: FAMILIES.map((f) => famPosture.get(f.id)!).filter((f) => f.total > 0),
    remediation,
  };
}

/** A short, plain-English reading of where a score lands. */
export function scoreVerdict(score: number): { label: string; summary: string } {
  if (score >= 110) {
    return {
      label: "Fully implemented",
      summary:
        "Your answers map to a perfect 110. The next step is proving it — documented evidence (SSP + supporting artifacts) is what an assessor actually checks.",
    };
  }
  if (score >= 88) {
    return {
      label: "Strong, with gaps to close",
      summary:
        "You're most of the way there. A focused remediation push plus solid documentation gets you to a defensible, postable score.",
    };
  }
  if (score >= 0) {
    return {
      label: "Material gaps",
      summary:
        "There's real work to do, but it's tractable and mostly process + documentation rather than expensive tooling. Prioritize the high-point items first.",
    };
  }
  return {
    label: "Early stage",
    summary:
      "A negative score is common for shops just getting started — it simply means several high-weight controls aren't in place yet. The remediation plan below is your roadmap.",
  };
}
