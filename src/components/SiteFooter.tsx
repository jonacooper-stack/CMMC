import Link from "next/link";
import Logo from "./Logo";
import { Container } from "./ui";

const COLS = [
  {
    title: "Product",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/the-difference", label: "The difference" },
      { href: "/pricing", label: "Pricing" },
      { href: "/assessment", label: "Free SPRS assessment" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/why-now", label: "Why now" },
      { href: "/about", label: "About" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Talk to us" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-navy-900 text-steel-200">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo variant="white" className="h-7 w-auto" />
          <p className="mt-4 text-sm leading-relaxed text-steel-200/80">
            Managed NIST 800-171 &amp; SPRS compliance for small defense
            subcontractors. We keep your score correct and your evidence
            audit-ready &mdash; and we never touch your CUI.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-white">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-steel-200/80 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="border-t border-white/10 py-6">
        <p className="text-xs leading-relaxed text-steel-200/60">
          Muster prepares and maintains compliance evidence. We are not a C3PAO
          and do not assess or guarantee certification; the customer attests to
          all government representations. The free assessment produces a
          good-faith SPRS <em>estimate</em>, not an official score.
        </p>
        <p className="mt-3 text-xs text-steel-200/60">
          &copy; {new Date().getFullYear()} Muster. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
