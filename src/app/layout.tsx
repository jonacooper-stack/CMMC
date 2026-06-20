import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// Display: an engineered grotesk for headlines + the wordmark (aerospace/defense
// feel). Body: Inter for clean, legible UI. Mono: JetBrains for control ids/labels.
const display = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Muster — Keep your SPRS score correct. Keep winning work.",
    template: "%s · Muster",
  },
  description:
    "Muster runs your NIST 800-171 & SPRS compliance for you — every quarter, for one fixed price. We hold the proof; you keep your CUI. Managed compliance for small defense subcontractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const tree = (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );

  // Wrap in Clerk only when configured, so the marketing site builds and runs
  // even before the auth env vars exist (and never breaks if they're absent).
  return clerkEnabled ? (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      afterSignOutUrl="/"
    >
      {tree}
    </ClerkProvider>
  ) : (
    tree
  );
}
