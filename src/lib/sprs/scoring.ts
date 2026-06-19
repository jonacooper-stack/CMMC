/**
 * Deterministic SPRS scorer. This is the "moat in software" — the score is
 * computed by code (the DoD Assessment Methodology), never by an LLM. The AI
 * layer (added later) only assists with clarifying questions and narrative.
 */
import {
  type Answers,
  type AtRiskItem,
  type Control,
  type ControlStatus,
  type DualScoreResult,
  type FamilyPosture,
  type Finding,
  type FindingStatus,
  type RemediationItem,
  type ScoreResult,
  MAX_SCORE,
  MIN_SCORE,
} from "./types";
import { FAMILIES } from "./families";

/** Points deducted for a single control given its answered status. */
export function deductionFor(control: Control, status: ControlStatus): number {
  if (status === "met" || status === "na") return 0;
  if (status === "partial") return control.partialWeight ?? control.weight;
  return control.weight;
}

/**
 * Collapse a 4-state finding into the deterministic ControlStatus under a lens:
 * - "self": both "met_*" count as met (self-assessed).
 * - "defensible": only "met_evidence" counts; "met_no_evidence" → not_met.
 */
export function findingToControlStatus(
  status: FindingStatus,
  lens: "self" | "defensible",
): ControlStatus {
  switch (status) {
    case "met_evidence":
      return "met";
    case "met_no_evidence":
      return lens === "self" ? "met" : "not_met";
    case "partial":
      return "partial";
    case "not_met":
      return "not_met";
    case "na":
      return "na";
  }
}

/**
 * Dual SPRS score from a set of findings. Reuses the exact same deterministic
 * `computeScore` (the moat) twice — once per lens — so neither score is ever
 * produced by an LLM. Unanswered controls are treated as not_met in both lenses.
 */
export function computeDualScore(
  controls: Control[],
  findings: Record<string, FindingStatus | undefined>,
): DualScoreResult {
  const selfAnswers: Answers = {};
  const defensibleAnswers: Answers = {};
  for (const control of controls) {
    const finding = findings[control.id];
    if (!finding) continue;
    selfAnswers[control.id] = findingToControlStatus(finding, "self");
    defensibleAnswers[control.id] = findingToControlStatus(finding, "defensible");
  }

  const atRisk: AtRiskItem[] = [];
  for (const control of controls) {
    if (findings[control.id] === "met_no_evidence") {
      atRisk.push({
        id: control.id,
        family: control.family,
        title: control.title,
        points: control.weight,
      });
    }
  }
  atRisk.sort(
    (a, b) => b.points - a.points || a.id.localeCompare(b.id, undefined, { numeric: true }),
  );

  return {
    selfAssessed: computeScore(controls, selfAnswers),
    defensible: computeScore(controls, defensibleAnswers),
    evidenceGap: atRisk.reduce((sum, item) => sum + item.points, 0),
    atRisk,
  };
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
      { id: f.id, name: f.name, total: 0, met: 0, partial: 0, notMet: 0, na: 0, pointsLost: 0 },
    ]),
  );
  const remediation: RemediationItem[] = [];

  let pointsLost = 0;
  let answered = 0;
  let metCount = 0;
  let partialCount = 0;
  let notMetCount = 0;
  let naCount = 0;

  for (const control of controls) {
    const answer = answers[control.id];
    if (answer) answered += 1;
    const status: ControlStatus = answer ?? "not_met";

    const fam = famPosture.get(control.family);

    // Not applicable: drop it from the assessment — no deduction, and it does
    // not count toward the family's applicable total or the gap list.
    if (status === "na") {
      naCount += 1;
      if (fam) fam.na += 1;
      continue;
    }

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

    // Skip 0-point (NA) controls like 3.12.4 from the point-ranked plan.
    if (points > 0) {
      remediation.push({
        id: control.id,
        family: control.family,
        title: control.title,
        status,
        points,
      });
    }
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
    naCount,
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

/** Bridge findings → the status map computeDualScore expects (latest wins). */
export function findingsToStatusMap(findings: Finding[]): Record<string, FindingStatus> {
  const map: Record<string, FindingStatus> = {};
  for (const f of findings) map[f.controlId] = f.status;
  return map;
}
