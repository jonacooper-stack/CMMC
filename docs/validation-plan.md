# SecureControls — Validation Build & Go-to-Market Punch List

## Context

The founders have a Tier-A (82/100) business concept — a **fixed-price, artifact-only managed NIST 800-171 / SPRS compliance service for small defense subcontractors** (working name *SecureControls*; a gated Phase 2 enclave, *BeaconEnclave*, is explicitly out of scope). The expert council's verdict was unambiguous: demand is *forced, recurring, budgeted, and dated* (DFARS 7012/7019/7020 freeze purchase orders **today**; CMMC L2 mandate phases into new contracts **Nov 10 2026**), but the lane is "real but filling" (OSIbeyond shipped a near-identical subscription in Apr 2026; Summit 7 is moving down-market on an Army channel). The differentiator — *environment-agnostic / never-touch-CUI / one fixed published price* — is copyable in ~90 days, so the ~12-month job is to **plant the positioning flag, prove the funnel converts, and rent credibility before the air closes.**

Every reviewer converged on the same cheapest, highest-leverage next move: **run the free-assessment funnel against ~100–200 named prospects for one quarter and measure completion → proposal → paid + days-to-close.** That single test validates the product (assessment quality), the market (demand + conversion), and feasibility (founder-led close cadence + onboarding hours). This plan builds exactly the assets needed to run that test and get real market feedback fast.

**Scope decision (per founder):** This plan deliberately **parks legal / entity / insurance / E&O, the firm's own SOC 2, the full recurring-cadence + questionnaire system-of-record, and all of Phase 2/BeaconEnclave.** Those move to a *Deferred Track* (revisit before signing the first paying customer / after the funnel validates). The critical path is: **brand → website → the initial audit (assessment) → a worked test case → ads + outreach → measure.**

**Confirmed inputs:** brand = naming sprint; audit = real custom web app; ads = ~$3–5K test budget; assets in hand = a DoD/DIB advisor + warm leads to target subs (no RP/CCP yet, no domain/socials/tooling yet).

---

## What we are validating (and the kill/pass gates)

The whole effort is instrumented against four questions and explicit thresholds (adapted from the founders' own Gates 3–4 and the PM synthesis):

| # | Validation question | Metric | Pass / Kill signal |
|---|---|---|---|
| 1 | Does the **product** (assessment) hold up? | RP/CCP + DoD advisor agree the report "caught what they'd catch"; coded SPRS score reconciles to a hand-calc on 3–5 cases | Pass = sign-off; rework ≤2 cycles then reassess |
| 2 | Is there **demand**? (funnel top) | Assessment-completion rate from ~100 named ICP subs + ad traffic | **Pass > 10%**, **Kill/rework < 3%** |
| 3 | Will they **pay**? (funnel bottom) | Paid design partners at published pricing, cash in advance | Pass = **2–3 signed** onboarding + subscription |
| 4 | Is the **close feasible**? | Days-to-close + founder close cadence | Target trending toward **2–4 closes/mo/founder**; **3–5 signed accounts by ~month 6** |

A ~90-day review decides go / refine / pause. Positioning guardrails that must hold in *every* asset (the council's load-bearing conditions):
- **Lead with the structural wedge**, never the generic category sentence: *"We keep your SPRS score correct and your evidence audit-ready every quarter, for one fixed monthly price — and we never touch your CUI."*
- **Make artifact-only the contrast to the competitors**, i.e. *"the alternative to handing your environment to an MSSP."* Turn OSIbeyond/Summit 7's enclave bundle into the foil.
- **Lead present-tense SPRS / frozen-PO pain**, not only the Nov-2026 deadline (de-risks a date slip).
- **SPRS score = deterministic code, AI assists only**, human-gated; the free report is an *estimate* with a clear no-certification-guarantee disclaimer (also keeps marketing claims clean).
- **Rent credibility from day one**: DoD advisor named, "RP/CCP-reviewed," RPO-in-progress, first design-partner logos.

---

## The Punch List

Legend: **[C]** = I build/draft it · **[You]** = founder action/decision · **[Joint]** = needs your input then I execute. Effort: S/M/L.

### WS-0 · Brand & identity — *naming sprint* (blocks domain, site, ads)
- [ ] **[C]** Generate 8–12 name candidates across 4 directions: (a) the *frozen-PO / "stay cleared to bid"* fear, (b) the *SPRS score / posture* object, (c) *artifact / proof / evidence* (the never-CUI wedge), (d) *readiness / continuity*. Avoid the saturated "Secure-/Cyber-/Compli-" cluster. (S)
- [ ] **[C]** Screen each: **.com/.io domain availability** + a **USPTO TESS knockout search** (classes 042/045) + social-handle availability; flag conflicts. (M)
- [ ] **[You]** Pick the winner (or confirm keeping *SecureControls*). (S)
- [ ] **[You]** Register the domain + lock social handles once chosen. (S)
- [ ] **[C]** Produce a lightweight **identity kit**: wordmark/logo, color + type system, one-line positioning statement, tagline, brand voice guide. (M)
- [ ] **[C]** Write the **canonical positioning + messaging doc** (hero promise, 3 proof pillars, the OSIbeyond/Summit 7 contrast, the no-guarantee disclaimer language) — the single source the site, ads, and sales pull from. (M)

### WS-1 · Foundational accounts & tooling (you have none yet)
- [ ] **[You]** Google Workspace (domain email), **[C]** DNS/email setup guidance. (S)
- [ ] **[You]** Create **Google Ads**, **Google Analytics 4 + Tag Manager**, **LinkedIn company page + Campaign Manager**, **Search Console**; **[C]** configure tracking, conversion events, UTM scheme. (M)
- [ ] **[C]** Stand up a lightweight **CRM / pipeline** (e.g. HubSpot free or Notion/Airtable) with the funnel stages and the metrics fields from the gates table. (S)
- [ ] **[C]** Repo + hosting scaffold (this repo): Next.js app, Vercel deploy target, env/secrets layout. (S)

### WS-2 · Messaging & sales narrative (feeds WS-3, WS-6, WS-7)
- [ ] **[C]** **ICP one-pager** + buyer persona ("30-person machine-shop owner who just got a Lockheed questionnaire and doesn't know his SPRS score"). (S)
- [ ] **[C]** **Competitive battlecard**: artifact-only vs. OSIbeyond / Summit 7 / Vanta-Drata / hourly RPOs — the one-line + one-graphic answer to "why not just hand it all to an MSSP." (M)
- [ ] **[C]** **Pricing narrative**: the published Core/Plus/Scale table ($9.5K/$1.5K · $12.5K/$2.5K · $15K/$3.5K) framed as "3–5× the tool so you don't have to operate it." (S)
- [ ] **[C]** **Objection/FAQ bank** (no-certification-guarantee, "you don't touch our CUI?", "what if our SPRS score drops?"). (S)

### WS-3 · Marketing website (the conversion engine)
- [ ] **[C]** Build with **Next.js + Tailwind, deploy on Vercel**; fast, SEO-clean, analytics wired. (L)
- [ ] **[C]** Pages: **Home** (hero = SPRS/fixed-price/never-CUI promise + free-assessment CTA) · **How it works** (3-stage journey: free assessment → mock review → onboarding+managed ops) · **Pricing** (published tiers) · **The artifact-only difference** (the wedge explainer + contrast graphic) · **Why now** (present-tense SPRS pain + Nov-2026) · **About / credibility** (DoD advisor, RP/CCP-reviewed, RPO-in-progress) · **Resources/blog** (SEO) · **FAQ** · **Book a call**. (L)
- [ ] **[C]** **SEO foundation**: schema, metadata, sitemap, 3–5 high-intent cornerstone articles ("What is my SPRS score and why is it freezing my POs," "DFARS 7012 for subcontractors," "NIST 800-171 self-assessment walkthrough," "CMMC L2 for the 30-person shop"). (M)
- [ ] **[C]** Dedicated **ad landing page(s)** variant of the home hero, optimized for the free-assessment conversion. (M)

### WS-4 · The Initial Audit — AI-assisted SPRS & 800-171 readiness assessment (REAL web app)
- [ ] **[C]** **Encode the rubric (the moat-in-software):** the 110 NIST 800-171 Rev 2 control objectives + the **official DoD SPRS scoring methodology as a deterministic coded function** (the published +1 / −3 / −5 point weighting). *Research task: pull the current SPRS scoring template + Assessment Methodology.* (L)
- [ ] **[C]** **Structured intake survey** — multi-step, branching; maps each answer to control-objective status; tuned for a non-technical owner. (L)
- [ ] **[C]** **AI follow-up layer** (LLM via Anthropic API) for clarifying questions + plain-English narrative — clearly **assist-only, never authoritative for the score**; human-gated. (M)
- [ ] **[C]** **Report generator** — branded 15–25pp HTML/PDF: posture vs. the 110 objectives, **current + target SPRS estimate**, prioritized remediation, the "now do this for me" CTA. (L)
- [ ] **[C]** **Lead capture → CRM → scheduling** (book the mock review) wired end-to-end. (M)
- [ ] **[C]** **Foundational app guardrails** (from the CTO review): multi-tenant data model, managed auth (Clerk/WorkOS), audit log, and the **raw-CUI-block UX** — steer to attestations/structured inputs, block free-form CUI file uploads, "this is not a CUI repository" framing. (M)
- [ ] **[You→C]** **Retain a fractional RP/CCP (5–10 paid hours)** — you don't have one yet; this is the Gate-1/2 credibility + QC dependency. I'll draft the role brief + sourcing shortlist (CyberAB Marketplace). (M)

### WS-5 · The Test Case (QA + sales asset + validation artifact)
- [ ] **[C]** Build a **realistic representative sub** (fictional: ~35-person precision machine shop, single prime, light CUI) and run it fully through the assessment. (M)
- [ ] **[C]** Produce the **sample deliverables**: the completed assessment, the generated branded report, plus excerpt **baseline SSP / POA&M / SPRS worksheet** to show onboarding output. (M)
- [ ] **[C]** Optionally 2–3 personas spanning **Core/Plus/Scale** to show range. (M)
- [ ] **[You + advisor + RP/CCP]** **Validate the test case**: does a credentialed practitioner stand behind the score, and does your DoD advisor agree it lands with a real buyer? (Gate 1.) (S)
- [ ] **[C]** Reconcile the coded SPRS score vs. a hand-calc on 3–5 cases; the human wins if they disagree. (S)

### WS-6 · Ads & demand generation (~$3–5K test)
- [ ] **[C]** **Google Search campaign**: keyword list (SPRS score, DFARS 7012 subcontractor, NIST 800-171 self-assessment, CMMC Level 2 small business, "frozen out of purchase orders"), negative keywords, 3–4 ad-copy variants/group, budget pacing + bid strategy for $3–5K. (M)
- [ ] **[C]** Conversion tracking: ad → landing page → assessment-start → assessment-complete → call-booked. (S)
- [ ] **[C]** **Warm-lead playbook** for your existing sub contacts: intro email/DM templates inviting them to take the free assessment as design partners. (S)
- [ ] **[C]** **LinkedIn outbound sequence** to sub owners + a small set of organic posts on the SPRS/deadline pain. (M)
- [ ] **[C]** **Channel outreach templates**: APEX Accelerators + MEP centers (offer a free SPRS webinar/assessment), prime supplier-development teams, defense-manufacturing associations — the warm, credible, low-cost layer. (M)
- [ ] **[You]** Approve ad copy + fund the ad account; **[Joint]** pick the beachhead segment (see Open Decisions). (S)

### WS-7 · Founder-led close motion (so the funnel produces signed accounts)
- [ ] **[C]** **Mock-review call script** + discovery questions (CUI scope, primes, current SPRS, trigger). (S)
- [ ] **[C]** **Consultative proposal template** at published pricing + the **design-partner offer** (setup discount for feedback + testimonial rights). (S)
- [ ] **[C]** **CRM pipeline** stages + instrumentation for days-to-close and close cadence. (S)
- [ ] **[C]** **Onboarding hours time-tracking** template (tests the CFO/COO templatization-margin thesis on the first 2–3 customers). (S)

### WS-8 · Credibility scaffolding (rent the DIB trust we lack)
- [ ] **[You]** Confirm the **DoD/DIB advisor** will be named on the site + review the test case; **[C]** draft their bio/quote block. (S)
- [ ] **[C]** Draft the **RP/CCP retention brief** (WS-4) and a plan to display "RP/CCP-reviewed." (S)
- [ ] **[C]** Prep the **CyberAB RPO designation** application checklist (voluntary, credibility-only — kept light, not on the legal track). (S)
- [ ] **[C]** **Case-study template** to capture the first design-partner stories the moment they sign. (S)

### WS-9 · Measurement & the 90-day gate review
- [ ] **[C]** **Funnel dashboard** (GA4 + CRM) reporting the four gate metrics weekly. (M)
- [ ] **[C]** Pre-write the **~Day-90 decision memo** structure (go / refine / pause) against the pass-kill thresholds. (S)

---

## Deferred Track (intentionally NOT now — revisit post-validation / pre-first-paid-customer)
- Legal: entity formation, MSA + liability cap, the 8 counsel questions, marketing-claims review.
- Insurance: E&O + cyber bound *before first paying customer*.
- The full **system-of-record**: recurring-cadence engine, questionnaire-response engine + answer library (beyond the assessment + first manual onboardings).
- The firm's own **SOC 2** (Type I bridge when a buyer asks).
- **Phase 2 / BeaconEnclave** in its entirety.
- *Option to evaluate later:* white-labeling a delivery rail (e.g. "Powered-by-FutureFeed") for onboarding/system-of-record to cut build risk — does not affect the custom assessment we're building now.

---

## Suggested sequencing (fast path to market feedback)
- **Week 0–1:** WS-0 naming sprint + WS-1 accounts/tooling. (Unblocks everything.)
- **Week 1–2:** WS-2 messaging; start WS-4 rubric encoding (longest pole); retain RP/CCP.
- **Week 2–4:** WS-3 website + WS-4 assessment app build in parallel.
- **Week 4–5:** WS-5 test case + RP/CCP/advisor validation (Gate 1); WS-6 ad + outreach assets ready.
- **Week 5–6:** Soft launch — point warm leads + a small ad spend at the assessment; fix conversion leaks.
- **Week 6–12:** Full funnel run to ~100–200 prospects; WS-7 close motion on completers; instrument WS-9.
- **~Week 12–13:** 90-day gate review → go / refine / pause.

## What needs you vs. what I'll build
- **You:** pick the brand name + register domain; create/fund ad + analytics accounts; confirm + introduce the DoD advisor; approve copy; run the actual mock-review sales calls; supply/permission the warm leads; co-decide the beachhead.
- **I'll build/draft:** name candidates + screening, identity kit, full messaging/battlecard/FAQ, the entire website, the assessment web app (rubric, survey, AI layer, report, guardrails), the test case + sample deliverables, ad campaigns + landing pages, outreach templates, sales scripts/proposal, CRM + dashboards, RP/CCP + RPO briefs.

## Verification (how we'll know each piece works)
- **Assessment:** coded SPRS score reconciles with an RP/CCP hand-calc on 3–5 cases; end-to-end run (survey → AI follow-ups → report → lead in CRM → call booked) works on the test case.
- **Website/ads:** GA4 conversion events fire across ad → landing → assessment-complete; Lighthouse/SEO checks pass.
- **Test case:** DoD advisor + RP/CCP sign off that the output is credible and buyer-ready.
- **Market:** live funnel hits the gate thresholds (>10% completion; 2–3 paid design partners; close-cadence trend); 90-day memo renders the call.

## Open decisions to resolve at kickoff
1. **Beachhead segment** for the first wave — I recommend **precision machine / metal-fab shops, ~20–75 employees, single/few primes, in MEP-active states**, *pointed first at wherever your warm leads cluster*. Confirm or steer.
2. **Assessment tech stack** confirmation (proposed: Next.js + Postgres + Clerk/WorkOS auth + Anthropic API + server-side PDF) — fine to accept defaults.
3. **Anthropic API access** for the AI follow-up layer (key/budget).
