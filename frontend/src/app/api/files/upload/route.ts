import { NextResponse } from 'next/server'

function apiBase() {
  const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
  const base = rawBase.replace(/\/+$/, '')
  return /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
}

async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

/**
 * POST /api/files/upload
 * Accepts multipart/form-data with fields:
 * - file: Blob
 * - project_id: string
 * Proxies as-is to backend /files/upload with Authorization.
 */
export async function POST(request: Request) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  // We cannot read the body and reconstruct form-data without losing streams.
  // Instead, forward the request as a stream while setting Authorization header.
  const upstreamUrl = `${apiBase()}/files/upload`

  try {
    const resp = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        // Intentionally do NOT set Content-Type; letting fetch include the original multipart boundary.
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: request.body,
      cache: 'no-store',
      duplex: 'half', // for Node.js streams (supported in Next route handlers runtime)
    } as RequestInit)

    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}

    if (!resp.ok) {
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to upload file' }, { status: resp.status || 400 })
    }
    return NextResponse.json(data ?? {}, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: 'Upstream files service unreachable' }, { status: 502 })
  }
}