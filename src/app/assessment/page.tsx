import type { Metadata } from "next";
import { Container, Eyebrow, Check } from "@/components/ui";
import AssessmentStartForm from "@/components/AssessmentStartForm";

export const metadata: Metadata = {
  title: "Free SPRS & 800-171 assessment",
  description:
    "Find out your estimated SPRS score against all 110 NIST 800-171 controls in about 15 minutes. Free, no sales call required, and we never ask for your CUI.",
};

export default function Assessment() {
  return (
    <div className="bg-navy-900 text-steel-200">
      <section>
        <Container className="py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <Eyebrow tone="dark">Free SPRS &amp; 800-171 assessment</Eyebrow>
              <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
                Know your SPRS score. In about 15 minutes.
              </h1>
              <p className="mt-5 text-lg text-steel-200/80">
                Answer a short, guided questionnaire about how your shop handles
                CUI. We map your answers to all 110 NIST 800-171 control
                objectives and produce an honest estimate of your current and
                target SPRS score &mdash; plus a prioritized, plain-English
                remediation plan.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "A 15–25 page report mapped to all 110 controls",
                  "Your estimated current and target SPRS score",
                  "A prioritized plan, in plain English — no jargon",
                  "No sales call required to get it",
                  "We never ask you to upload CUI",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-steel-200/80">
                    <Check /> <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 rounded-lg border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-steel-200/60">
                The assessment produces a good-faith <strong className="text-steel-200">estimate</strong> to
                show where you stand &mdash; it is not an official SPRS posting and
                is not a certification. When you onboard, your credentialed-reviewed
                score is what gets posted (by you).
              </p>
            </div>

            <div>
              <AssessmentStartForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
