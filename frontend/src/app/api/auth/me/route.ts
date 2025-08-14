import { NextResponse } from 'next/server'

/**
 * GET /api/auth/me
 * Reads the HttpOnly access_token cookie set by /api/auth/login and proxies
 * to the backend /users/me endpoint. Returns the parsed JSON from backend.
 * This allows client code to perform a server-side authenticated check via fetch()
 * (with credentials included) without exposing the HttpOnly cookie to JS.
 */
export async function GET(request: Request) {
  try {
    const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
    const base = rawBase.replace(/\/+$/, '')
    const apiBase = /\/api\/v\\d+$/i.test(base) ? base : `${base}/api/v1`
    const url = `${apiBase}/users/me`

    // Forward cookies from the incoming request to the backend by using fetch with the
    // Cookie header from the request (server-side).
    const cookieHeader = request.headers.get('cookie') || ''

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    })

    const data = await resp.json().catch(() => null)

    if (!resp.ok) {
      return NextResponse.json({ message: data?.detail || data?.message || 'Unauthorized' }, { status: resp.status || 401 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in /api/auth/me:', err)
    return NextResponse.json({ message: 'Internal error' }, { status: 500 })
  }
}