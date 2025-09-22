import { getApiBase } from "@/lib/apiBase"
import { NextResponse, type NextRequest } from 'next/server'


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

// GET /api/applications/gig/[id] -> backend GET /applications/gig/{id}
export async function GET(_request: NextRequest, { params }: any) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const id = getIdFromParams(params)
  const upstreamUrl = `${getApiBase()}/applications/gig/${encodeURIComponent(id)}`
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch gig applications' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ message: 'Upstream applications service unreachable' }, { status: 502 })
  }
}