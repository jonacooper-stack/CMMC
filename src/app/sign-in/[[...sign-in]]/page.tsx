import { SignIn } from "@clerk/nextjs";
import { Container } from "@/components/ui";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <section className="bg-white">
      <Container className="flex justify-center py-16 sm:py-20">
        <SignIn />
      </Container>
    </section>
  );
}
