import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type PlanType = "basic" | "growth" | "corporate";

export const PublicRoutes = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/home",
  "/about",
  "/api/auth/webhooks(.*)",
  "/api/webhooks(.*)",
  "/api/uploadthing(.*)",
  "/api/address/autocomplete",
  "/api/address/place",
];

const SubscriptionRoute = ["/subscription(.*)"];

const isPublicRoute = createRouteMatcher(PublicRoutes);
const isSubscriptionRoute = createRouteMatcher(SubscriptionRoute);

const OrganisationCreationRoutes = new Set(["/organisation/create"]);


function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  if (!isPublicRoute(req)) {
    await auth.protect();
    const { userId } = await auth();

    if (userId) {
      try {
        // Get user to check publicMetadata for organization info
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = await clerkClient();
        let user = await client.users.getUser(userId);
        const organizationId = user.publicMetadata?.organizationId as string;
        const orgType = user.publicMetadata?.orgType as string;
        let plan = user.publicMetadata?.subscriptionPlan as PlanType;

        console.log(
          `User ${userId} - organizationId: ${organizationId}, orgType: ${orgType}, plan: ${plan}`
        );

        if (!organizationId && !OrganisationCreationRoutes.has(pathname)) {
          console.log(
            "No organization found in user metadata, redirecting to create organization page"
          );
          return NextResponse.redirect(
            new URL("/organisation/create", req.url)
          );
        }
        if (pathname === "/organisation/create" && organizationId) {
          console.log(
            "Organization already exists in user metadata, redirecting to dashboard"
          );
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (!isSubscriptionRoute(req) && !plan && organizationId) {
          console.log("No plan found — waiting to recheck session...");
          await delay(400); // 300–500ms for Clerk to propagate
          user = await client.users.getUser(userId); // re-fetch user
          plan = user.publicMetadata?.subscriptionPlan as PlanType;

          if (!plan) {
            console.log(
              "Still no plan after delay — redirecting to /subscription"
            );
            return NextResponse.redirect(new URL("/subscription", req.url));
          } else {
            console.log("Plan loaded after delay — continuing");
          }
        }
      } catch (error) {
        console.error("Error checking user organization metadata:", error);
        // On error, allow the request to continue rather than blocking the user
      }
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
