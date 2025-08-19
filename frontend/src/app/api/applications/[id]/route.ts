import { NextResponse, type NextRequest } from 'next/server'

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

function getIdFromParams(params: Record<string, string | string[]>): string {
  const v = params?.['id']
  const id = Array.isArray(v) ? v[0] : v
  if (!id) {
    throw new Error('Missing route param: id')
  }
  return id
}

// GET /api/applications/[id] -> backend GET /applications/{id}
export async function GET(_request: NextRequest, { params }: any) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const id = getIdFromParams(params)
  try {
    const resp = await fetch(`${apiBase()}/applications/${encodeURIComponent(id)}`, {
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch application' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? {})
  } catch {
    return NextResponse.json({ message: 'Upstream applications service unreachable' }, { status: 502 })
  }
}

// PUT /api/applications/[id] -> backend PUT /applications/{id}
export async function PUT(request: NextRequest, { params }: any) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  const id = getIdFromParams(params)

  let payload: any
  try { payload = await request.json() } catch { return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 }) }

  try {
    const resp = await fetch(`${apiBase()}/applications/${encodeURIComponent(id)}`, {
      method: 'PUT',
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to update application' }, { status: resp.status || 400 })
    }
    return NextResponse.json(data ?? {})
  } catch {
    return NextResponse.json({ message: 'Upstream applications service unreachable' }, { status: 502 })
  }
}

// DELETE /api/applications/[id] -> backend DELETE /applications/{id}
export async function DELETE(_request: NextRequest, { params }: any) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  const id = getIdFromParams(params)

  try {
    const resp = await fetch(`${apiBase()}/applications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    if (!resp.ok) {
      const text = await resp.text()
      let data: any = null
      try { data = text ? JSON.parse(text) : null } catch {}
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to delete application' }, { status: resp.status || 400 })
    }
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ message: 'Upstream applications service unreachable' }, { status: 502 })
  }
}