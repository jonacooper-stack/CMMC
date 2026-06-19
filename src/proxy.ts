/**
 * Next 16 "proxy" (formerly middleware) — runs on the Node runtime. Wires Clerk
 * auth across the app and protects the assessment platform routes. Public
 * marketing routes pass through untouched.
 */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// NOTE: /api/uploads is deliberately NOT protected here. It receives a
// server-to-server `blob.upload-completed` webhook from Vercel Blob that is
// authenticated by an `x-vercel-signature` header and carries no Clerk session.
// Gating it with auth.protect() rejects that callback, so Vercel never gets its
// completion confirmation and the browser's upload() hangs forever. Auth for
// minting an upload token is enforced inside the route's onBeforeGenerateToken.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/assessment/run(.*)",
  "/api/assessment/run(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets…
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|otf|map)).*)",
    // …and always on API routes.
    "/(api|trpc)(.*)",
  ],
};
