import { getApiBase } from '@/lib/apiBase'
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
    const apiBase = getApiBase()
    const url = `${apiBase}/users/me`

    // Extract token from HttpOnly cookie and send as Bearer token
    const cookieHeader = request.headers.get('cookie') || ''
    const tokenMatch = cookieHeader.match(/access_token=([^;]+)/)
    const token = tokenMatch ? tokenMatch[1] : null

    if (!token) {
      return NextResponse.json({ message: 'No access token found' }, { status: 401 })
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
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