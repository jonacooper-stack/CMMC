import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Container, Eyebrow } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <section className="bg-white">
      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Your account</Eyebrow>
              <h1 className="mt-3 text-3xl font-bold">Welcome{user?.firstName ? `, ${user.firstName}` : ""}.</h1>
              {email && <p className="mt-2 text-sm text-slate-500">{email}</p>}
            </div>
            <UserButton />
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-paper p-7 sm:p-8">
            <h2 className="text-xl font-bold text-navy-900">Start your assessment</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Upload your security policies and we&rsquo;ll review them against all 110 NIST
              800-171 controls, ask a few clarifying questions, and give you your estimated SPRS
              score &mdash; self-assessed and audit-ready.
            </p>
            <Link
              href="/assessment/run"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-cleared-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cleared-700"
            >
              New assessment
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
