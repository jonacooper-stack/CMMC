import type { Metadata } from "next";
import { Container, Eyebrow, CTA } from "@/components/ui";

export const metadata: Metadata = {
  title: "Talk to us",
  description: "Get in touch with Muster, or start with a free SPRS assessment.",
};

export default function Contact() {
  return (
    <section className="bg-white">
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Talk to us</Eyebrow>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
            The fastest way to a real answer is your free report.
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Most owners start with the free SPRS assessment &mdash; it tells you
            exactly where you stand in about 15 minutes, no sales call required.
            Prefer to talk first? Reach us directly.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <CTA href="/assessment/run">Get your free SPRS assessment</CTA>
            <a
              href="mailto:hello@getmuster.com"
              className="text-sm font-semibold text-navy-900 hover:text-steel-700"
            >
              hello@getmuster.com
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
