import type { Control } from "./types";

/**
 * The 110 NIST SP 800-171 Rev 2 security requirements with their DoD SPRS
 * Assessment Methodology point weights (5 / 3 / 1) — the points deducted from a
 * starting score of 110 when a requirement is NOT implemented.
 *
 * Source: NIST SP 800-171 DoD Assessment Methodology, Version 1.2.1 (June 24,
 * 2020), OUSD(A&S)/DPC. Weights follow the methodology's Basic/Derived 5-point
 * and 3-point lists (all others = 1), cross-verified against FutureFeed,
 * Totem.tech, and RSI Security; titles verified against NIST SP 800-171 Rev 2.
 *
 * Distribution: 44 × 5pt, 14 × 3pt, 51 × 1pt, and 3.12.4 (the SSP) as NA (0pt)
 * = 110 requirements (109 numerically weighted). Sum of weights = 44·5 + 14·3 +
 * 51·1 = 313, so the all-unmet floor is exactly 110 − 313 = -203 (the published
 * SPRS floor). The odd floor only reconciles because 3.12.4 carries no weight.
 *
 * Conditional/partial credit (the only two): 3.5.3 (multifactor authentication)
 * and 3.13.11 (FIPS-validated cryptography) deduct 5 if absent, 3 if partially
 * in place — modeled here as weight 5 with partialWeight 3. (3.5.3: 5 if MFA for
 * no users, 3 if for remote + privileged but not non-privileged network access.
 * 3.13.11: 5 if no encryption, 3 if encryption is employed but not FIPS-validated.)
 */
export const CONTROLS: Control[] = [
  // 3.1 Access Control
  { id: "3.1.1", family: "3.1", title: "Limit system access to authorized users, processes, and devices", weight: 5 },
  { id: "3.1.2", family: "3.1", title: "Limit system access to the transactions and functions authorized users may execute", weight: 5 },
  { id: "3.1.3", family: "3.1", title: "Control the flow of CUI in accordance with approved authorizations", weight: 1 },
  { id: "3.1.4", family: "3.1", title: "Separate the duties of individuals to reduce risk of malevolent activity", weight: 1 },
  { id: "3.1.5", family: "3.1", title: "Employ the principle of least privilege, including for privileged accounts", weight: 3 },
  { id: "3.1.6", family: "3.1", title: "Use non-privileged accounts or roles for nonsecurity functions", weight: 1 },
  { id: "3.1.7", family: "3.1", title: "Prevent non-privileged users from executing privileged functions; capture in logs", weight: 1 },
  { id: "3.1.8", family: "3.1", title: "Limit unsuccessful logon attempts", weight: 1 },
  { id: "3.1.9", family: "3.1", title: "Provide privacy and security notices consistent with CUI rules", weight: 1 },
  { id: "3.1.10", family: "3.1", title: "Use session lock with pattern-hiding displays after inactivity", weight: 1 },
  { id: "3.1.11", family: "3.1", title: "Terminate user sessions after a defined condition", weight: 1 },
  { id: "3.1.12", family: "3.1", title: "Monitor and control remote access sessions", weight: 5 },
  { id: "3.1.13", family: "3.1", title: "Use cryptographic mechanisms to protect remote access sessions", weight: 5 },
  { id: "3.1.14", family: "3.1", title: "Route remote access via managed access control points", weight: 1 },
  { id: "3.1.15", family: "3.1", title: "Authorize remote execution of privileged commands and remote access to security-relevant information", weight: 1 },
  { id: "3.1.16", family: "3.1", title: "Authorize wireless access prior to allowing such connections", weight: 5 },
  { id: "3.1.17", family: "3.1", title: "Protect wireless access using authentication and encryption", weight: 5 },
  { id: "3.1.18", family: "3.1", title: "Control connection of mobile devices", weight: 5 },
  { id: "3.1.19", family: "3.1", title: "Encrypt CUI on mobile devices and mobile computing platforms", weight: 3 },
  { id: "3.1.20", family: "3.1", title: "Verify and control/limit connections to and use of external systems", weight: 1 },
  { id: "3.1.21", family: "3.1", title: "Limit use of portable storage devices on external systems", weight: 1 },
  { id: "3.1.22", family: "3.1", title: "Control CUI posted or processed on publicly accessible systems", weight: 1 },

  // 3.2 Awareness & Training
  { id: "3.2.1", family: "3.2", title: "Ensure managers and users are aware of security risks and applicable policies", weight: 5 },
  { id: "3.2.2", family: "3.2", title: "Ensure personnel are trained to carry out their security responsibilities", weight: 5 },
  { id: "3.2.3", family: "3.2", title: "Provide security awareness training on recognizing the insider threat", weight: 1 },

  // 3.3 Audit & Accountability
  { id: "3.3.1", family: "3.3", title: "Create and retain system audit logs and records", weight: 5 },
  { id: "3.3.2", family: "3.3", title: "Ensure actions of individual users can be uniquely traced to those users", weight: 3 },
  { id: "3.3.3", family: "3.3", title: "Review and update logged events", weight: 1 },
  { id: "3.3.4", family: "3.3", title: "Alert in the event of an audit logging process failure", weight: 1 },
  { id: "3.3.5", family: "3.3", title: "Correlate audit record review, analysis, and reporting for investigation", weight: 5 },
  { id: "3.3.6", family: "3.3", title: "Provide audit record reduction and report generation", weight: 1 },
  { id: "3.3.7", family: "3.3", title: "Synchronize system clocks to an authoritative time source", weight: 1 },
  { id: "3.3.8", family: "3.3", title: "Protect audit information and audit logging tools from unauthorized access", weight: 1 },
  { id: "3.3.9", family: "3.3", title: "Limit management of audit logging to a subset of privileged users", weight: 1 },

  // 3.4 Configuration Management
  { id: "3.4.1", family: "3.4", title: "Establish and maintain baseline configurations and inventories", weight: 5 },
  { id: "3.4.2", family: "3.4", title: "Establish and enforce security configuration settings", weight: 5 },
  { id: "3.4.3", family: "3.4", title: "Track, review, approve/disapprove, and log changes to systems", weight: 1 },
  { id: "3.4.4", family: "3.4", title: "Analyze the security impact of changes prior to implementation", weight: 1 },
  { id: "3.4.5", family: "3.4", title: "Define, document, approve, and enforce access restrictions for changes", weight: 5 },
  { id: "3.4.6", family: "3.4", title: "Employ the principle of least functionality (essential capabilities only)", weight: 5 },
  { id: "3.4.7", family: "3.4", title: "Restrict, disable, or prevent nonessential programs, ports, protocols, and services", weight: 5 },
  { id: "3.4.8", family: "3.4", title: "Apply deny-by-exception (blacklist) or permit-by-exception (whitelist) software policy", weight: 5 },
  { id: "3.4.9", family: "3.4", title: "Control and monitor user-installed software", weight: 1 },

  // 3.5 Identification & Authentication
  { id: "3.5.1", family: "3.5", title: "Identify system users, processes acting on their behalf, and devices", weight: 5 },
  { id: "3.5.2", family: "3.5", title: "Authenticate (or verify) the identities of users, processes, and devices", weight: 5 },
  { id: "3.5.3", family: "3.5", title: "Use multifactor authentication for privileged accounts and network access to non-privileged accounts", weight: 5, partialWeight: 3 },
  { id: "3.5.4", family: "3.5", title: "Employ replay-resistant authentication mechanisms for network access", weight: 1 },
  { id: "3.5.5", family: "3.5", title: "Prevent reuse of identifiers for a defined period", weight: 1 },
  { id: "3.5.6", family: "3.5", title: "Disable identifiers after a defined period of inactivity", weight: 1 },
  { id: "3.5.7", family: "3.5", title: "Enforce a minimum password complexity and change of characters when new passwords are created", weight: 1 },
  { id: "3.5.8", family: "3.5", title: "Prohibit password reuse for a specified number of generations", weight: 1 },
  { id: "3.5.9", family: "3.5", title: "Allow temporary password use for system logons with immediate change to a permanent password", weight: 1 },
  { id: "3.5.10", family: "3.5", title: "Store and transmit only cryptographically-protected passwords", weight: 5 },
  { id: "3.5.11", family: "3.5", title: "Obscure feedback of authentication information", weight: 1 },

  // 3.6 Incident Response
  { id: "3.6.1", family: "3.6", title: "Establish an operational incident-handling capability", weight: 5 },
  { id: "3.6.2", family: "3.6", title: "Track, document, and report incidents to designated officials", weight: 5 },
  { id: "3.6.3", family: "3.6", title: "Test the organizational incident response capability", weight: 1 },

  // 3.7 Maintenance
  { id: "3.7.1", family: "3.7", title: "Perform maintenance on organizational systems", weight: 3 },
  { id: "3.7.2", family: "3.7", title: "Provide controls on the tools, techniques, mechanisms, and personnel used for maintenance", weight: 5 },
  { id: "3.7.3", family: "3.7", title: "Sanitize equipment removed for off-site maintenance of any CUI", weight: 1 },
  { id: "3.7.4", family: "3.7", title: "Check media containing diagnostic and test programs for malicious code", weight: 3 },
  { id: "3.7.5", family: "3.7", title: "Require multifactor authentication for nonlocal maintenance sessions; terminate when complete", weight: 5 },
  { id: "3.7.6", family: "3.7", title: "Supervise maintenance activities of personnel without required access authorization", weight: 1 },

  // 3.8 Media Protection
  { id: "3.8.1", family: "3.8", title: "Protect (physically control and securely store) system media containing CUI", weight: 3 },
  { id: "3.8.2", family: "3.8", title: "Limit access to CUI on system media to authorized users", weight: 3 },
  { id: "3.8.3", family: "3.8", title: "Sanitize or destroy system media containing CUI before disposal or reuse", weight: 5 },
  { id: "3.8.4", family: "3.8", title: "Mark media with necessary CUI markings and distribution limitations", weight: 1 },
  { id: "3.8.5", family: "3.8", title: "Control access to media and maintain accountability during transport outside controlled areas", weight: 1 },
  { id: "3.8.6", family: "3.8", title: "Use cryptographic mechanisms to protect confidentiality of CUI on digital media during transport", weight: 1 },
  { id: "3.8.7", family: "3.8", title: "Control the use of removable media on system components", weight: 5 },
  { id: "3.8.8", family: "3.8", title: "Prohibit use of portable storage devices when there is no identifiable owner", weight: 3 },
  { id: "3.8.9", family: "3.8", title: "Protect the confidentiality of backup CUI at storage locations", weight: 1 },

  // 3.9 Personnel Security
  { id: "3.9.1", family: "3.9", title: "Screen individuals prior to authorizing access to systems containing CUI", weight: 3 },
  { id: "3.9.2", family: "3.9", title: "Protect CUI and systems during and after personnel actions (terminations, transfers)", weight: 5 },

  // 3.10 Physical Protection
  { id: "3.10.1", family: "3.10", title: "Limit physical access to systems, equipment, and operating environments to authorized individuals", weight: 5 },
  { id: "3.10.2", family: "3.10", title: "Protect and monitor the physical facility and support infrastructure", weight: 5 },
  { id: "3.10.3", family: "3.10", title: "Escort visitors and monitor visitor activity", weight: 1 },
  { id: "3.10.4", family: "3.10", title: "Maintain audit logs of physical access", weight: 1 },
  { id: "3.10.5", family: "3.10", title: "Control and manage physical access devices", weight: 1 },
  { id: "3.10.6", family: "3.10", title: "Enforce safeguarding measures for CUI at alternate work sites", weight: 1 },

  // 3.11 Risk Assessment
  { id: "3.11.1", family: "3.11", title: "Periodically assess risk to operations, assets, and individuals", weight: 3 },
  { id: "3.11.2", family: "3.11", title: "Scan for vulnerabilities periodically and when new vulnerabilities are identified", weight: 5 },
  { id: "3.11.3", family: "3.11", title: "Remediate vulnerabilities in accordance with risk assessments", weight: 1 },

  // 3.12 Security Assessment
  { id: "3.12.1", family: "3.12", title: "Periodically assess the security controls to determine effectiveness", weight: 5 },
  { id: "3.12.2", family: "3.12", title: "Develop and implement plans of action to correct deficiencies (POA&M)", weight: 3 },
  { id: "3.12.3", family: "3.12", title: "Monitor security controls on an ongoing basis", weight: 5 },
  { id: "3.12.4", family: "3.12", title: "Develop, document, and periodically update system security plans (SSP)", weight: 0, note: "Gating prerequisite: a DoD assessment cannot be scored without an SSP. It carries no point value of its own (0), but it is the foundation everything else is documented in." },

  // 3.13 System & Communications Protection
  { id: "3.13.1", family: "3.13", title: "Monitor, control, and protect communications at external and key internal boundaries", weight: 5 },
  { id: "3.13.2", family: "3.13", title: "Employ architectural designs, software development techniques, and systems engineering principles", weight: 5 },
  { id: "3.13.3", family: "3.13", title: "Separate user functionality from system management functionality", weight: 1 },
  { id: "3.13.4", family: "3.13", title: "Prevent unauthorized and unintended information transfer via shared system resources", weight: 1 },
  { id: "3.13.5", family: "3.13", title: "Implement subnetworks for publicly accessible system components", weight: 5 },
  { id: "3.13.6", family: "3.13", title: "Deny network communications traffic by default and allow by exception", weight: 5 },
  { id: "3.13.7", family: "3.13", title: "Prevent remote devices from simultaneously connecting and communicating externally (split tunneling)", weight: 1 },
  { id: "3.13.8", family: "3.13", title: "Use cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission", weight: 3 },
  { id: "3.13.9", family: "3.13", title: "Terminate network connections at the end of sessions or after inactivity", weight: 1 },
  { id: "3.13.10", family: "3.13", title: "Establish and manage cryptographic keys for cryptography employed", weight: 1 },
  { id: "3.13.11", family: "3.13", title: "Employ FIPS-validated cryptography when used to protect the confidentiality of CUI", weight: 5, partialWeight: 3 },
  { id: "3.13.12", family: "3.13", title: "Prohibit remote activation of collaborative computing devices; indicate use to users", weight: 1 },
  { id: "3.13.13", family: "3.13", title: "Control and monitor the use of mobile code", weight: 1 },
  { id: "3.13.14", family: "3.13", title: "Control and monitor the use of Voice over Internet Protocol (VoIP)", weight: 1 },
  { id: "3.13.15", family: "3.13", title: "Protect the authenticity of communications sessions", weight: 5 },
  { id: "3.13.16", family: "3.13", title: "Protect the confidentiality of CUI at rest", weight: 1 },

  // 3.14 System & Information Integrity
  { id: "3.14.1", family: "3.14", title: "Identify, report, and correct system flaws in a timely manner", weight: 5 },
  { id: "3.14.2", family: "3.14", title: "Provide protection from malicious code at designated locations", weight: 5 },
  { id: "3.14.3", family: "3.14", title: "Monitor system security alerts and advisories and take action in response", weight: 5 },
  { id: "3.14.4", family: "3.14", title: "Update malicious code protection mechanisms when new releases are available", weight: 5 },
  { id: "3.14.5", family: "3.14", title: "Perform periodic and real-time scans of files from external sources", weight: 3 },
  { id: "3.14.6", family: "3.14", title: "Monitor organizational systems, including inbound and outbound traffic, to detect attacks", weight: 5 },
  { id: "3.14.7", family: "3.14", title: "Identify unauthorized use of organizational systems", weight: 3 },
];
