import type { Metadata } from "next";
import { Container, Eyebrow, CTA, Check } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Muster is built by a compliance operator and a regulated-industry closer, advised by a senior DoD/DIB leader, with a credentialed RP/CCP reviewing all SPRS-affecting work.",
};

export default function About() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <Eyebrow>About Muster</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
            Operators who run compliance programs &mdash; not a binder-and-invoice shop.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Muster exists because the small defense subcontractor &mdash; the
            30-person machine shop with one MSP and no security team &mdash; has
            been orphaned between software it can&rsquo;t operate and enclaves it
            can&rsquo;t afford. We do the work, for a fixed price, and never take
            custody of your CUI.
          </p>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {/* TODO: replace role descriptions with founder names + bios + headshots */}
            <div className="rounded-2xl border border-line bg-white p-8">
              <h2 className="text-lg font-semibold text-navy-900">The delivery founder</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                A compliance operator who has run multiple SOC 2 Type II cycles
                end-to-end, plus HIPAA/HITECH and GDPR/CCPA programs. Owns the
                delivery spine, the methodology, and the system of record.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-8">
              <h2 className="text-lg font-semibold text-navy-900">The go-to-market founder</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                A closer who has sold multi-million-dollar engagements into
                heavily regulated industries. Owns positioning, the consultative
                close, and channel relationships &mdash; exactly how a careful
                owner actually buys a five-figure trust purchase.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-white p-8 sm:p-10">
            <Eyebrow>How we earn trust we haven&rsquo;t had time to earn</Eyebrow>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                "A senior DoD / DIB advisor guides our program and methodology.",
                "A credentialed RP/CCP reviews every SPRS-affecting deliverable.",
                "We are pursuing CyberAB Registered Provider Organization (RPO) status.",
                "We are not a C3PAO and never sign your attestations — you stay in control.",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check /> <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold">Let&rsquo;s see where you stand.</h2>
          <div className="mt-7 flex justify-center gap-3">
            <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
            <CTA href="/contact" variant="ghost">Talk to us</CTA>
          </div>
        </Container>
      </section>
    </>
  );
}
