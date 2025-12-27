import { NextResponse, type NextRequest } from "next/server";

// Security headers for production
const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export async function middleware(request: NextRequest) {
  // Replit Auth headers
  const userId = request.headers.get("X-Replit-User-Id");
  const userName = request.headers.get("X-Replit-User-Name");

  // Offentlige ruter som ikke krever auth
  const publicRoutes = ["/sign-in", "/api/auth", "/_next", "/favicon.ico"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Hvis ikke innlogget og ikke på offentlig rute, redirect til sign-in
  if (!userId && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Legg til brukerinfo og security headers i response
  const response = NextResponse.next();

  // Security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // User headers
  if (userId) {
    response.headers.set("x-user-id", userId);
    response.headers.set("x-user-name", userName || "");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
