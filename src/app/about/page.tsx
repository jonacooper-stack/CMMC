import type { Metadata } from "next";
import { Container, Eyebrow, CTA, Check } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "Muster is built by a compliance operator and a regulated-industry closer, advised by a senior DoD/DIB leader, with a credentialed RP/CCP reviewing all SPRS-affecting work.",
};

export default function About() {
  return (
    <div className="bg-navy-900 text-steel-200">
      <section className="border-b border-white/5">
        <Container className="py-16 sm:py-20">
          <Eyebrow tone="dark">About Muster</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">
            Operators who run compliance programs &mdash; not a binder-and-invoice shop.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-steel-200/80">
            Muster exists because the small defense subcontractor &mdash; the
            30-person machine shop with one MSP and no security team &mdash; has
            been orphaned between software it can&rsquo;t operate and enclaves it
            can&rsquo;t afford. We do the work, for a fixed price, and never take
            custody of your CUI.
          </p>
        </Container>
      </section>

      <section className="bg-navy-800">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            {/* TODO: replace role descriptions with founder names + bios + headshots */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-lg font-semibold text-white">The delivery founder</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-200/80">
                A compliance operator who has run multiple SOC 2 Type II cycles
                end-to-end, plus HIPAA/HITECH and GDPR/CCPA programs. Owns the
                delivery spine, the methodology, and the system of record.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h2 className="text-lg font-semibold text-white">The go-to-market founder</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-200/80">
                A closer who has sold multi-million-dollar engagements into
                heavily regulated industries. Owns positioning, the consultative
                close, and channel relationships &mdash; exactly how a careful
                owner actually buys a five-figure trust purchase.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-10">
            <Eyebrow tone="dark">How we earn trust we haven&rsquo;t had time to earn</Eyebrow>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {[
                "A senior DoD / DIB advisor guides our program and methodology.",
                "A credentialed RP/CCP reviews every SPRS-affecting deliverable.",
                "We are pursuing CyberAB Registered Provider Organization (RPO) status.",
                "We are not a C3PAO and never sign your attestations — you stay in control.",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3 text-sm text-steel-200/80">
                  <Check /> <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-white/5">
        <Container className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white">Let&rsquo;s see where you stand.</h2>
          <div className="mt-7 flex justify-center gap-3">
            <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
            <CTA href="/contact" variant="outline">Talk to us</CTA>
          </div>
        </Container>
      </section>
    </div>
  );
}
