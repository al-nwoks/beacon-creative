import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


// Helpers
async function requireToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) {
    return { token: null as string | null, res: NextResponse.json({ message: 'Not authenticated' }, { status: 401 }) }
  }
  return { token, res: null as NextResponse | null }
}

// GET /api/gigs/[id] -> backend GET /gigs/{id}
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { token, res } = await requireToken()
  if (!token) return res!

  const { id } = await context.params
  const upstreamUrl = `${getApiBase()}/gigs/${encodeURIComponent(id)}`
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch gig' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? {})
  } catch {
    return NextResponse.json({ message: 'Upstream gigs service unreachable' }, { status: 502 })
  }
}

// PUT /api/gigs/[id] -> backend PUT /gigs/{id}
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const { token, res } = await requireToken()
  if (!token) return res!

  let payload: any
  try { payload = await request.json() } catch { return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 }) }

  try {
    const resp = await fetch(`${getApiBase()}/gigs/${encodeURIComponent(id)}`, {
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to update gig' }, { status: resp.status || 400 })
    }
    return NextResponse.json(data ?? {})
  } catch {
    return NextResponse.json({ message: 'Upstream gigs service unreachable' }, { status: 502 })
  }
}

// DELETE /api/gigs/[id] -> backend DELETE /gigs/{id}
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const { token, res } = await requireToken()
  if (!token) return res!

  try {
    const resp = await fetch(`${getApiBase()}/gigs/${encodeURIComponent(id)}`, {
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to delete gig' }, { status: resp.status || 400 })
    }
    // 204 or 200 from upstream; normalize to 204
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ message: 'Upstream gigs service unreachable' }, { status: 502 })
  }
}