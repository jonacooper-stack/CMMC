import type { Metadata } from "next";
import { Container, Eyebrow, CTA } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about Muster: the artifact-only model, what happens if your SPRS score drops, certification guarantees, and why fixed pricing.",
};

const QA = [
  {
    q: "You really don’t host our environment or our data?",
    a: "Correct, by design. We hold the compliance proof — policies, control status, evidence, SSP/POA&M, questionnaire answers. Your CUI stays in your own environment. That keeps you in control and keeps you out of the heaviest cost and risk.",
  },
  {
    q: "What happens if our SPRS score drops?",
    a: "We recalculate it every quarter against your current evidence and flag a slip before it becomes a problem — with a remediation plan, not a surprise. Catching a falling score early is exactly what the subscription is for.",
  },
  {
    q: "Do you guarantee we’ll pass CMMC?",
    a: "No — and no one honest can. We are not a C3PAO. We get you defensibly ready and keep you that way; you attest, and the C3PAO assessor grades. We’re upfront about that line.",
  },
  {
    q: "Why not just have our MSP do it?",
    a: "Your MSP runs your IT well. DIB compliance is a specialist program with quarterly SPRS/SSP/POA&M upkeep and prime-facing questionnaires. We do that all day, and we work alongside your MSP rather than replacing them.",
  },
  {
    q: "Why fixed, published pricing?",
    a: "So you’re never surprised by an hourly bill, and so we both stay honest about scope. The tier is set by your size and questionnaire load — the free assessment tells you which one fits.",
  },
  {
    q: "Who actually does the work — are you qualified?",
    a: "Software does the repeatable work; a credentialed Registered Practitioner / CMMC professional reviews everything that touches your score; and a senior DoD/DIB advisor stands behind the methodology.",
  },
  {
    q: "Is the free assessment’s score official?",
    a: "It’s a good-faith estimate to show you where you stand against the 110 controls — not an official SPRS posting. When you onboard, your credentialed-reviewed score is what gets posted (by you).",
  },
];

export default function FAQ() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <Eyebrow>FAQ</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Straight answers.</h1>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-4">
            {QA.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-line bg-white p-6 open:ring-1 open:ring-steel-200"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-navy-900 marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-steel-500 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold">Still have a question?</h2>
          <div className="mt-7 flex justify-center gap-3">
            <CTA href="/contact" variant="ghost">Talk to us</CTA>
            <CTA href="/assessment">Get your free assessment</CTA>
          </div>
        </Container>
      </section>
    </>
  );
}
