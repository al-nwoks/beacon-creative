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

// GET /api/messages/between/[userId]?skip=&limit=
export async function GET(_request: Request, context: { params: Promise<{ userId: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const { userId } = await context.params
  const url = new URL(_request.url)
  const qp = url.searchParams.toString()
  const upstreamUrl = `${apiBase()}/messages/between/${encodeURIComponent(userId)}${qp ? `?${qp}` : ''}`

  try {
    const resp = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })
    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}
    if (!resp.ok) {
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch messages' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ message: 'Upstream messages service unreachable' }, { status: 502 })
  }
}