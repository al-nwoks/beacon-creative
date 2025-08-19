import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Clears the HttpOnly access_token cookie (and csrf_token if present).
 * Returns 204 on success.
 */
export async function POST() {
  const cookieStore = await cookies()

  // Clear access token
  cookieStore.set({
    name: 'access_token',
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  // Clear csrf token
  cookieStore.set({
    name: 'csrf_token',
    value: '',
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })

  return new NextResponse(null, { status: 204 })
}