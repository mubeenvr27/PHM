import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * ============================================================
 * Next.js Middleware — Admin Route Protection (RBAC / Auth Gate)
 * ============================================================
 * Intercepts all matching requests to enforce authentication checks.
 *
 * Flow:
 *   1. Matcher intercepts `/admin/:path*`
 *   2. Bypass check allows `/admin/login` to prevent infinite redirect loops.
 *   3. Checks for `mock_admin_token` cookie.
 *   4. Redirects to `/admin/login` if cookie is missing, otherwise allows request.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass Logic: Exclude /admin/login from protection
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Mock Token Check: Check request cookies for the mock admin token
  const mockAdminToken = request.cookies.get("mock_admin_token");

  if (!mockAdminToken) {
    // Immediately redirect to the login page
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow authenticated admin requests to proceed
  return NextResponse.next();
}

// Matcher Configuration: Strictly intercept all requests to /admin/:path*
export const config = {
  matcher: ["/admin/:path*"],
};
