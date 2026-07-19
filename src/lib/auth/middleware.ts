import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasRole } from "@/lib/auth/rbac";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public paths
  const publicPaths = ["/login", "/register", "/api/auth", "/api/register"];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // Static files
  const isStaticFile = pathname.startsWith("/_next") || 
                       pathname.startsWith("/static") ||
                       pathname.includes(".");

  if (isPublicPath || isStaticFile) {
    return NextResponse.next();
  }

  // Protected routes
  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    if (!hasRole(session.user.role, "admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // API protection
  if (pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.user.id);
    requestHeaders.set("x-user-role", session.user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
