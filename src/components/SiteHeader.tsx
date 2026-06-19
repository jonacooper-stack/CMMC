import Link from "next/link";
import Logo from "./Logo";
import { CTA, Container } from "./ui";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/the-difference", label: "The difference" },
  { href: "/pricing", label: "Pricing" },
  { href: "/why-now", label: "Why now" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-900/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Muster home" className="flex items-center">
          <Logo variant="white" className="h-7 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-steel-200/80 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm font-semibold text-white/90 transition-colors hover:text-white sm:inline"
          >
            Sign in
          </Link>
          <CTA href="/assessment/run" className="px-4 py-2">
            Get my score
          </CTA>
        </div>
      </Container>
    </header>
  );
}
