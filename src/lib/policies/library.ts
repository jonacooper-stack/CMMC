/**
 * The standard NIST SP 800-171 / CMMC policy set — one policy per control
 * family. Used to show a shop which policies they appear to have vs. are
 * missing, and to give a concrete starting point (key elements + a copy-paste
 * starter) for the ones they still need to write.
 *
 * These are plain-English STARTERS to get a small subcontractor moving — a
 * scaffold to fill in, not a substitute for an RP/CCP-reviewed SSP.
 */
export type PolicyTemplate = {
  /** Maps to a NIST 800-171 family id, e.g. "3.6". */
  familyId: string;
  /** The conventional policy document name. */
  name: string;
  /** One-line, plain-English purpose. */
  purpose: string;
  /** What a defensible version of this policy needs to say. */
  keyElements: string[];
  /** A short, copy-paste skeleton the owner can fill in. */
  starter: string;
};

export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    familyId: "3.1",
    name: "Access Control Policy",
    purpose: "Define who may access your systems and CUI, and limit each person and device to only what they need.",
    keyElements: [
      "How accounts are requested, approved, and removed (joiners/movers/leavers)",
      "Least-privilege: access is granted by role/job need, reviewed periodically",
      "Remote access rules (VPN, MFA) and what's allowed from personal devices",
      "Session lock/timeout after inactivity and limits on failed logins",
      "How CUI flow is controlled and shared externally",
    ],
    starter:
      "# Access Control Policy\n\n[COMPANY] grants access to systems and CUI on a least-privilege basis.\n\n- Access requests are approved by [ROLE] before provisioning; access is removed within [N] hours of separation.\n- Access is reviewed every [quarter/6 months] and right-sized to each role.\n- Remote access requires VPN and multifactor authentication. [Personal devices are / are not] permitted, and if permitted must [requirement].\n- Sessions lock after [15] minutes of inactivity; accounts lock after [N] failed attempts.\n",
  },
  {
    familyId: "3.2",
    name: "Security Awareness & Training Policy",
    purpose: "Make sure your people understand the risks and their day-to-day security responsibilities.",
    keyElements: [
      "Security awareness training at hire and at least annually",
      "Role-based training for staff with elevated access",
      "Recognizing phishing, social engineering, and insider-threat indicators",
      "How training completion is tracked and recorded",
    ],
    starter:
      "# Security Awareness & Training Policy\n\nAll [COMPANY] personnel complete security awareness training within [N] days of hire and at least annually.\n\n- Training covers phishing, handling CUI, password/MFA hygiene, and incident reporting.\n- Staff with elevated/admin access complete additional role-based training.\n- [ROLE] tracks completion; records are retained for [N] years.\n",
  },
  {
    familyId: "3.3",
    name: "Audit & Accountability (Logging) Policy",
    purpose: "Keep logs of system activity so you can tell who did what — and actually review them.",
    keyElements: [
      "Which events are logged (logins, privilege use, CUI access, changes)",
      "Time synchronization across systems",
      "Log protection from tampering and unauthorized access",
      "Who reviews logs, how often, and how anomalies are escalated",
      "Log retention period",
    ],
    starter:
      "# Audit & Accountability Policy\n\n[COMPANY] logs security-relevant events to hold users accountable and support investigations.\n\n- Logged events include logins/logouts, privileged actions, access to CUI, and configuration changes.\n- System clocks are synchronized to [time source]. Logs are protected from modification and retained for [N] days.\n- [ROLE] reviews logs [weekly] and escalates anomalies per the Incident Response Policy.\n",
  },
  {
    familyId: "3.4",
    name: "Configuration Management Policy",
    purpose: "Set systems to a known, secure baseline and control changes to them over time.",
    keyElements: [
      "Documented secure baseline configurations for systems",
      "A change-control process (request, approve, test, record)",
      "An inventory of hardware and software",
      "Restricting/approving software (allowlisting) and disabling unused services",
    ],
    starter:
      "# Configuration Management Policy\n\n[COMPANY] maintains secure baseline configurations and controls changes to them.\n\n- Baselines are documented for [system types] and reviewed [annually].\n- Changes are requested, approved by [ROLE], tested, and recorded.\n- A current inventory of hardware/software is maintained. Unauthorized software is prohibited; unused ports/services are disabled.\n",
  },
  {
    familyId: "3.5",
    name: "Identification & Authentication Policy",
    purpose: "Prove users and devices are who they claim to be — unique accounts, passwords, and MFA.",
    keyElements: [
      "Unique IDs for every user (no shared accounts)",
      "Multifactor authentication for network and privileged access",
      "Password/authenticator requirements (length, reuse, storage)",
      "How devices are identified and authenticated",
    ],
    starter:
      "# Identification & Authentication Policy\n\nEvery [COMPANY] user has a unique account; shared accounts are prohibited.\n\n- Multifactor authentication is required for remote access, privileged accounts, and [systems].\n- Passwords are at least [14] characters, screened against common lists, and stored only in hashed form.\n- Devices connecting to company systems are identified and authorized before access.\n",
  },
  {
    familyId: "3.6",
    name: "Incident Response Policy",
    purpose: "Be ready to detect, contain, report, and recover from a security incident before it spreads.",
    keyElements: [
      "What counts as an incident and how staff report one (who/how/when)",
      "Roles and an escalation chain during an incident",
      "Containment, eradication, and recovery steps",
      "External reporting obligations (e.g., DoD 72-hour reporting for CUI)",
      "Post-incident review and testing the plan",
    ],
    starter:
      "# Incident Response Policy\n\n[COMPANY] detects, reports, and responds to security incidents to limit damage to CUI.\n\n- Staff report suspected incidents to [ROLE/contact] immediately via [channel].\n- The response lead coordinates containment, eradication, and recovery, and keeps a written timeline.\n- Reportable incidents involving CUI are reported to [DoD/customer] within the required window (e.g., 72 hours).\n- The plan is tested [annually] and reviewed after each incident.\n",
  },
  {
    familyId: "3.7",
    name: "System Maintenance Policy",
    purpose: "Perform maintenance safely — including work done by outside technicians.",
    keyElements: [
      "Scheduling and authorizing maintenance",
      "Controls over remote/off-site maintenance and tools",
      "Supervising third-party maintenance personnel",
      "Sanitizing equipment of CUI before off-site repair",
    ],
    starter:
      "# System Maintenance Policy\n\n[COMPANY] performs system maintenance in a controlled, authorized manner.\n\n- Maintenance is scheduled and approved by [ROLE]; maintenance tools are checked before use.\n- Remote maintenance sessions are authorized, monitored, and terminated when complete.\n- Equipment is sanitized of CUI before leaving the facility for repair; external technicians are escorted/supervised.\n",
  },
  {
    familyId: "3.8",
    name: "Media Protection & Disposal Policy",
    purpose: "Protect CUI wherever it lives — drives, USBs, backups, paper — and dispose of it safely.",
    keyElements: [
      "Marking and storing media that contains CUI",
      "Encrypting CUI on portable media and during transport",
      "Limiting and logging use of removable media (USB)",
      "Sanitizing or destroying media before disposal or reuse",
    ],
    starter:
      "# Media Protection & Disposal Policy\n\n[COMPANY] protects CUI on all media and disposes of it securely.\n\n- Media containing CUI is marked, access-controlled, and stored in [location].\n- CUI on portable media is encrypted; removable media use is [restricted/logged].\n- Before disposal or reuse, media is sanitized or destroyed per [method]; destruction is recorded.\n",
  },
  {
    familyId: "3.9",
    name: "Personnel Security Policy",
    purpose: "Screen people before granting access, and protect CUI when someone leaves or changes roles.",
    keyElements: [
      "Screening/background checks before granting access to CUI",
      "Revoking access and recovering assets on termination",
      "Re-evaluating access on role changes/transfers",
    ],
    starter:
      "# Personnel Security Policy\n\n[COMPANY] screens personnel before access and protects CUI through role changes.\n\n- Individuals are screened per [standard] before being granted access to CUI.\n- On termination, access is revoked within [N] hours and company assets/credentials are recovered.\n- Access is re-reviewed when an employee changes roles.\n",
  },
  {
    familyId: "3.10",
    name: "Physical Protection Policy",
    purpose: "Control who can physically reach your facility, equipment, and the devices that hold CUI.",
    keyElements: [
      "Limiting physical access to facilities and equipment",
      "Escorting and logging visitors",
      "Securing devices/media and protecting work areas",
      "Controlling and monitoring physical access devices (keys, badges)",
    ],
    starter:
      "# Physical Protection Policy\n\n[COMPANY] limits physical access to systems and CUI to authorized individuals.\n\n- Facility access is controlled by [badges/keys]; access is granted by [ROLE] and reviewed [periodically].\n- Visitors sign in, are escorted, and are logged.\n- Devices and media holding CUI are secured when unattended; work areas handling CUI are [controls].\n",
  },
  {
    familyId: "3.11",
    name: "Risk Assessment Policy",
    purpose: "Regularly look for security weaknesses — including vulnerability scans — and act on what you find.",
    keyElements: [
      "Periodic risk assessments of systems handling CUI",
      "Vulnerability scanning cadence and scope",
      "Prioritizing and remediating findings within set timeframes",
    ],
    starter:
      "# Risk Assessment Policy\n\n[COMPANY] assesses and manages risk to CUI on an ongoing basis.\n\n- A risk assessment is performed at least [annually] and after major changes.\n- Vulnerability scans run [monthly]; findings are prioritized by severity.\n- Critical/high vulnerabilities are remediated within [N] days; exceptions are documented and approved.\n",
  },
  {
    familyId: "3.12",
    name: "Security Assessment & POA&M Policy",
    purpose: "Check that your controls actually work, and keep a written plan to close any gaps.",
    keyElements: [
      "Periodically assessing whether controls are effective",
      "Maintaining a System Security Plan (SSP)",
      "Maintaining a Plan of Action & Milestones (POA&M) for open gaps",
      "Tracking remediation to closure",
    ],
    starter:
      "# Security Assessment & POA&M Policy\n\n[COMPANY] verifies its controls and tracks gaps to closure.\n\n- Controls are assessed at least [annually]; results are documented.\n- An SSP describes how each requirement is met; it is kept current.\n- Open gaps are recorded in a POA&M with owners and milestone dates, and tracked until closed.\n",
  },
  {
    familyId: "3.13",
    name: "System & Communications Protection Policy",
    purpose: "Protect your network and the data moving across it — firewalls, separation, and encryption.",
    keyElements: [
      "Boundary protection (firewalls) and monitoring at network edges",
      "Separating CUI systems/networks from the rest",
      "Encrypting CUI in transit (and at rest where applicable)",
      "Using FIPS-validated cryptography where required",
    ],
    starter:
      "# System & Communications Protection Policy\n\n[COMPANY] protects its networks and CUI in transit.\n\n- Network boundaries are protected by firewalls and monitored; inbound/outbound traffic is controlled.\n- Systems handling CUI are separated from general/guest networks.\n- CUI is encrypted in transit using FIPS-validated cryptography; remote sessions use encrypted channels.\n",
  },
  {
    familyId: "3.14",
    name: "System & Information Integrity Policy",
    purpose: "Find and fix flaws quickly, and defend against malware and active attacks.",
    keyElements: [
      "Timely patching of operating systems and applications",
      "Anti-malware protection that is kept current",
      "Monitoring systems and alerts for attacks/indicators",
      "Acting on security advisories",
    ],
    starter:
      "# System & Information Integrity Policy\n\n[COMPANY] keeps systems patched and defended against malicious activity.\n\n- Security patches are applied within [N] days of release (critical sooner).\n- Anti-malware runs on [systems] and updates automatically.\n- Systems and alerts are monitored; security advisories are reviewed and acted on by [ROLE].\n",
  },
];

export const POLICY_BY_FAMILY: Record<string, PolicyTemplate> = Object.fromEntries(
  POLICY_TEMPLATES.map((p) => [p.familyId, p]),
);
