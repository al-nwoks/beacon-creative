import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import ProfileClientWrapper from '@/components/profiles/ProfileClientWrapper'
import type { User } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile | B3ACON Creative Connect',
    description: 'View and edit your profile.',
}

export default async function ProfilePage() {
    let user: User | null = null

    try {
        // Fetch current user info directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            const meResp = await fetch(`${apiBase}/users/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (meResp.ok) {
                user = await meResp.json() as User
            }
        }
    } catch (err) {
        console.error('Failed to fetch user info', err)
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <div className="container mx-auto px-4 py-8">
                    {user ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                            <ProfileClientWrapper initialUser={user} />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Failed to load profile</h2>
                            <p className="text-neutral-600">There was an error loading your profile information.</p>
                        </div>
                    )}
                </div>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}