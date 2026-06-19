import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const text = tone === "dark" ? "text-steel-200" : "text-steel-700";
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.18em] ${text}`}
    >
      <span className="h-1.5 w-1.5 flex-none rounded-[1px] bg-cleared-500" aria-hidden />
      {children}
    </span>
  );
}

type CTAProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  className?: string;
};

export function CTA({ href, children, variant = "primary", className = "" }: CTAProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors";
  const styles = {
    primary: "bg-cleared-600 text-white shadow-sm shadow-cleared-700/20 hover:bg-cleared-700",
    secondary: "bg-navy-900 text-white hover:bg-navy-800",
    ghost: "border border-line bg-white text-navy-900 hover:border-steel-500",
    outline: "border border-white/25 text-white hover:bg-white/10",
  }[variant];
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

/** Small green "check" used in lists. */
export function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 flex-none text-cleared-600 ${className}`}
      fill="none"
      aria-hidden
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.12" />
      <path
        d="M6 10.5l2.5 2.5L14 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
