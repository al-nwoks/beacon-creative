import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

// PUT /api/notifications/read-all -> backend PUT /notifications/read-all
export async function PUT() {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const upstreamUrl = `${getApiBase()}/notifications/read-all`

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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to mark all notifications as read' }, { status: resp.status || 400 })
    }

    const data = await resp.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ message: 'Upstream notifications service unreachable' }, { status: 502 })
  }
}