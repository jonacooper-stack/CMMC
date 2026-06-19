/**
 * Next 16 "proxy" (formerly middleware) — runs on the Node runtime. Wires Clerk
 * auth across the app and protects the assessment platform routes. Public
 * marketing routes pass through untouched.
 */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/assessment/run(.*)",
  "/api/uploads(.*)",
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
