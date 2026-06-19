import type { Metadata } from "next";
import { Container, Eyebrow, CTA, Check } from "@/components/ui";

export const metadata: Metadata = {
  title: "The artifact-only difference",
  description:
    "Muster is environment-agnostic and never touches your CUI. We hold only the compliance proof — the alternative to handing your whole environment to an MSSP.",
};

const ROWS = [
  {
    who: "Hourly RPOs / consultants",
    pitch: "A one-time gap assessment, billed by the hour.",
    weakness: "The project ends, they leave, and you maintain SPRS alone.",
  },
  {
    who: "Self-serve tools (Vanta, Drata)",
    pitch: "Automated GRC software.",
    weakness: "Implementation is on you. A small shop will not run a dashboard.",
  },
  {
    who: "Enclave bundles (OSIbeyond, Summit 7)",
    pitch: "Fully managed — including your secure environment.",
    weakness: "They take over your environment and your CUI. Heavy, pricey, hard to unwind.",
  },
  {
    who: "Your existing MSP",
    pitch: "“We’ll bolt CMMC onto your IT.”",
    weakness: "Generalists who miss DIB-specific 800-171 nuance; SPRS isn’t their core.",
  },
];

export default function TheDifference() {
  return (
    <div className="bg-navy-900 text-steel-200">
      <section className="relative overflow-hidden border-b border-white/5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-cleared-500/15 blur-[130px]"
        />
        <Container className="relative py-16 sm:py-24">
          <Eyebrow tone="dark">The difference</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">
            We hold the proof. You keep your CUI.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-steel-200/80">
            Muster is <strong className="text-white">artifact-only</strong>: our
            system of record holds your compliance evidence &mdash; policies,
            control status, SSP sections, POA&amp;M items, questionnaire answers
            &mdash; and never your raw CUI. That one decision is the whole
            difference.
          </p>
        </Container>
      </section>

      <section className="border-t border-white/5">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { h: "You stay in control", b: "Your sensitive data and your environment never leave your hands. We work on top of whatever you already run — even your existing Vanta or MSP." },
              { h: "Lower cost, lower risk", b: "No enclave to buy, no GovCloud to host, no CUI custody. That keeps us lean — and keeps your price fixed and predictable." },
              { h: "Faster to value", b: "Because we’re not migrating your environment, onboarding is weeks of paperwork and evidence, not a months-long infrastructure project." },
              { h: "The contrast, made simple", b: "The enclave players cannot say “we never touch your CUI” without abandoning the business they’re built on. We can — because we built around it." },
            ].map((c) => (
              <div key={c.h} className="rounded-xl border border-white/10 bg-white/5 p-7">
                <div className="flex items-center gap-3">
                  <Check />
                  <h3 className="text-lg font-semibold text-white">{c.h}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-steel-200/80">{c.b}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5 bg-navy-800">
        <Container className="py-16 sm:py-20">
          <Eyebrow tone="dark">How we compare</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold text-white">Everyone else makes you trade something.</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/10 text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold">Option</th>
                  <th className="px-5 py-4 font-semibold">Their pitch</th>
                  <th className="px-5 py-4 font-semibold">The catch</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.who} className="border-t border-white/10 align-top">
                    <td className="px-5 py-4 font-semibold text-white">{r.who}</td>
                    <td className="px-5 py-4 text-steel-200/80">{r.pitch}</td>
                    <td className="px-5 py-4 text-steel-200/80">{r.weakness}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-cleared-500 bg-cleared-500/10 align-top">
                  <td className="px-5 py-4 font-bold text-white">Muster</td>
                  <td className="px-5 py-4 text-white/90">Operated for you, artifact-only, one fixed price.</td>
                  <td className="px-5 py-4 text-white/90">No catch on control: your environment and CUI stay yours.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5">
        <Container className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white">
            See where you stand &mdash; on your own terms.
          </h2>
          <div className="mt-7 flex justify-center">
            <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
          </div>
        </Container>
      </section>
    </div>
  );
}
