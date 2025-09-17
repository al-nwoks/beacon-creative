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

// POST /api/messages/upload-file
export async function POST(request: Request) {
  const token = await getToken()
  if (!token) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })

  try {
    const formData = await request.formData()
    
    const resp = await fetch(`${apiBase()}/messages/upload-file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    
    const text = await resp.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch {}
    
    if (!resp.ok) {
      return NextResponse.json({ message: data?.detail || data?.message || 'Failed to upload file' }, { status: resp.status || 400 })
    }
    
    return NextResponse.json(data ?? {}, { status: 201 })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json({ message: 'Upstream messages service unreachable' }, { status: 502 })
  }
}