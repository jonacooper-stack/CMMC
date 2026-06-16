/**
 * The 14 NIST SP 800-171 control families, each with a plain-English summary
 * written for a non-technical shop owner (used as the intro to each step of the
 * guided questionnaire).
 */
export type Family = { id: string; name: string; intro: string };

export const FAMILIES: Family[] = [
  {
    id: "3.1",
    name: "Access Control",
    intro:
      "Who can get into your systems and CUI — and limiting each person and device to only what they actually need.",
  },
  {
    id: "3.2",
    name: "Awareness & Training",
    intro:
      "Making sure your people understand the security risks and know their day-to-day responsibilities.",
  },
  {
    id: "3.3",
    name: "Audit & Accountability",
    intro:
      "Keeping logs of what happens on your systems so you can tell who did what — and actually reviewing them.",
  },
  {
    id: "3.4",
    name: "Configuration Management",
    intro:
      "Setting your systems up to a known, secure baseline and controlling changes to them over time.",
  },
  {
    id: "3.5",
    name: "Identification & Authentication",
    intro:
      "Proving users and devices are who they claim to be — logins, unique accounts, passwords, and multifactor.",
  },
  {
    id: "3.6",
    name: "Incident Response",
    intro:
      "Being ready to detect, contain, report, and recover from a security incident before it spreads.",
  },
  {
    id: "3.7",
    name: "Maintenance",
    intro:
      "Performing maintenance on your systems safely — including work done by outside technicians.",
  },
  {
    id: "3.8",
    name: "Media Protection",
    intro:
      "Protecting CUI wherever it lives — hard drives, USB sticks, backups, and paper — and disposing of it safely.",
  },
  {
    id: "3.9",
    name: "Personnel Security",
    intro:
      "Screening people before you grant access, and protecting CUI when someone leaves or changes roles.",
  },
  {
    id: "3.10",
    name: "Physical Protection",
    intro:
      "Controlling who can physically get to your facility, equipment, and the devices that hold CUI.",
  },
  {
    id: "3.11",
    name: "Risk Assessment",
    intro:
      "Regularly looking for security weaknesses — including vulnerability scans — and acting on what you find.",
  },
  {
    id: "3.12",
    name: "Security Assessment",
    intro:
      "Checking that your controls actually work, and keeping a written plan to close any gaps.",
  },
  {
    id: "3.13",
    name: "System & Communications Protection",
    intro:
      "Protecting your network and the data moving across it — firewalls, network separation, and encryption.",
  },
  {
    id: "3.14",
    name: "System & Information Integrity",
    intro:
      "Finding and fixing flaws quickly, and defending against malware and active attacks.",
  },
];

export const FAMILY_BY_ID: Record<string, Family> = Object.fromEntries(
  FAMILIES.map((f) => [f.id, f]),
);
