import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  // Temporarily allow all access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf:
     * - api/auth/* (routes Better-auth)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation images)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};