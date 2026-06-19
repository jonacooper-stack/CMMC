# Muster — Brand & UI Guidelines

**Positioning:** managed NIST 800‑171 / SPRS compliance for small defense
subcontractors. The brand should feel like **defense‑grade infrastructure you can
trust** — serious and engineered, but legible and human (not intimidating).

**Aesthetic — "defense‑grade command console,"** synthesized from the references:

| Reference | What we take |
|---|---|
| **SpaceX** | Dark, cinematic, engineered. Near‑black ink, generous space, tracked uppercase labels, a faint technical grid. |
| **Exebenus** | Technical / industrial confidence; data‑forward dark surfaces. |
| **Drata** (a competitor) | Clean, credible, legible light content surfaces and cards — SaaS polish. |
| **Changelabs** | Bold display typography for headlines. |

Structure: **dark header + hero → clean light body → dark footer.** Dark moments
carry gravitas; light surfaces carry the work (the assessment must stay readable).

---

## Color

All tokens live in `src/app/globals.css` (`@theme`). Names are stable — change a
value there and it propagates everywhere.

**Command inks** (dark backgrounds, text on light)
- `navy-900` `#0a1018` — primary dark bg (header, hero, footer), darkest text
- `navy-800` `#0f1722`, `navy-700` `#18222f` — raised dark surfaces / hovers
- `ink` `#0a1018` — heading text color

**Cleared — the accent** (passed muster / met / "go"). Use sparingly, as signal.
- `cleared-500` `#1cc084` — bright accent, esp. on dark (headline highlight, ticks)
- `cleared-600` `#119a67` — primary buttons, links on light
- `cleared-700` `#0c7a52` — hover/pressed
- `cleared-50`  `#e8f8f0` — tinted fills

**Steel** (cool blue‑grays) — labels, muted text on dark, hairlines
- `steel-700` `#3a4a63` (eyebrows on light) · `steel-500` `#64789a` · `steel-200` `#c3d0e2` (text on dark)

**Caution / partial:** `amber-500` `#e6a012`, `amber-50` `#fcf3de`.
**Neutral text:** `slate-700/600/500/400`. **Surfaces:** `paper` `#f5f8fc`, `line` `#e1e8f1`.

**Scoring semantics** (don't repurpose): green = met / cleared / documented · amber
= partial · rose = missing/not‑met · slate = N/A. The `ScoreGauge` thermometer
runs rose → amber → green across the −203…110 SPRS range.

---

## Typography

Wired via `next/font` in `src/app/layout.tsx`.

- **Display — Space Grotesk** (`--font-display`): all headings (`h1–h4`) and the
  wordmark. Weight 700, letter‑spacing `-0.02em`. Engineered, aerospace‑coded.
- **Body — Inter** (`--font-sans`): all UI and prose. Default on `body`.
- **Mono — JetBrains Mono** (`--font-mono`): control ids (e.g. `3.1.1`), eyebrows,
  and technical labels.

Headline scale: `text-4xl` → `sm:text-6xl`, `leading-[1.04]`, `tracking-tight`.
Body lead: `text-lg sm:text-xl text-slate-600`.

---

## Components

- **Eyebrow** (`ui.tsx`): mono, uppercase, `tracking-[0.18em]`, preceded by a small
  `cleared-500` square tick. `tone="dark"` on dark sections (steel‑200 text).
- **CTA** (`ui.tsx`): `primary` (green, soft shadow), `secondary` (ink),
  `ghost` (light outline, for light bg), `outline` (white outline, for dark bg).
- **Cards:** `rounded-xl/2xl border border-line bg-white` on light; `border-white/10
  bg-white/5` on dark. Featured = `border-cleared-500` + `cleared-50` tint.
- **Dark section grid:** faint white grid (`opacity ~0.06`, 60px) + a `cleared-500/20`
  blur glow — see the homepage hero.

## Logo

Tally‑mark (roll call → "count your 110 controls") whose fifth stroke is the
`cleared-500` "passed muster" slash, beside the Space Grotesk wordmark.
`variant="white"` on dark (header/footer), default ink on light.

## Do / Don't

- **Do** keep green as an accent and a signal — not a background wash.
- **Do** use dark for first impressions and trust moments; keep tools light.
- **Don't** set body copy in the display or mono fonts.
- **Don't** introduce new accent hues; extend the scale instead.
