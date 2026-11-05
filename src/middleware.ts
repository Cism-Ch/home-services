import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Routes necessitant une authentification obligatoire
 */
const PROTECTED_PREFIXES = ["/dashboard"];

/**
 * Routes reservees aux visiteurs non authentifies
 */
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = getSessionCookie(request);
  const isAuthenticated = Boolean(sessionToken);

  // 1. Protection des routes protegees (/dashboard/*)
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (isProtected && !isAuthenticated) {
    // Sanitisation contre Open Redirect (CWE-601) : autorise uniquement les chemins relatifs internes
    const isValidRelative = pathname.startsWith("/") && !pathname.startsWith("//") && !pathname.includes("\\");
    const callbackUrl = isValidRelative ? pathname : "/dashboard/client";

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirection des utilisateurs deja connectes sur les pages d'auth
  const isAuthPage = AUTH_PAGES.some((page) => pathname === page);
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard/client", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - api/* (routes d'API et webhooks)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation images)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
