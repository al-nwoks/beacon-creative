import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

// GET /api/admin/recent-activity?limit=10
export async function GET(request: Request) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const url = new URL(request.url)
  const limit = url.searchParams.get('limit') || '10'
  const upstreamUrl = `${getApiBase()}/admin/recent-activity?limit=${limit}`

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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch recent activity' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ message: 'Upstream admin service unreachable' }, { status: 502 })
  }
}