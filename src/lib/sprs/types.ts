/**
 * Types for the SPRS / NIST SP 800-171 Rev 2 assessment engine.
 *
 * Scoring follows the DoD "NIST SP 800-171 Assessment Methodology": you start
 * at 110 and subtract a control's weight (1, 3, or 5) for each requirement that
 * is not met. The lowest possible score is -203.
 */

export type ControlWeight = 1 | 3 | 5;

/** A single NIST 800-171 Rev 2 control objective + its DoD SPRS weight. */
export type Control = {
  /** NIST 800-171 requirement id, e.g. "3.1.1". */
  id: string;
  /** Family id, e.g. "3.1". */
  family: string;
  /** Official short requirement title. */
  title: string;
  /** Points deducted from 110 if the requirement is NOT met. */
  weight: ControlWeight;
  /**
   * Reduced deduction when the requirement is only PARTIALLY met. Per the DoD
   * methodology this applies to 3.5.3 (multifactor authentication) and 3.13.11
   * (FIPS-validated cryptography): 3 points instead of 5 when partially in place.
   * When undefined, a "partial" answer deducts the full `weight`.
   */
  partialWeight?: ControlWeight;
};

/** How a respondent rates a single control. */
export type ControlStatus = "met" | "partial" | "not_met";

/** Answers keyed by control id. A missing entry is treated as `not_met`. */
export type Answers = Record<string, ControlStatus | undefined>;

export type FamilyPosture = {
  id: string;
  name: string;
  total: number;
  met: number;
  partial: number;
  notMet: number;
  /** Points lost in this family (sum of deductions). */
  pointsLost: number;
};

export type RemediationItem = {
  id: string;
  family: string;
  title: string;
  status: Exclude<ControlStatus, "met">;
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
  /** Total points below 110 (before clamping). */
  pointsLost: number;
  byFamily: FamilyPosture[];
  /** Open gaps, highest point-value first. */
  remediation: RemediationItem[];
};

export const MAX_SCORE = 110;
export const MIN_SCORE = -203;
