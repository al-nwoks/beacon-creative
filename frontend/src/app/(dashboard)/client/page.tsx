import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Gig } from '@/types/api'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Client Dashboard | B3ACON Creative Connect',
    description: 'Manage your gigs and creative projects.',
}

export default async function ClientDashboardPage() {
    let stats = [
        { label: 'Active Gigs', value: '0', change: '' },
        { label: 'Total Spent', value: '$0', change: '' },
        { label: 'Applications', value: '0', change: '' },
        { label: 'Active Creatives', value: '0', change: '' },
    ]

    let recentGigs: Gig[] = []
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

            // Fetch dashboard stats
            try {
                const statsResp = await fetch(`${apiBase}/dashboard/client/stats`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                })

                if (statsResp.ok) {
                    const statsData = await statsResp.json()
                    if (statsData) {
                        stats = [
                            { label: 'Active Gigs', value: String(statsData.active_gigs || 0), change: '' },
                            { label: 'Total Spent', value: `$${statsData.total_spent?.toLocaleString() || 0}`, change: '' },
                            { label: 'Applications', value: String(statsData.applications || 0), change: '' },
                            { label: 'Active Creatives', value: String(statsData.active_creatives || 0), change: '' },
                        ]
                    }
                }
            } catch (err) {
                console.error('Failed to fetch client stats', err)
            }

            // Fetch recent gigs
            try {
                const gigsResp = await fetch(`${apiBase}/dashboard/client/recent-gigs`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                })

                if (gigsResp.ok) {
                    const gigsData = await gigsResp.json()
                    if (Array.isArray(gigsData)) {
                        recentGigs = gigsData as Gig[]
                    }
                }
            } catch (err) {
                console.error('Failed to fetch recent gigs', err)
            }

            // Fetch recent activity
            try {
                const activityResp = await fetch(`${apiBase}/dashboard/client/recent-activity`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                })

                if (activityResp.ok) {
                    const activityData = await activityResp.json()
                    if (Array.isArray(activityData)) {
                        recentActivity = activityData
                    }
                }
            } catch (err) {
                console.error('Failed to fetch recent activity', err)
            }
        }
    } catch (err) {
        console.error('Failed to fetch dashboard data', err)
        error = 'Failed to load dashboard data'
    }

    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client">
                <main className="container mx-auto px-4 py-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back!</h1>
                        <p className="text-neutral-600">Manage your gigs and creative projects from this dashboard.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                                <p className="text-xs text-neutral-500 mt-2">{stat.change}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Gigs */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Recent Gigs</h2>
                                    <Link href="/gigs/my-gigs">
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentGigs.map((gig) => (
                                        <div key={gig.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">{gig.title}</h3>
                                                    <p className="text-neutral-600 text-sm mb-2 line-clamp-2">{gig.description}</p>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {gig.status}
                                                        </span>
                                                        <span className="text-xs text-neutral-500">
                                                            {gig.budget_min && gig.budget_max
                                                                ? `$${gig.budget_min} - $${gig.budget_max}`
                                                                : 'Budget not specified'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-neutral-500">
                                                        Posted {gig.created_at ? new Date(gig.created_at).toLocaleDateString() : 'Unknown date'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <Link href={`/gigs/${gig.id}`} className="text-beacon-purple hover:underline text-sm font-medium">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div>
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Recent Activity</h2>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="h-2 w-2 rounded-full bg-beacon-purple"></div>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-neutral-900">
                                                    <span className="font-medium">{activity.action}</span> for <span className="font-medium">{activity.gig}</span>
                                                </p>
                                                <p className="text-xs text-neutral-500">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <Link href="/gigs/create" className="block w-full">
                                        <Button variant="primary" fullWidth>Create New Gig</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}