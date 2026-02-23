import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  localeDetection: false,
});

// Auth pages that authenticated users should not access
const AUTH_PAGES = ["/auth/signin", "/auth/error"];

// Protected pages that require authentication
const PROTECTED_PAGES = ["/khatma", "/KhatmaReaderPage"];

export default withAuth(
  async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const locale = pathname.split("/")[1] || "ar";
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    // Get user session
    const isAuthenticated =
      !!request.cookies.get("next-auth.session-token") ||
      !!request.cookies.get("__Secure-next-auth.session-token");
    const isAuthPage = AUTH_PAGES.some((page) =>
      pathWithoutLocale.startsWith(page),
    );

    const isProtectedPage = PROTECTED_PAGES.some((page) =>
      pathWithoutLocale.startsWith(page),
    );

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    // Redirect unauthenticated users away from protected pages
    if (isProtectedPage && !isAuthenticated) {
      const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Apply internationalization middleware
    return intlMiddleware(request);
  },
  {
    callbacks: {
      authorized: () => true, // Handle auth checks in the middleware function above
    },
  },
);

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|sitemap\\.xml|robots\\.txt|.*\\..*).*)",
};
