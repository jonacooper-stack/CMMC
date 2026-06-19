import { Container, Eyebrow, CTA, Check } from "@/components/ui";

const TIERS = [
  { name: "Core", who: "Under 50 employees, single prime", setup: "$9,500", mo: "$1,500" },
  { name: "Plus", who: "50–120 employees, multiple primes", setup: "$12,500", mo: "$2,500", featured: true },
  { name: "Scale", who: "120–200 employees, heavy questionnaire load", setup: "$15,000", mo: "$3,500" },
];

const STEPS = [
  {
    n: "1",
    title: "Free SPRS assessment",
    body: "Answer a guided questionnaire about how your shop handles CUI. You get a 15–25 page report mapped to all 110 controls and an honest estimate of your current and target SPRS score.",
  },
  {
    n: "2",
    title: "Consultation & fixed-price proposal",
    body: "A founder walks your real CUI scope and the path to a defensible score, then sends a written proposal at published pricing. No hourly surprises.",
  },
  {
    n: "3",
    title: "Onboarding, then every quarter — forever",
    body: "We build your SSP, POA&M and SPRS package, then maintain them: quarterly reviews, evidence refresh, re-posting, and turnkey questionnaire answers.",
  },
];

export default function Home() {
  return (
    <div className="bg-navy-900 text-steel-200">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-48 h-[600px] w-[600px] rounded-full bg-cleared-500/20 blur-[130px]"
        />
        <Container className="relative py-24 sm:py-32">
          <div className="max-w-3xl">
            <Eyebrow tone="dark">Managed NIST 800-171 &amp; SPRS compliance</Eyebrow>
            <h1 className="mt-5 text-4xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl">
              Keep your SPRS score correct.{" "}
              <span className="text-cleared-500">Keep winning work.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-200/85 sm:text-xl">
              Muster runs your defense-compliance program for you &mdash; your
              SPRS score, your evidence, your prime questionnaires &mdash; every
              quarter, for one fixed price.{" "}
              <span className="font-semibold text-white">
                We hold the proof. You keep your CUI.
              </span>
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
              <CTA href="/how-it-works" variant="outline">
                See how it works
              </CTA>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-steel-200/70">
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> RP/CCP-reviewed</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Senior DoD advisor</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> We never touch your CUI</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4" /> Fixed, published pricing</li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Stakes */}
      <section className="border-t border-white/5 bg-navy-800">
        <Container className="py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow tone="dark">The problem</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              A blank or stale SPRS score can freeze your purchase orders &mdash; today.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-steel-200/80">
              Under DFARS 7012/7019/7020, every subcontractor that touches CUI
              has to keep a current SPRS score, a live SSP and POA&amp;M, and
              answer its primes&rsquo; security questionnaires. Miss it and the
              POs stop. Then, from <strong className="text-white">Nov 10, 2026</strong>, CMMC Level 2
              certification starts gating new contracts.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              "Your prime just sent a security questionnaire and you don’t know your score.",
              "Your last consultant handed you a binder and left — now it’s out of date.",
              "You don’t have a security team, and the owner is the one losing sleep.",
            ].map((t) => (
              <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
                  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
                    <path d="M10 2.5l7.5 13h-15l7.5-13zM10 8v3.5M10 14h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed text-steel-200/80">{t}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5">
        <Container className="py-16 sm:py-24">
          <Eyebrow tone="dark">How it works</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            From &ldquo;what&rsquo;s my score?&rdquo; to audit-ready &mdash; and kept that way.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n}>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cleared-600 text-lg font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-200/80">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* The difference */}
      <section className="border-t border-white/5 bg-navy-800">
        <Container className="py-16 sm:py-24">
          <Eyebrow tone="dark">The difference</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
            Done for you &mdash; without handing over your environment.
          </h2>
          <p className="mt-5 max-w-2xl text-steel-200/80">
            Most options make you pick a bad trade. Muster is the third way.
          </p>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-base font-semibold text-white">Self-serve tools</h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-steel-200/60">Vanta · Drata</p>
              <p className="mt-4 text-sm leading-relaxed text-steel-200/80">
                They hand you a dashboard and leave the work to you. A 30-person
                shop with one MSP will never operate it.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-base font-semibold text-white">Enclave bundles</h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-steel-200/60">OSIbeyond · Summit 7</p>
              <p className="mt-4 text-sm leading-relaxed text-steel-200/80">
                They take over your whole environment and your CUI &mdash;
                heavier, pricier, and a big commitment to unwind.
              </p>
            </div>
            <div className="rounded-xl border-2 border-cleared-500 bg-cleared-500/10 p-6">
              <h3 className="text-base font-semibold text-white">Muster</h3>
              <p className="mt-1 text-xs uppercase tracking-wide text-cleared-500">Operated · artifact-only</p>
              <p className="mt-4 text-sm leading-relaxed text-white/90">
                We do the work for you and hold only the compliance proof. Your
                data and your environment stay yours &mdash; at one fixed price.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <CTA href="/the-difference" variant="primary">Why artifact-only wins</CTA>
          </div>
        </Container>
      </section>

      {/* What we do */}
      <section className="border-t border-white/5">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <Eyebrow tone="dark">What Muster does</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                One productized service. Every part of the obligation.
              </h2>
              <p className="mt-5 text-steel-200/80">
                Software does the repeatable work; a credentialed practitioner
                signs off on everything that touches your score; a founder runs
                the relationship.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                "Maintain your SPRS score and re-post it every quarter",
                "Keep your SSP and POA&M current and defensible",
                "Answer prime security questionnaires for you, fast",
                "Refresh evidence against all 110 control objectives",
                "Prep you for a C3PAO assessment (within scope)",
                "Flag a slipping score before it costs you a PO",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-steel-200/80">
                  <Check /> <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-white/5 bg-navy-800">
        <Container className="py-16 sm:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow tone="dark">Pricing</Eyebrow>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Published and fixed.</h2>
              <p className="mt-3 max-w-xl text-steel-200/80">
                About 3–5× the cost of do-it-yourself software &mdash; because we
                operate it, you don&rsquo;t. One-time onboarding, then a monthly
                subscription.
              </p>
            </div>
            <CTA href="/pricing" variant="outline">See full pricing</CTA>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.name}
                className={`rounded-2xl border p-7 ${t.featured ? "border-cleared-500 bg-cleared-500/10" : "border-white/10 bg-white/5"}`}
              >
                <h3 className="text-lg font-semibold text-white">{t.name}</h3>
                <p className="mt-1 text-sm text-steel-200/70">{t.who}</p>
                <p className="mt-6 text-3xl font-bold text-white">
                  {t.mo}
                  <span className="text-base font-medium text-steel-200/70">/mo</span>
                </p>
                <p className="mt-1 text-sm text-steel-200/70">{t.setup} one-time onboarding</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Credibility */}
      <section className="border-t border-white/5">
        <Container className="py-16 sm:py-24">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-12">
            <Eyebrow tone="dark">Built to be trusted from day one</Eyebrow>
            <div className="mt-6 grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="font-semibold text-white">A credentialed practitioner signs off</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-200/80">
                  A Registered Practitioner / CMMC-certified professional reviews
                  every SPRS-affecting deliverable before it is posted or sent.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">A senior DoD advisor</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-200/80">
                  Guides our program and methodology, and stands behind the
                  quality of the work in front of your primes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">We prepare; you attest</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-200/80">
                  We are not a C3PAO and never sign your government attestations.
                  You stay in control &mdash; which is exactly the point.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/5 bg-navy-800">
        <Container className="py-20">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-navy-900 px-8 py-14 text-center sm:px-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cleared-500/20 blur-[100px]"
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Find out your SPRS score in about 15 minutes. Free.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-steel-200/80">
              No sales call required to get your report. See exactly where you
              stand against all 110 controls &mdash; then decide if you want us
              to handle it.
            </p>
            <div className="relative mt-8 flex justify-center">
              <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
