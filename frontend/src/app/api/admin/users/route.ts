import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

// GET /api/admin/users
export async function GET(request: Request) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const url = new URL(request.url)
  const qp = url.searchParams.toString()
  const upstreamUrl = `${getApiBase()}/admin/users${qp ? `?${qp}` : ''}`

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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to fetch users' }, { status: resp.status || 500 })
    }
    return NextResponse.json(data ?? [])
  } catch {
    return NextResponse.json({ message: 'Upstream admin service unreachable' }, { status: 502 })
  }
}

// POST /api/admin/users
export async function POST(request: Request) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  let payload: any
  try { payload = await request.json() } catch { return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 }) }

  try {
    const resp = await fetch(`${getApiBase()}/admin/users`, {
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to create user' }, { status: resp.status || 400 })
    }
    return NextResponse.json(data ?? {}, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Upstream admin service unreachable' }, { status: 502 })
  }
}