import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import ProfileContent from '@/components/profiles/ProfileContent'
import ProfileHeader from '@/components/profiles/ProfileHeader'
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

    // Format followers count for display
    const formatFollowersCount = (count: number): string => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`
        }
        return count.toString()
    }

    // Convert portfolio images to the format expected by ImageGrid
    const portfolioImages = user?.portfolio_images?.map((src, index) => ({
        id: index.toString(),
        src,
        alt: `Portfolio image ${index + 1}`
    })) || []

    // Since we can't pass event handlers to client components from server components,
    // we'll remove the event handlers and handle interactions differently
    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <div className="container mx-auto px-4 py-8">
                    {user ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                            <ProfileHeader
                                name={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Your Name'}
                                title={user.creative_type || user.bio?.split('.')[0] || 'Creative Professional'}
                                location={user.location || 'Location TBD'}
                                rating={user.rating || 0}
                                profileImage={user.profile_image_url || undefined}
                                stats={{
                                    projects: user.projects_count || 0,
                                    followers: formatFollowersCount(user.followers_count || 0),
                                    reviews: user.reviews_count || 0
                                }}
                            />

                            <ProfileContent
                                portfolioImages={portfolioImages}
                            />
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