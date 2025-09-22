import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

/**
 * PUT /api/users/change-password
 * Server-side proxy to backend /api/v1/users/change-password for password changes.
 * Reads token from HttpOnly cookie (access_token) and forwards as Bearer auth.
 * Accepts JSON payload and forwards to backend.
 */
export async function PUT(request: Request) {
  const upstreamUrl = `${getApiBase()}/users/change-password`

  const token = await getToken()
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  }

  try {
    // Get the request body
    const body = await request.text()
    
    const upstream = await fetch(upstreamUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body,
      cache: 'no-store',
    })
    
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
  } catch (e) {
    return NextResponse.json({ message: 'Upstream users service unreachable' }, { status: 502 })
  }
}