import { NextResponse, type NextRequest } from 'next/server'

/**
 * Simplified middleware to avoid redirect loops:
 * - Adds baseline security headers
 * - Redirects only when accessing clearly protected sections without a token
 * - Never redirects when already on /login (prevents loops)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Prepare pass-through response with headers
  const headers = new Headers(request.headers)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Do not interfere with the login route itself to prevent loops
  if (pathname.startsWith('/login')) {
    return response
  }

  // Public routes that should never redirect (kept detailed pages intact)
  const publicPrefixes = [
    '/',                 // homepage
    '/register',
    '/about',
    '/contact',
    '/help',
    '/privacy',
    '/terms',
    '/cookies',
    '/accessibility',
    '/client-resources',
    '/success-stories',
    '/community',
    '/press',
    '/how-it-works',
    '/how-to-hire',
    '/talent-marketplace',
    '/creatives',
    '/find-work',
  ]

  const isPublic = publicPrefixes.some(p =>
    p === '/' ? pathname === '/' : pathname.startsWith(p)
  )
  if (isPublic) {
    return response
  }

  // Only treat these as protected
  const protectedPrefixes = [
    '/dashboard',
    '/messages',
    '/projects',
    '/payments',
    '/notifications',
    '/profile',
    '/settings',
    '/applications',
  ]
  const isProtected = protectedPrefixes.some(p => pathname.startsWith(p))
  if (!isProtected) {
    return response
  }

  // Minimal token check: cookie or Authorization header
  const authHeader = request.headers.get('authorization') || ''
  const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
    ? authHeader.slice(7).trim()
    : null
  const cookieToken = request.cookies.get('access_token')?.value || null
  const hasToken = Boolean(bearerToken || cookieToken)

  if (!hasToken) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Simplify: do not append redirect param to avoid any cyclical behavior
    url.search = ''
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
