import type { Metadata } from "next";
import { Container, Eyebrow, CTA, Check } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Published, fixed pricing. Core, Plus, and Scale tiers — one-time onboarding plus a monthly managed-compliance subscription. No hourly meter.",
};

const TIERS = [
  {
    name: "Core",
    who: "Under 50 employees · single prime · light scope",
    setup: "$9,500",
    mo: "$1,500",
    annual: "$18,000 / yr",
  },
  {
    name: "Plus",
    who: "50–120 employees · multiple primes · moderate scope",
    setup: "$12,500",
    mo: "$2,500",
    annual: "$30,000 / yr",
    featured: true,
  },
  {
    name: "Scale",
    who: "120–200 employees · many primes · heavy questionnaire load",
    setup: "$15,000",
    mo: "$3,500",
    annual: "$42,000 / yr",
  },
];

const INCLUDED = [
  "Quarterly control reviews against all 110 objectives",
  "SPRS score maintenance and re-posting",
  "Living SSP and POA&M upkeep",
  "Turnkey prime-questionnaire responses",
  "Evidence refresh and reminders on cadence",
  "RP/CCP sign-off on every SPRS-affecting deliverable",
  "C3PAO assessment-prep support (within defined scope)",
];

const SEPARATE = [
  "Any GRC-platform license (e.g. Vanta/Drata)",
  "Secure email / enclave / GCC High vendor",
  "Your C3PAO assessment itself",
  "External legal review",
  "General IT / MSP / help desk",
];

export default function Pricing() {
  return (
    <div className="bg-navy-900 text-steel-200">
      <section className="border-b border-white/5">
        <Container className="py-16 sm:py-20">
          <Eyebrow tone="dark">Pricing</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Published. Fixed. No surprises.</h1>
          <p className="mt-5 max-w-2xl text-lg text-steel-200/80">
            You pay about 3–5× the cost of do-it-yourself software &mdash;
            because we <em>operate</em> it for you. A one-time onboarding fee,
            then a monthly subscription that never lets your score go stale.
          </p>
        </Container>
      </section>

      <section className="bg-navy-800">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`flex flex-col rounded-2xl border p-8 ${t.featured ? "border-cleared-500 bg-white/5 ring-2 ring-cleared-500" : "border-white/10 bg-white/5"}`}
              >
                {t.featured && (
                  <span className="mb-3 inline-block w-fit rounded-full bg-cleared-500/15 px-3 py-1 text-xs font-semibold text-cleared-500">
                    Most common
                  </span>
                )}
                <h2 className="text-xl font-bold text-white">{t.name}</h2>
                <p className="mt-2 min-h-[40px] text-sm text-steel-200/70">{t.who}</p>
                <p className="mt-6 text-4xl font-bold text-white">
                  {t.mo}
                  <span className="text-base font-medium text-steel-200/70">/mo</span>
                </p>
                <p className="mt-1 text-sm text-steel-200/70">{t.annual}</p>
                <div className="mt-4 rounded-lg bg-white/5 px-4 py-3 text-sm text-steel-200/80">
                  <span className="font-semibold text-white">{t.setup}</span> one-time onboarding
                </div>
                <CTA href="/assessment/run" className="mt-6" variant={t.featured ? "primary" : "outline"}>
                  Start with a free assessment
                </CTA>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold text-white">What every tier includes</h3>
              <ul className="mt-4 space-y-3">
                {INCLUDED.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-steel-200/80">
                    <Check /> <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold text-white">Paid separately (to your own vendors)</h3>
              <ul className="mt-4 space-y-3">
                {SEPARATE.map((i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-steel-200/70">
                    <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-steel-500" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-lg bg-cleared-500/10 p-4 text-sm text-steel-200/90">
                <strong className="text-cleared-500">Design partners:</strong> our first few customers get a
                setup discount in exchange for feedback and a testimonial.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5">
        <Container className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white">
            Not sure which tier fits? The free assessment tells you.
          </h2>
          <div className="mt-7 flex justify-center">
            <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
          </div>
        </Container>
      </section>
    </div>
  );
}
