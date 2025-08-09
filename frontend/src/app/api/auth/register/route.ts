import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/register
 * Proxies registration JSON to backend /api/v1/auth/register.
 * On success, automatically logs in (calling backend /auth/login) and sets HttpOnly access_token cookie.
 *
 * Expected JSON body:
 * {
 *   "email": string,
 *   "password": string,
 *   "confirm_password": string,
 *   "first_name": string,
 *   "last_name": string,
 *   "role": "creative" | "client" | "admin",
 *   "bio"?: string,
 *   "location"?: string,
 *   "profile_image_url"?: string
 * }
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()

    // Basic required field validation
    const required = ['email', 'password', 'confirm_password', 'first_name', 'last_name', 'role']
    const missing = required.filter((k) => !payload?.[k])
    if (missing.length) {
      return NextResponse.json(
        { message: `Missing fields: ${missing.join(', ')}` },
        { status: 400 }
      )
    }

    // Normalize backend base and endpoints
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000').replace(/\/+$/, '')
    const registerUrl = /\/api\/v\d+$/i.test(base) ? `${base}/auth/register` : `${base}/api/v1/auth/register`
    const loginUrl = /\/api\/v\d+$/i.test(base) ? `${base}/auth/login` : `${base}/api/v1/auth/login`

    // 1) Register with backend (JSON)
    const regResp = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    // If backend returns non-2xx, forward message
    const regText = await regResp.text()
    let regData: any = null
    try {
      regData = regText ? JSON.parse(regText) : null
    } catch {
      // leave regData as null if not JSON
    }

    if (!regResp.ok) {
      const message = regData?.detail || regData?.message || 'Registration failed'
      return NextResponse.json({ message }, { status: regResp.status || 400 })
    }

    // 2) Auto-login: FastAPI expects form-urlencoded { username, password }
    const form = new URLSearchParams()
    form.append('username', payload.email)
    form.append('password', payload.password)

    const loginResp = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: form.toString(),
    })

    const loginText = await loginResp.text()
    let loginData: any = null
    try {
      loginData = loginText ? JSON.parse(loginText) : null
    } catch {
      // ignore parse errors
    }

    if (!loginResp.ok || !loginData?.access_token) {
      const message = loginData?.detail || loginData?.message || 'Login after registration failed'
      return NextResponse.json({ message }, { status: loginResp.status || 401 })
    }

    // 3) Set HttpOnly cookie with access token
    const token = loginData.access_token as string
    const cookieStore = await cookies()
    const maxAge = 60 * 60 // 1 hour

    cookieStore.set({
      name: 'access_token',
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge,
    })

    // Issue/refresh CSRF token (non-HttpOnly)
    const csrfToken = crypto.randomUUID()
    cookieStore.set({
      name: 'csrf_token',
      value: csrfToken,
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge,
    })

    // 201 Created with minimal payload
    return NextResponse.json({ status: 'registered' }, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}