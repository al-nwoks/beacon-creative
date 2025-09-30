import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

// DELETE /api/messages/conversation/[userId]
export async function DELETE(_request: Request, context: { params: Promise<{ userId: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const { userId } = await context.params
  const upstreamUrl = `${getApiBase()}/messages/conversation/${encodeURIComponent(userId)}`

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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to delete conversation' }, { status: resp.status || 400 })
    }

    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}

    return NextResponse.json(data ?? { message: 'Conversation deleted successfully' })
  } catch {
    return NextResponse.json({ message: 'Upstream messages service unreachable' }, { status: 502 })
  }
}