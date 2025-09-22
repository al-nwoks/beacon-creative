import { NextResponse } from 'next/server'

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

// DELETE /api/files/[id] -> backend DELETE /files/{id}
export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const { id } = await context.params
  const upstreamUrl = `${apiBase()}/files/${encodeURIComponent(id)}`
  try {
    const resp = await fetch(upstreamUrl, {
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to delete file' }, { status: resp.status || 400 })
    }
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ message: 'Upstream files service unreachable' }, { status: 502 })
  }
}