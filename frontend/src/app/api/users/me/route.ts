import { NextResponse } from 'next/server'

/**
 * GET /api/users/me
 * Server-side proxy to backend /api/v1/users/me.
 * Reads token from HttpOnly cookie (access_token) and forwards as Bearer auth.
 * Returns JSON payload from upstream or a suitable error.
 */
export async function GET() {
  const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
  const base = rawBase.replace(/\/+$/, '')
  const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
  const url = `${apiBase}/users/me`

  // Read cookies on the server
  // Note: Using RequestCookies via headers for minimal overhead; NextResponse cookies not needed for GET
  // In Next 14 app router, incoming request cookies can be accessed via the standard header
  // but since this is a route handler without Request param, rely on fetch credentials-less and manually set Auth header.

  // Next route handlers cannot read HttpOnly cookie via document.cookie; instead, rely on the backend session if applicable.
  // Here we expect a JWT in the HttpOnly access_token cookie; pull it from request headers via Web APIs.
  try {
    // @ts-ignore - globalThis.request is not available; we will parse using headers from Next fetch context when available.
    // Fallback: use the cookies() API which is available in route handlers.
  } catch {}

  // Use cookies() API to read the HttpOnly cookie
  // Import lazily to avoid edge/runtime issues if not available in old versions
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  }

  let upstream: Response
  try {
    upstream = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })
  } catch {
    return NextResponse.json({ message: 'Upstream users service unreachable' }, { status: 502 })
  }

  const text = await upstream.text()
  let data: any = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    // Non-JSON response
  }

  if (!upstream.ok) {
    const msg = data?.detail || data?.message || upstream.statusText || 'Request failed'
    return NextResponse.json({ message: msg }, { status: upstream.status || 500 })
  }

  return NextResponse.json(data ?? {})
}