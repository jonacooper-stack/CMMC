import type { Metadata } from "next";
import { Container } from "@/components/ui";
import RunWizard from "@/components/assessment/RunWizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Run your AI assessment",
  description:
    "Upload your security policies and get an AI-reviewed estimate of your SPRS score against all 110 NIST 800-171 controls.",
};

export default function RunPage() {
  return (
    <section className="bg-navy-900 text-steel-200">
      <Container className="py-12 sm:py-16">
        <RunWizard />
      </Container>
    </section>
  );
}
