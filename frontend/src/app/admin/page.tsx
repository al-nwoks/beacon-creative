import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Gig, User } from '@/types/api'
import { BarChart3, Briefcase, Users, Wallet } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Admin Dashboard | B3ACON Creative Connect',
    description: 'Administrator dashboard.',
}

export default async function AdminPage() {
    // Server-side initial data fetch (hybrid approach)
    let stats = [
        { label: 'Total Users', value: '0', icon: Users, color: 'text-beacon-blue' },
        { label: 'Active Gigs', value: '0', icon: Briefcase, color: 'text-beacon-green' },
        { label: 'Total Payments', value: '0', icon: Wallet, color: 'text-beacon-purple' },
        { label: 'Platform Analytics', value: '0', icon: BarChart3, color: 'text-beacon-orange' },
    ]

    let recentUsers: User[] = []
    let recentGigs: Gig[] = []

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            // Fetch all data in parallel using admin endpoints
            const [statsResp, usersResp, gigsResp] = await Promise.allSettled([
                fetch(`${apiBase}/admin/stats`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/admin/users?limit=6`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/admin/gigs?limit=6`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
            ])

            // Update stats with real data
            if (statsResp.status === 'fulfilled' && statsResp.value.ok) {
                const statsData = await statsResp.value.json()
                if (statsData) {
                    if (stats[0]) stats[0].value = String(statsData.total_users || 0)
                    // For gigs count, we'll use the count from the gigs response
                    // We'll update payments count later
                }
            }

            if (usersResp.status === 'fulfilled' && usersResp.value.ok) {
                const usersData = await usersResp.value.json()
                if (Array.isArray(usersData)) {
                    recentUsers = usersData as User[]
                }
            }

            if (gigsResp.status === 'fulfilled' && gigsResp.value.ok) {
                const gigsData = await gigsResp.value.json()
                if (Array.isArray(gigsData)) {
                    recentGigs = gigsData as Gig[]
                    // Update stats with gigs count
                    if (stats[1]) stats[1].value = String(gigsData.length)
                }
            }

            // Try to fetch payments count
            try {
                const paymentsResp = await fetch(`${apiBase}/admin/payments?limit=1`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                })

                if (paymentsResp.ok) {
                    // Get total count from headers or by parsing the response
                    const paymentsData = await paymentsResp.json()
                    if (Array.isArray(paymentsData) && stats[2]) {
                        stats[2].value = String(paymentsData.length)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch payments count', err)
            }
        }
    } catch (err) {
        // Log on server; page will render with fallback/mock data
        console.error('Initial dashboard fetch failed', err)
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
                        <p className="text-neutral-600">Manage the platform from this admin dashboard.</p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-neutral-600">{stat.label}</p>
                                        <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full bg-neutral-100 ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Users */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Recent Users</h2>
                                    <Link href="/admin/users">
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentUsers.length > 0 ? (
                                        recentUsers.map((user) => (
                                            <div key={user.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">{user.name || `${user.first_name} ${user.last_name}` || 'Unnamed User'}</h3>
                                                        <p className="text-neutral-600 text-sm mb-1">{user.email}</p>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {user.role || 'user'}
                                                            </span>
                                                            <span className="text-xs text-neutral-500">
                                                                Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown date'}
                                                            </span>
                                                        </div>
                                                        {user.location && (
                                                            <p className="text-xs text-neutral-500 mt-1">
                                                                {user.location}
                                                            </p>
                                                        )}
                                                        {user.bio && (
                                                            <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                                                                {user.bio}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-600">No recent users found.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link href="/admin/users" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Users className="h-4 w-4" />
                                            Manage Users
                                        </Button>
                                    </Link>
                                    <Link href="/admin/gigs" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Briefcase className="h-4 w-4" />
                                            Manage Gigs
                                        </Button>
                                    </Link>
                                    <Link href="/admin/payments" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Wallet className="h-4 w-4" />
                                            View Payments
                                        </Button>
                                    </Link>
                                    <Link href="/admin/analytics" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <BarChart3 className="h-4 w-4" />
                                            Platform Analytics
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Gigs */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Gigs</h3>
                                <div className="space-y-4">
                                    {recentGigs.length > 0 ? (
                                        recentGigs.map((gig) => (
                                            <div key={gig.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{gig.title ?? 'Untitled gig'}</h3>
                                                <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{gig.description ?? ''}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-neutral-500">
                                                        {gig.budget_min && gig.budget_max
                                                            ? `$${gig.budget_min} - $${gig.budget_max}`
                                                            : 'Budget not specified'}
                                                    </span>
                                                    <Link href={`/admin/gigs/${gig.id}`} className="text-beacon-purple hover:underline text-sm font-medium">
                                                        View Details
                                                    </Link>
                                                </div>
                                                {gig.status && (
                                                    <div className="mt-2">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {gig.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-600">No recent gigs found.</p>
                                    )}
                                </div>
                                <Link href="/admin/gigs" className="block mt-4">
                                    <Button variant="outline" size="sm" fullWidth>View All Gigs</Button>
                                </Link>
                            </div>

                            {/* Settings */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Platform Settings</h3>
                                <div className="space-y-3">
                                    <Link href="/admin/settings" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <span className="text-sm font-medium">General Settings</span>
                                        </Button>
                                    </Link>
                                    <Link href="/admin/categories" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <span className="text-sm font-medium">Gig Categories</span>
                                        </Button>
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