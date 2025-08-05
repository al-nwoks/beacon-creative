import { NextResponse, type NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Add security headers
  const headers = new Headers(request.headers)
  
  const response = NextResponse.next({
    request: {
      headers,
    },
  })

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
