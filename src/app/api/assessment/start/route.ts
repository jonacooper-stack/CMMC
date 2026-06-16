import { NextResponse } from "next/server";

type Lead = {
  name?: string;
  email?: string;
  company?: string;
  employees?: string;
  primes?: string;
  sprs_status?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const company = body.company?.trim();

  if (!name || !company || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid name, email, or company." },
      { status: 422 },
    );
  }

  // TODO (WS-1/WS-6): forward this lead to the CRM + transactional email, and
  // kick off the guided assessment + report generation (WS-4). For now we log
  // it so the funnel is wired end-to-end and conversions are observable.
  const lead = {
    name,
    email,
    company,
    employees: body.employees ?? "",
    primes: body.primes ?? "",
    sprs_status: body.sprs_status ?? "",
    receivedAt: new Date().toISOString(),
  };
  console.log("[assessment:lead]", JSON.stringify(lead));

  return NextResponse.json({ ok: true });
}
