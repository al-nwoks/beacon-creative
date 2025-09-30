import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Application } from '@/types/api'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Creative Dashboard | B3ACON Creative Connect',
    description: 'Find gigs and manage your creative portfolio.',
}

export default async function CreativeDashboardPage() {
    let stats = [
        { label: 'Active Applications', value: '0', change: '' },
        { label: 'Total Earned', value: '$0', change: '' },
        { label: 'Completed Gigs', value: '0', change: '' },
        { label: 'Success Rate', value: '0%', change: '' },
    ]

    let recentApplications: Application[] = []
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
                const statsResp = await fetch(`${apiBase}/dashboard/creative/stats`, {
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
                            { label: 'Active Applications', value: String(statsData.active_applications || 0), change: '' },
                            { label: 'Total Earned', value: `$${statsData.total_earned?.toLocaleString() || 0}`, change: '' },
                            { label: 'Completed Gigs', value: String(statsData.completed_gigs || 0), change: '' },
                            { label: 'Success Rate', value: `${statsData.success_rate || 0}%`, change: '' },
                        ]
                    }
                }
            } catch (err) {
                console.error('Failed to fetch creative stats', err)
            }

            // Fetch recent applications
            try {
                const applicationsResp = await fetch(`${apiBase}/dashboard/creative/recent-applications`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                })

                if (applicationsResp.ok) {
                    const applicationsData = await applicationsResp.json()
                    if (Array.isArray(applicationsData)) {
                        recentApplications = applicationsData as Application[]
                    }
                }
            } catch (err) {
                console.error('Failed to fetch recent applications', err)
            }

            // Fetch recent activity
            try {
                const activityResp = await fetch(`${apiBase}/dashboard/creative/recent-activity`, {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    return (
        <ProtectedRoute requiredRole="creative">
            <SimplifiedLayout userType="creative">
                <main className="container mx-auto px-4 py-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back!</h1>
                        <p className="text-neutral-600">Find gigs and manage your creative work from this dashboard.</p>
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
                        {/* Recent Applications */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Recent Applications</h2>
                                    <Link href="/applications">
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentApplications.map((application: any) => (
                                        <div key={application.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                                                        {typeof application.gig === 'object' && application.gig !== null
                                                            ? (application.gig as any).title || 'Untitled Gig'
                                                            : 'Gig'}
                                                    </h3>
                                                    {typeof application.gig === 'object' && application.gig !== null && (application.gig as any).client?.company_name && (
                                                        <p className="text-neutral-600 text-sm mb-2">
                                                            {(application.gig as any).client.company_name}
                                                        </p>
                                                    )}
                                                    <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                                                        {application.cover_letter}
                                                    </p>
                                                    <div className="flex items-center text-sm text-neutral-500">
                                                        <span>Applied {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Unknown date'}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>
                                                            Proposed: ${application.proposed_budget} in {application.proposed_timeline_weeks} weeks
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                    {application.status}
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                <Link href={`/gigs/${typeof application.gig === 'object' && application.gig !== null ? application.gig.id : application.gig || ''}`} className="text-beacon-purple hover:underline text-sm font-medium">
                                                    View Gig Details
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
                                    <Link href="/gigs" className="block w-full">
                                        <Button variant="primary" fullWidth>Browse Gigs</Button>
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