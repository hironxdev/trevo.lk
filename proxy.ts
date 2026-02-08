import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes that don't require authentication
const publicRoutes = ["/", "/vehicles", "/about", "/contact", "/how-it-works", "/faq", "/partner/register"]

// Auth routes
const authRoutes = ["/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"]

// Role-based protected routes
const userProtectedRoutes = ["/dashboard", "/profile", "/bookings", "/favorites", "/reviews"]
const partnerProtectedRoutes = ["/partner"]
const adminProtectedRoutes = ["/admin"]

const apiAuthPrefix = "/api/auth"

// Redirect paths
const DEFAULT_LOGIN_REDIRECT = "/dashboard"
const AUTH_REDIRECT = "/auth/sign-in"
const PARTNER_REDIRECT = "/partner/dashboard"
const ADMIN_REDIRECT = "/admin"

export async function proxy(request: NextRequest) {
  const { nextUrl } = request

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  const isLoggedIn = !!token
  const userRole = token?.role as string | undefined

  const isUser = isLoggedIn && userRole === "USER"
  const isPartner = isLoggedIn && (userRole === "BUSINESS_PARTNER" || userRole === "INDIVIDUAL_PARTNER")
  const isAdmin = isLoggedIn && userRole === "ADMIN"


  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.some(
    (route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`),
  )
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route))

  const isUserRoute = userProtectedRoutes.some((route) => nextUrl.pathname.startsWith(route))
  const isPartnerRoute = nextUrl.pathname.startsWith(partnerProtectedRoutes[0])
  const isAdminRoute = nextUrl.pathname.startsWith(adminProtectedRoutes[0])

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Allow public routes for everyone
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // AUTH ROUTES (/auth/sign-in, /auth/sign-up)
  if (isAuthRoute) {
    if (isAdmin) {
      return NextResponse.redirect(new URL(ADMIN_REDIRECT, nextUrl))
    }
    if (isPartner) {
      return NextResponse.redirect(new URL(PARTNER_REDIRECT, nextUrl))
    }
    if (isUser) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    // Not logged in - allow access to auth pages
    return NextResponse.next()
  }

  // USER PROTECTED ROUTES (/dashboard, /profile, /bookings, etc.)
  if (isUserRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(new URL(`${AUTH_REDIRECT}?callbackUrl=${callbackUrl}`, nextUrl))
    }
    if (isAdmin) {
      return NextResponse.redirect(new URL(ADMIN_REDIRECT, nextUrl))
    }
    if (isPartner) {
      return NextResponse.redirect(new URL(PARTNER_REDIRECT, nextUrl))
    }
    if (isUser) {
      return NextResponse.next()
    }
    // Unknown role - redirect to login
    return NextResponse.redirect(new URL(AUTH_REDIRECT, nextUrl))
  }

  // PARTNER PROTECTED ROUTES (/partner/*)
  if (isPartnerRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(new URL(`${AUTH_REDIRECT}?callbackUrl=${callbackUrl}`, nextUrl))
    }
    if (isAdmin) {
      // Admins can access partner routes
      return NextResponse.next()
    }
    if (!isPartner) {
      // Not a partner - redirect based on role
      if (isUser) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }
      return NextResponse.redirect(new URL(AUTH_REDIRECT, nextUrl))
    }
    // Partner accessing partner area - allow
    return NextResponse.next()
  }

  // ADMIN PROTECTED ROUTES (/admin/*)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(new URL(`${AUTH_REDIRECT}?callbackUrl=${callbackUrl}`, nextUrl))
    }
    if (!isAdmin) {
      // Not admin - redirect based on role
      if (isPartner) {
        return NextResponse.redirect(new URL(PARTNER_REDIRECT, nextUrl))
      }
      if (isUser) {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
      }
      return NextResponse.redirect(new URL(AUTH_REDIRECT, nextUrl))
    }
    // Admin accessing admin area - allow
    return NextResponse.next()
  }

  // Add no-store cache headers to prevent back button issues
  const response = NextResponse.next()
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate")
  response.headers.set("Pragma", "no-cache")
  response.headers.set("Expires", "0")

  return response
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}