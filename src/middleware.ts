import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/reader", "/library", "/history", "/settings"]

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const path = req.nextUrl.pathname
  
  // Check if path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = path === "/auth" || path === "/signin" || path === "/signup"
  
  // Redirect to auth if trying to access protected route without session
  if (isProtectedRoute && !isLoggedIn) {
    const redirectUrl = new URL("/auth", req.url)
    redirectUrl.searchParams.set("redirect", path)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Redirect to reader if logged in user tries to access auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/reader", req.url))
  }
  
  // Redirect to reader if logged in user tries to access landing page
  if (path === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/reader", req.url))
  }
  
  // Continue normally
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Match all paths except for static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
}
