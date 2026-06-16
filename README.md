# Muster — validation build workspace

Working repository for standing up and market‑testing **Muster** — a **fixed‑price, artifact‑only managed NIST 800‑171 / SPRS compliance service for small defense subcontractors**. (A gated Phase‑2 enclave, *BeaconEnclave*, is intentionally out of scope.)

The current focus is **validation**: prove the product, the market demand, and the feasibility — and get real market feedback fast — by building the assets needed to run the free‑assessment funnel against ~100–200 named prospects. Legal/entity/insurance, the full recurring system‑of‑record, the firm's own SOC 2, and Phase 2 are deferred.

## Layout
- [`docs/validation-plan.md`](docs/validation-plan.md) — the approved punch list (WS‑0 … WS‑9, gates, sequencing).
- [`docs/positioning-and-messaging.md`](docs/positioning-and-messaging.md) — positioning, persona, battlecard, pricing, objections.
- [`brand/naming-sprint.md`](brand/naming-sprint.md) — naming sprint record (decision: **Muster**).
- [`brand/brand-guide.md`](brand/brand-guide.md) + [`brand/muster-wordmark.svg`](brand/muster-wordmark.svg) — identity kit.
- [`src/`](src/) — the marketing site + assessment funnel (Next.js 16 + Tailwind v4). **The app lives at the repo root** so Vercel deploys it with zero config (Root Directory = default/empty).

## Run the web app
```bash
npm install      # first time
npm run dev      # http://localhost:3000
npm run build    # production build (verified passing)
```

## Deploying (Vercel)
The Next.js app is at the **repo root**, so Vercel needs **no Root Directory override** (leave it blank/`./`). It auto-detects Next.js and builds `npm run build`. Production branch = `main`.

## Status
- [x] **WS‑0 brand & identity** — naming sprint complete; brand = **Muster**; brand guide + SVG wordmark.
- [~] **WS‑1 accounts & tooling** — repo + Next.js app scaffolded. Pending (need founder): domain, Google Workspace, Ads/GA4, LinkedIn, CRM.
- [x] **WS‑2 messaging & battlecard** — `docs/positioning-and-messaging.md`.
- [x] **WS‑3 marketing website** — home, how‑it‑works, the‑difference, pricing, why‑now, about, faq, contact. Builds + serves clean.
- [~] **WS‑4 the initial audit** — funnel entry + lead‑capture API live (`/assessment`, `/api/assessment/start`). Next: the guided 110‑control questionnaire, the deterministic SPRS scoring engine, and the report generator.
- [ ] WS‑5 worked test case
- [ ] WS‑6 ads & outreach
- [ ] WS‑7 founder‑led close motion
- [ ] WS‑8 credibility scaffolding
- [ ] WS‑9 measurement & 90‑day gate review

Legend: `[x]` done · `[~]` in progress · `[ ]` not started.
