import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

// PUT /api/payments/[id]/release -> backend PUT /payments/{id}/release
export async function PUT(_request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const { id } = await context.params
  const upstreamUrl = `${getApiBase()}/payments/${encodeURIComponent(id)}/release`

  try {
    const resp = await fetch(upstreamUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!resp.ok) {
      const text = await resp.text()
      let data: any = null
      try { data = text ? JSON.parse(text) : null } catch {}
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to release payment' }, { status: resp.status || 400 })
    }

    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ message: 'Upstream payments service unreachable' }, { status: 502 })
  }
}