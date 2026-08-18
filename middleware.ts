import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("admin_session")?.value
  
  // Protect all /admin routes except /admin/login and /admin/setup
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/setup")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    const session = await verifySession(sessionCookie)
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Redirect authenticated users away from login
  if (request.nextUrl.pathname === "/admin/login") {
    if (sessionCookie) {
      const session = await verifySession(sessionCookie)
      if (session) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
