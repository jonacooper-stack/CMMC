import type { Control } from "./types";

/**
 * TEMPORARY compile stub — a small, real subset so the engine + UI build and can
 * be exercised end-to-end. This is replaced by the full, source-verified
 * 110-control dataset (DoD NIST SP 800-171 Assessment Methodology) before launch.
 */
export const CONTROLS: Control[] = [
  {
    id: "3.1.1",
    family: "3.1",
    title: "Limit system access to authorized users, processes, and devices",
    weight: 5,
  },
  {
    id: "3.1.2",
    family: "3.1",
    title:
      "Limit system access to the types of transactions and functions authorized users are permitted to execute",
    weight: 5,
  },
  {
    id: "3.5.3",
    family: "3.5",
    title:
      "Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts",
    weight: 5,
    partialWeight: 3,
  },
  {
    id: "3.11.2",
    family: "3.11",
    title: "Scan for vulnerabilities in systems and applications periodically",
    weight: 5,
  },
  {
    id: "3.13.11",
    family: "3.13",
    title: "Employ FIPS-validated cryptography when used to protect the confidentiality of CUI",
    weight: 5,
    partialWeight: 3,
  },
];
