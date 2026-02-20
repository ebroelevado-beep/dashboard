import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware(routing);

const publicPages = ["/", "/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const isPublicPage = publicPages.some((page) => {
    if (req.nextUrl.pathname === page) return true;

    if (page === "/") {
      return routing.locales.some(
        (locale) =>
          req.nextUrl.pathname === `/${locale}` ||
          req.nextUrl.pathname === `/${locale}/`
      );
    }

    return routing.locales.some(
      (locale) =>
        req.nextUrl.pathname === `/${locale}${page}` ||
        req.nextUrl.pathname.startsWith(`/${locale}${page}/`)
    );
  });

  // For protected pages, manually check the NextAuth JWT.
  // We completely bypass the NextAuth `auth()` wrapper because it forces infinite
  // 307 HTTPS redirects when it detects `http:` coming from the Dokploy reverse proxy.
  if (!isPublicPage) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
    });

    if (!token) {
      const url = req.nextUrl.clone();
      
      // Extract locale from the current path if present
      const pathnameParts = req.nextUrl.pathname.split('/');
      const potentialLocale = pathnameParts[1];
      const locale = ["en", "es", "zh"].includes(potentialLocale) ? potentialLocale : "en";
      
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  // Pass ALL requests (public or successfully authenticated) to next-intl
  // to handle routing, prefixing, and locale negotiation.
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
