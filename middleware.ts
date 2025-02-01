import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Exclude login page and API routes
  if (!request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/api")) {
    // Save the last visited path
    const response = NextResponse.next()
    response.cookies.set("lastPath", request.nextUrl.pathname)
    return response
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

