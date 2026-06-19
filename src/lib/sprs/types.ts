/**
 * Types for the SPRS / NIST SP 800-171 Rev 2 assessment engine.
 *
 * Scoring follows the DoD "NIST SP 800-171 Assessment Methodology": you start
 * at 110 and subtract a control's weight (1, 3, or 5) for each requirement that
 * is not met. The lowest possible score is -203.
 */

/**
 * DoD SPRS point weight — points deducted from 110 if the requirement is NOT
 * met. 5/3/1 per the methodology; 0 marks the single NA requirement (3.12.4,
 * the SSP), a gating prerequisite rather than a scored deduction.
 */
export type ControlWeight = 0 | 1 | 3 | 5;

/** A single NIST 800-171 Rev 2 control objective + its DoD SPRS weight. */
export type Control = {
  /** NIST 800-171 requirement id, e.g. "3.1.1". */
  id: string;
  /** Family id, e.g. "3.1". */
  family: string;
  /** Official short requirement title. */
  title: string;
  /** Points deducted from 110 if the requirement is NOT met (0 = NA/gating). */
  weight: ControlWeight;
  /**
   * Reduced deduction when the requirement is only PARTIALLY met. Per the DoD
   * methodology this applies to 3.5.3 (multifactor authentication) and 3.13.11
   * (FIPS-validated cryptography): 3 points instead of 5 when partially in place.
   * When undefined, a "partial" answer deducts the full `weight`.
   */
  partialWeight?: ControlWeight;
  /** Optional advisory note (e.g. the SSP gating-prerequisite explanation). */
  note?: string;
};

/**
 * How a respondent rates a single control. "na" (not applicable) is excluded
 * from scoring entirely — no deduction and not counted as a gap — for controls
 * that genuinely don't apply (e.g. a remote-first shop with no internal network).
 */
export type ControlStatus = "met" | "partial" | "not_met" | "na";

/** Answers keyed by control id. A missing entry is treated as `not_met`. */
export type Answers = Record<string, ControlStatus | undefined>;

export type FamilyPosture = {
  id: string;
  name: string;
  /** Applicable controls in this family (excludes any marked N/A). */
  total: number;
  met: number;
  partial: number;
  notMet: number;
  /** Controls marked not applicable. */
  na: number;
  /** Points lost in this family (sum of deductions). */
  pointsLost: number;
};

export type RemediationItem = {
  id: string;
  family: string;
  title: string;
  status: Exclude<ControlStatus, "met" | "na">;
  /** Points recoverable by bringing this control to "met". */
  points: number;
};

export type ScoreResult = {
  /** Current SPRS estimate (clamped to [MIN_SCORE, MAX_SCORE]). */
  score: number;
  max: number;
  min: number;
  totalControls: number;
  /** How many controls the respondent explicitly answered. */
  answered: number;
  metCount: number;
  partialCount: number;
  notMetCount: number;
  /** Controls marked not applicable (excluded from scoring). */
  naCount: number;
  /** Total points below 110 (before clamping). */
  pointsLost: number;
  byFamily: FamilyPosture[];
  /** Open gaps, highest point-value first. */
  remediation: RemediationItem[];
};

export const MAX_SCORE = 110;
export const MIN_SCORE = -203;

/**
 * Richer 4-state status used by the AI policy analysis (and the future
 * evidence-aware questionnaire). Distinguishes whether a "yes" has an auditable
 * evidence trail — exactly the gap Muster closes.
 */
export type FindingStatus = "met_evidence" | "met_no_evidence" | "partial" | "not_met";

/** A per-control finding from AI policy analysis, the clarifying interview, or manual entry. */
export type Finding = {
  controlId: string;
  status: FindingStatus;
  source?: "ai_policy" | "interview" | "manual";
  /** Short plain-English justification for the status. */
  rationale?: string;
  /** Verbatim excerpt from the uploaded policy that supports the status. */
  citationExcerpt?: string;
  /** Model confidence 0..1 (analysis steps only). */
  confidence?: number;
  /** True when the policy was silent/ambiguous — drives the clarifying interview. */
  needsClarification?: boolean;
};

/** A control the respondent does but cannot yet prove — at risk in a real assessment. */
export type AtRiskItem = {
  id: string;
  family: string;
  title: string;
  /** Points that would be lost in an assessment for lack of an evidence trail. */
  points: number;
};

/**
 * Two scores from one set of findings:
 * - `selfAssessed`: both "met_*" count as met (what they believe they have).
 * - `defensible`: only "met_evidence" counts; "met_no_evidence" is treated as
 *   not-met (what would actually survive an assessment).
 */
export type DualScoreResult = {
  selfAssessed: ScoreResult;
  defensible: ScoreResult;
  /** Points at risk purely for lack of evidence (sum of at-risk weights). */
  evidenceGap: number;
  atRisk: AtRiskItem[];
};
