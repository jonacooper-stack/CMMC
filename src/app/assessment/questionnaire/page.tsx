import type { Metadata } from "next";
import { Container } from "@/components/ui";
import Questionnaire from "@/components/assessment/Questionnaire";

export const metadata: Metadata = {
  title: "Your guided SPRS assessment",
  description:
    "Answer a short, guided questionnaire mapped to all 110 NIST 800-171 control objectives and get your estimated SPRS score instantly. We never ask for your CUI.",
};

export default function QuestionnairePage() {
  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-16">
        <Questionnaire />
      </Container>
    </section>
  );
}
