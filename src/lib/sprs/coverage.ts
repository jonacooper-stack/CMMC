/**
 * Policy-area coverage, derived from the per-control findings. This is the
 * shared foundation for three features: the "doesn't look like a policy" check,
 * the recommended-policy library, and the gap-driven interview. It's a
 * deterministic rollup of findings the analyzer already produced — no extra AI.
 */
import { CONTROLS } from "./controls";
import { FAMILIES } from "./families";
import type { Control, Finding, FindingStatus } from "./types";

const ADDRESSED: ReadonlySet<FindingStatus> = new Set<FindingStatus>([
  "met_evidence",
  "met_no_evidence",
  "partial",
]);

export type CoverageStatus = "covered" | "partial" | "missing";

export type FamilyCoverage = {
  id: string;
  name: string;
  intro: string;
  total: number;
  /** Controls in this family the policies address at all (any non-not_met). */
  addressed: number;
  /** Controls the analyzer flagged as silent/ambiguous. */
  needsClarification: number;
  status: CoverageStatus;
};

export type Coverage = {
  families: FamilyCoverage[];
  /** Families with zero addressed controls — the missing policy areas. */
  missing: FamilyCoverage[];
  /** Total controls addressed at all, across every family. */
  addressedControls: number;
  /**
   * Heuristic: did the upload resemble a security-policy set at all? A
   * non-policy document (a résumé, an invoice, a random PDF) addresses
   * essentially nothing, so a near-zero count is a strong "wrong file" signal.
   */
  looksLikePolicy: boolean;
};

const controlsInFamily = (familyId: string): Control[] =>
  CONTROLS.filter((c) => c.family === familyId);

/** Roll per-control findings up into per-family coverage + an overall signal. */
export function computeCoverage(findings: Finding[]): Coverage {
  const byId = new Map(findings.map((f) => [f.controlId, f] as const));

  const families: FamilyCoverage[] = FAMILIES.map((fam) => {
    const controls = controlsInFamily(fam.id);
    let addressed = 0;
    let needsClarification = 0;
    for (const c of controls) {
      const f = byId.get(c.id);
      if (f && ADDRESSED.has(f.status)) addressed += 1;
      if (f?.needsClarification) needsClarification += 1;
    }
    const total = controls.length;
    const ratio = total ? addressed / total : 0;
    const status: CoverageStatus =
      addressed === 0 ? "missing" : ratio >= 0.6 ? "covered" : "partial";
    return { id: fam.id, name: fam.name, intro: fam.intro, total, addressed, needsClarification, status };
  });

  const addressedControls = findings.filter((f) => ADDRESSED.has(f.status)).length;
  return {
    families,
    missing: families.filter((f) => f.status === "missing"),
    addressedControls,
    looksLikePolicy: addressedControls >= 3,
  };
}

/**
 * The controls worth asking about in the clarifying interview: those the
 * policies didn't cover (not_met) or the analyzer was unsure about
 * (needs_clarification). Highest SPRS weight first, capped so the interview
 * stays short and high-impact.
 */
export function gapControls(findings: Finding[], cap = 15): Control[] {
  const byId = new Map(findings.map((f) => [f.controlId, f] as const));
  return CONTROLS.filter((c) => {
    const f = byId.get(c.id);
    if (!f) return true; // unanalyzed → treat as a gap
    return f.status === "not_met" || f.needsClarification === true;
  })
    .filter((c) => c.weight > 0) // skip the 0-point NA/gating control
    .sort(
      (a, b) => b.weight - a.weight || a.id.localeCompare(b.id, undefined, { numeric: true }),
    )
    .slice(0, cap);
}
