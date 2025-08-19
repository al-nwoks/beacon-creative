import { NextResponse } from 'next/server'

/**
 * POST /api/auth/login
 * Proxies credentials to backend /api/v1/auth/login, then sets HttpOnly cookie on success.
 * Expects JSON body: { email: string, password: string }
 * Returns 204 on success, 4xx on client error, 5xx with diagnostics on upstream failure.
 */
export async function POST(request: Request) {
  // Parse body early to return clear 400s instead of opaque 500s
  let body: any = null
  try {
    body = await request.json()
  } catch (e) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const email = body?.email
  const password = body?.password
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
  }

  // Build form-encoded body expected by FastAPI OAuth2PasswordRequestForm
  const form = new URLSearchParams()
  form.append('username', email)
  form.append('password', password)

  // Normalize backend base (server-side can reach Docker DNS)
  const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
  const base = rawBase.replace(/\/+$/, '')
  const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
  const loginUrl = `${apiBase}/auth/login`

  let resp: Response
  try {
    resp = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: form.toString(),
      cache: 'no-store',
    })
  } catch (e: any) {
    return NextResponse.json(
      { message: 'Upstream auth service unreachable', url: loginUrl },
      { status: 502 }
    )
  }

  // Attempt to parse JSON body (backend returns JSON on both success/error)
  let data: any = null
  try {
    data = await resp.json()
  } catch {
    // Not JSON; capture status text
  }

  if (!resp.ok || !data?.access_token) {
    // Forward backend status with clearer detail
    const status = resp.status || 401
    const detail = data?.detail || data?.message || resp.statusText || 'Authentication failed'
    return NextResponse.json({ message: detail, status }, { status })
  }

  const token = data.access_token as string
  const oneHour = 60 * 60

  // Build response and set cookies on it (NextResponse cookies API)
  const res = new NextResponse(null, { status: 204 })
  
  // Determine secure flag so local development (http) still receives cookies
  const secureCookie = process.env.NODE_ENV === 'production'
  
  // HttpOnly cookie with JWT
  res.cookies.set('access_token', token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: oneHour,
  })
  
  // Issue CSRF token (non-HttpOnly) for double-submit pattern
  const csrfToken = crypto.randomUUID()
  res.cookies.set('csrf_token', csrfToken, {
    httpOnly: false,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/',
    maxAge: oneHour,
  })
  
  return res
}