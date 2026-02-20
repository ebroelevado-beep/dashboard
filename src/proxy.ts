import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const intlMiddleware = createIntlMiddleware(routing);

const { auth } = NextAuth(authConfig);

// Using the NextAuth wrapper safely
export default auth((req) => {
  // Pass EVERYTHING to next-intl. 
  // Next-Intl will handle prefixing, locale negotiation, and rewrite /login to /[locale]/login.
  // We will handle protected route redirects exclusively via the `authorized` callback in auth.config.ts.
  return intlMiddleware(req);
});

export const config = {
  // This matcher strictly ignores Next.js internals and API routes to avoid unnecessary middleware execution
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
};

