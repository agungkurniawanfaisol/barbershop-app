import { NextResponse, type NextRequest } from "next/server";
import { resolveRole } from "@/lib/auth/rbac";
import { updateSession } from "@/lib/supabase/middleware";
import { hasRoleAccess } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

const PUBLIC_ROUTES = ["/", "/unauthorized"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request);

  if (user && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  if (!user && !isPublicRoute(pathname) && !isAuthRoute(pathname)) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && !isPublicRoute(pathname) && !isAuthRoute(pathname)) {
    const role = resolveRole(user.app_metadata);

    if (role && !hasRoleAccess(role, pathname)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
