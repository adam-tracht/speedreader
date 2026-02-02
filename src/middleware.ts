import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname === "/signin"

  // Redirect to sign in if not logged in and trying to access protected route
  if (!isLoggedIn && !isAuthPage && req.nextUrl.pathname.startsWith("/reader")) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  // Redirect to reader if logged in and trying to access sign in page
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/reader", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
