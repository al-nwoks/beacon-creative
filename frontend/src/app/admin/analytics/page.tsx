import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'
import AdminAnalyticsClient from './AdminAnalyticsClient'

export const metadata: Metadata = {
    title: 'Platform Analytics | B3ACON Admin',
    description: 'View platform analytics and metrics.',
}

export default async function AdminAnalyticsPage() {
    // Fetch real data from the API
    let stats = {
        total_users: 0,
        users_by_role: {
            admin: 0,
            creative: 0,
            client: 0
        },
        admins: 0,
        creatives: 0,
        clients: 0
    }

    let analyticsData = {
        user_growth: [],
        gig_growth: [],
        payment_data: []
    }

    let recentActivity: any[] = []
    let error: string | null = null

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            // Fetch all data in parallel
            const [statsResp, analyticsResp, activityResp] = await Promise.allSettled([
                fetch(`${apiBase}/admin/stats`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/admin/analytics?days=30`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/admin/recent-activity?limit=10`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                })
            ])

            // Process stats
            if (statsResp.status === 'fulfilled' && statsResp.value.ok) {
                const statsData = await statsResp.value.json()
                if (statsData) {
                    stats = statsData
                }
            }

            // Process analytics
            if (analyticsResp.status === 'fulfilled' && analyticsResp.value.ok) {
                const data = await analyticsResp.value.json()
                if (data) {
                    analyticsData = data
                }
            }

            // Process recent activity
            if (activityResp.status === 'fulfilled' && activityResp.value.ok) {
                const data = await activityResp.value.json()
                if (Array.isArray(data)) {
                    recentActivity = data
                }
            }
        } else {
            error = 'Not authenticated'
        }
    } catch (err) {
        console.error('Failed to fetch analytics data', err)
        error = 'Failed to fetch analytics data'
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <AdminAnalyticsClient
                    initialStats={stats}
                    initialAnalytics={analyticsData}
                    initialActivity={recentActivity}
                    error={error}
                />
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}