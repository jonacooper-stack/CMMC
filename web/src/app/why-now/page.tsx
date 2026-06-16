import type { Metadata } from "next";
import { Container, Eyebrow, CTA } from "@/components/ui";

export const metadata: Metadata = {
  title: "Why now",
  description:
    "DFARS 7012/7019/7020 already require a current SPRS score today. CMMC Level 2 certification phases into new contracts from Nov 10, 2026. Prep takes 6–12 months.",
};

const TIMELINE = [
  { date: "Today", title: "The obligation is already live", body: "DFARS 7019/7020 require a current SPRS self-assessment score. A blank or stale score can freeze your purchase orders right now — independent of CMMC." },
  { date: "Nov 10, 2025", title: "Acquisition rule in effect", body: "DFARS 252.204-7021 is effective; CMMC requirements begin appearing in solicitations." },
  { date: "Nov 10, 2026", title: "CMMC Level 2 starts gating contracts", body: "Mandatory third-party (C3PAO) certification begins appearing in new CUI contracts. Prep realistically takes 6–12 months — so the decision window is now." },
  { date: "2027–2028", title: "Phased to full implementation", body: "Requirements extend across options and renewals. The obligation becomes permanent and recurring — every quarter, forever." },
];

export default function WhyNow() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <Container className="py-16 sm:py-20">
          <Eyebrow>Why now</Eyebrow>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold sm:text-5xl">
            This isn&rsquo;t a 2026 problem. It&rsquo;s a today problem &mdash; that never ends.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            The headlines are about the CMMC deadline. The reality is that the
            underlying SPRS obligation already binds you, and once you&rsquo;re
            compliant it has to be maintained every quarter. Both facts point to
            the same move.
          </p>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 sm:py-20">
          <ol className="relative space-y-8 border-l-2 border-line pl-8">
            {TIMELINE.map((t) => (
              <li key={t.date} className="relative">
                <span className="absolute -left-[39px] mt-1 h-4 w-4 rounded-full border-2 border-white bg-cleared-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-steel-700">{t.date}</span>
                <h2 className="mt-1 text-xl font-bold text-navy-900">{t.title}</h2>
                <p className="mt-2 max-w-2xl text-slate-600">{t.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white">
        <Container className="py-16 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold">
            The supply chain is years behind. Get ahead of it.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Assessor capacity is scarce and backlogs are forming. The subs who
            start now are the ones who keep winning work.
          </p>
          <div className="mt-7 flex justify-center">
            <CTA href="/assessment">Get your free SPRS assessment</CTA>
          </div>
        </Container>
      </section>
    </>
  );
}
