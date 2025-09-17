import { NextResponse } from 'next/server'

function apiBase() {
  const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
  const base = rawBase.replace(/\/+$/, '')
  return /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
}

async function requireToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) {
    return { token: null as string | null, res: NextResponse.json({ message: 'Not authenticated' }, { status: 401 }) }
  }
  return { token, res: null as NextResponse | null }
}

// GET /api/admin/gigs -> backend GET /admin/gigs
export async function GET(request: Request) {
  const { token, res } = await requireToken()
  if (!token) return res!

  const url = new URL(request.url)
  const qp = url.searchParams.toString()
  const upstreamUrl = `${apiBase()}/admin/gigs${qp ? `?${qp}` : ''}`

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
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ message: 'Upstream admin service unreachable' }, { status: 502 })
  }
}