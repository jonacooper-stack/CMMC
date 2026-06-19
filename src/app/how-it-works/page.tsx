import type { Metadata } from "next";
import { Container, Eyebrow, CTA, Check } from "@/components/ui";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Three stages: a free SPRS readiness assessment, a founder-led consultation and fixed-price proposal, then onboarding and quarterly managed compliance.",
};

const STAGES = [
  {
    n: "1",
    title: "Free SPRS & 800-171 readiness assessment",
    lede: "Start by finding out exactly where you stand — no cost, no sales call required.",
    points: [
      "A guided questionnaire about how your shop actually handles CUI",
      "A 15–25 page report mapped to all 110 NIST 800-171 control objectives",
      "An honest estimate of your current and target SPRS score",
      "A prioritized, plain-English remediation list",
    ],
  },
  {
    n: "2",
    title: "Consultation & fixed-price proposal",
    lede: "If the report shows a gap worth closing, a founder walks it with you.",
    points: [
      "A deeper look at your real CUI scope and primes",
      "The realistic path to a defensible SPRS score",
      "A written proposal at published, fixed pricing — no hourly meter",
      "Clear scope: what is included, and what we refer out",
    ],
  },
  {
    n: "3",
    title: "Onboarding, then managed every quarter",
    lede: "We get you compliant, then keep you that way — forever.",
    points: [
      "Baseline SSP, POA&M, and your initial SPRS posting package (4–8 weeks)",
      "Quarterly control reviews, evidence refresh, and SPRS re-posting",
      "Turnkey answers to inbound prime security questionnaires",
      "A credentialed RP/CCP signs off on everything that touches your score",
    ],
  },
];

export default function HowItWorks() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <Eyebrow>How it works</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
            A product sources and qualifies you. A founder closes. Then software keeps you ready.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            The free assessment does the heavy lifting up front. The five-figure,
            business-critical decision is handled by a person &mdash; not a
            checkout button.
          </p>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 sm:py-20">
          <div className="space-y-6">
            {STAGES.map((s) => (
              <div
                key={s.n}
                className="grid gap-6 rounded-2xl border border-line bg-white p-7 sm:p-9 md:grid-cols-[auto_1fr]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-xl font-bold text-white">
                  {s.n}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{s.title}</h2>
                  <p className="mt-2 text-slate-600">{s.lede}</p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-sm text-slate-600">
                        <Check /> <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold">
            It starts with one free report.
          </h2>
          <div className="mt-7 flex justify-center">
            <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
          </div>
        </Container>
      </section>
    </>
  );
}
