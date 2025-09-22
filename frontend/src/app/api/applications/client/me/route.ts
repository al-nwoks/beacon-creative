import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function requireToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value
  if (!token) {
    return { token: null as string | null, res: NextResponse.json({ message: 'Not authenticated' }, { status: 401 }) }
  }
  return { token, res: null as NextResponse | null }
}

// GET /api/applications/client/me -> backend GET /applications/client/me
export async function GET(request: Request) {
  const { token, res } = await requireToken()
  if (!token) return res!

  const url = new URL(request.url)
  const qp = url.searchParams.toString()
  const upstreamUrl = `${getApiBase()}/applications/client/me${qp ? `?${qp}` : ''}`

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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch client applications' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ message: 'Upstream applications service unreachable' }, { status: 502 })
  }
}