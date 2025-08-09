import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Server-side post-login landing page.
 *
 * Usage:
 * - After login (POST /api/auth/login sets HttpOnly cookie), the client should navigate
 *   here (full-page navigation). This page reads the cookie server-side, validates it
 *   with the backend (/users/me) and issues a server-side redirect to the appropriate
 *   dashboard based on the user's role.
 *
 * Benefits:
 * - Avoids client-side race conditions reading freshly-set HttpOnly cookies.
 * - Keeps routing decisions on the server so ProtectedRoute/client checks don't cause loops.
 */

export default async function PostLoginPage() {
    const token = (await cookies()).get('access_token')?.value

    if (!token) {
        // No cookie -> send to login
        redirect(`/login`)
    }

    try {
        const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
        const base = rawBase.replace(/\/+$/, '')
        const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
        const meResp = await fetch(`${apiBase}/users/me`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            cache: 'no-store',
        })

        if (!meResp.ok) {
            // Token invalid / expired -> remove cookie by redirecting to login so user can re-auth
            redirect('/login')
        }

        const me = await meResp.json()

        switch (me?.role) {
            case 'creative':
                redirect('/creative-dashboard')
            case 'client':
                redirect('/dashboard')
            case 'admin':
                redirect('/admin')
            default:
                redirect('/')
        }
    } catch (err) {
        // If this is Next's internal redirect exception, re-throw so Next can handle it.
        if (err && typeof err === 'object' && 'digest' in (err as any) && String((err as any).digest).startsWith('NEXT_REDIRECT')) {
            throw err
        }
        // Otherwise log and redirect to login so user can retry.
        // eslint-disable-next-line no-console
        console.error('Post-login verification failed:', err)
        redirect('/login')
    }
}