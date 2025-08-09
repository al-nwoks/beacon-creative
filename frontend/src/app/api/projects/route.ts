import { NextResponse } from 'next/server'

function apiBase() {
  const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
  const base = rawBase.replace(/\/+$/, '')
  return /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
}

// GET /api/projects?skip=&limit=&status=&category=&search=
export async function GET(request: Request) {
  const url = new URL(request.url)
  const qp = url.searchParams.toString()
  const upstreamUrl = `${apiBase()}/projects/${qp ? `?${qp}` : ''}`

  try {
    const resp = await fetch(upstreamUrl, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    })
    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}
    if (!resp.ok) {
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch projects' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ message: 'Upstream projects service unreachable' }, { status: 502 })
  }
}

// POST /api/projects
export async function POST(request: Request) {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get('access_token')?.value
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  let payload: any
  try { payload = await request.json() } catch { return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 }) }

  try {
    const resp = await fetch(`${apiBase()}/projects/`, {
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to create project' }, { status: resp.status || 400 })
    }
    return NextResponse.json(data ?? {}, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Upstream projects service unreachable' }, { status: 502 })
  }
}