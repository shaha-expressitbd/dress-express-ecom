import { type NextRequest, NextResponse } from "next/server";

// Route configurations
const publicRoutes = ["/", "/about", "/contact", "/pricing"];
const authRoutes = [
  "/login",
  "/register",
  "/verify-email",
  "/reset-password",
  "/forgot-password",
];
const privateRoutes = [
  "/dashboard",
  "/dashboard/:path*",
  "/profile",
  "/settings",
  "/billing",
];

// Helper to check if a pathname matches a route with wildcard
function matchesRoute(pathname: string, route: string) {
  const regex = new RegExp(
    `^${route
      .replace(/:\w+\*/g, ".*")
      .replace(/:\w+/g, "[^/]+")
      .replace(/\*/g, ".*")}$`
  );
  return regex.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // === 1. Host validation ===
  const host = request.headers.get("host");
  if (host) {
    const hostName = host.split(":")[0]!;

    // Get allowed hosts from environment variable
    const allowedHostsEnv = process.env.ALLOWED_HOSTS;
    const allowedHosts =
      allowedHostsEnv && allowedHostsEnv.split(",").map((h) => h.trim());

    if (!String(allowedHosts).includes(hostName)) {
      return new Response("<h1>Forbidden: Invalid Host</h1>", {
        status: 403,
        headers: { "Content-Type": "text/html" },
      });
    }
  }

  // === 2. Skip middleware for static files, images, etc. based on matcher below ===
  // (Handled by `config.matcher`)

  // === 3. Handle API routes early (no redirect logic) ===
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // === 4. Authentication check (mocked for now) ===
  // const cookies = request.cookies;
  // const sessionToken = cookies.get("sessionToken")?.value;
  // const isAuthenticated = sessionToken ? await verifyAuth(sessionToken) : false;
  const isAuthenticated = false; // Replace with real auth logic

  // === 5. Public routes ===
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // === 6. Auth routes (redirect if already logged in) ===
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // === 7. Private routes (protect) ===
  if (privateRoutes.some((route) => matchesRoute(pathname, route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // === 8. Allow everything else (fallback) ===
  return NextResponse.next();
}

// Apply middleware only to relevant routes
export const config = {
  matcher: [
    // Match all routes except static assets, images, and public files
    "/((?!_next/static|_next/image|favicon.ico|images|public|blog|portfolio|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
