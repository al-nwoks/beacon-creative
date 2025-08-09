import LoginForm from '@/components/forms/LoginForm'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Log In | B3ACON Creative Connect',
    description: 'Log in to your B3ACON account to access your projects, messages, and more.',
}

export default async function LoginPage() {
    // Check if user is already authenticated (server-side)
    const token = (await cookies()).get('access_token')?.value
    if (token) {
        try {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`
            const meResp = await fetch(`${apiBase}/users/me`, {
                method: 'GET',
                headers: token ? { Authorization: `Bearer ${token}`, Accept: 'application/json' } : {},
                cache: 'no-store',
            })
            // If token is valid, redirect to the appropriate dashboard based on role.
            if (meResp.ok) {
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
            }
            // If the server reports not ok, let the login form render so the user can re-authenticate.
        } catch (err) {
            // Upstream could be unreachable or other error - allow user to log in normally
            // eslint-disable-next-line no-console
            console.error('Error verifying session on server:', err)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="text-2xl font-bold text-beacon-purple">
                        B3ACON
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-neutral-500">
                <div className="container mx-auto px-4">
                    <p>&copy; {new Date().getFullYear()} B3ACON Creative Connect. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <Link href="/terms" className="hover:text-beacon-purple">Terms</Link>
                        <Link href="/privacy" className="hover:text-beacon-purple">Privacy</Link>
                        <Link href="/help" className="hover:text-beacon-purple">Help</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}