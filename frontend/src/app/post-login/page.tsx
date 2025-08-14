import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Post-login server page
 *
 * After the login form sets the HttpOnly cookie, the client navigates here.
 * This server page reads the cookie and performs a server-side redirect to
 * the correct dashboard based on the user's role. Implemented as a fast
 * server-side check to avoid client-side race conditions.
 *
 * Note: keep this page minimal and fast — it only validates the cookie and redirects.
 */
export default async function PostLoginPage() {
    const token = (await cookies()).get('access_token')?.value

    // If no token, send the user to the login page to re-auth
    if (!token) {
        redirect('/login')
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

        // If token invalid/expired -> redirect to login
        if (!meResp.ok) {
            redirect('/login')
        }

        const me = await meResp.json()

        // Redirect based on role (defaults to root)
        switch (me?.role) {
            case 'creative':
                redirect('/creative')
            case 'client':
                redirect('/client')
            case 'admin':
                redirect('/admin')
            default:
                redirect('/')
        }
    } catch (err) {
        // If Next.js internal redirect error, re-throw to allow Next to handle it
        if (err && typeof err === 'object' && 'digest' in (err as any) && String((err as any).digest).startsWith('NEXT_REDIRECT')) {
            throw err
        }
        // Otherwise log and send to login (safe fallback)
        // eslint-disable-next-line no-console
        console.error('Post-login verification failed:', err)
        redirect('/login')
    }
}