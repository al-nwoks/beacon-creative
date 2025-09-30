import { getApiBase } from "@/lib/apiBase"
import { NextResponse } from 'next/server'


async function getToken() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  return cookieStore.get('access_token')?.value || null
}

/**
 * DELETE /api/files/portfolio/[index]
 * Deletes a portfolio image by index.
 * Proxies to backend /files/portfolio/{index} with Authorization.
 */
export async function DELETE(_request: Request, context: { params: Promise<{ index: string }> }) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  const { index } = await context.params
  const upstreamUrl = `${getApiBase()}/files/portfolio/${encodeURIComponent(index)}`
  
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
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to delete portfolio image' }, { status: resp.status || 400 })
    }
    
    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}
    
    return NextResponse.json(data ?? {}, { status: 200 })
  } catch (e) {
    return NextResponse.json({ message: 'Upstream files service unreachable' }, { status: 502 })
  }
}