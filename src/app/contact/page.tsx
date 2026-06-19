import type { Metadata } from "next";
import { Container, Eyebrow, CTA } from "@/components/ui";

export const metadata: Metadata = {
  title: "Talk to us",
  description: "Get in touch with Muster, or start with a free SPRS assessment.",
};

export default function Contact() {
  return (
    <div className="bg-navy-900 text-steel-200">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cleared-500/15 blur-[130px]"
        />
        <Container className="relative py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <Eyebrow tone="dark">Talk to us</Eyebrow>
            </div>
            <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              The fastest way to a real answer is your free report.
            </h1>
            <p className="mt-5 text-lg text-steel-200/80">
              Most owners start with the free SPRS assessment &mdash; it tells you
              exactly where you stand in about 15 minutes, no sales call required.
              Prefer to talk first? Reach us directly.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
              <a
                href="mailto:hello@getmuster.com"
                className="text-sm font-semibold text-cleared-500 transition-colors hover:text-white"
              >
                hello@getmuster.com
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
