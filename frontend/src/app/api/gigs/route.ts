import { NextResponse } from 'next/server'

function apiBase() {
  const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
  const base = rawBase.replace(/\/+$/, '')
  return /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
}

// GET /api/gigs?skip=&limit=&status=&category=&search=&sort_by=&sort_order=
export async function GET(request: Request) {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get('access_token')?.value
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const url = new URL(request.url)
  const qp = url.searchParams.toString()
  const upstreamUrl = `${apiBase()}/gigs/${qp ? `?${qp}` : ''}`

  try {
    const resp = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store',
    })
    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}
    if (!resp.ok) {
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch gigs' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? { items: [], total: 0, page: 1, pages: 0, limit: 100, has_more: false })
  } catch {
    return NextResponse.json({ message: 'Upstream gigs service unreachable' }, { status: 502 })
  }
}

// POST /api/gigs
export async function POST(request: Request) {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get('access_token')?.value
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  let payload: any
  try { payload = await request.json() } catch { return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 }) }

  try {
    const resp = await fetch(`${apiBase()}/gigs/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}
    if (!resp.ok) {
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to create gig' }, { status: resp.status || 400 })
    }
    return NextResponse.json(data ?? {}, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Upstream gigs service unreachable' }, { status: 502 })
  }
}