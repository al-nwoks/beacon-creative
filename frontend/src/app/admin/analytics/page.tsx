import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { BarChart3, Briefcase, Users } from 'lucide-react'
import type { Metadata } from 'next'

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

    let userGrowthData: { date: string; count: number }[] = []
    let projectGrowthData: { date: string; count: number }[] = []
    let paymentData: { date: string; amount: number }[] = []

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            // Fetch platform stats
            const statsResp = await fetch(`${apiBase}/admin/stats`, {
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
                    stats = statsData
                }
            }

            // TODO: Fetch analytics data for charts
            // For now, we'll use mock data for the charts
            const today = new Date()
            userGrowthData = Array.from({ length: 30 }, (_, i) => {
                const date = new Date(today)
                date.setDate(date.getDate() - (29 - i))
                const dateStr = date.toISOString().split('T')[0]
                return {
                    date: dateStr || '',
                    count: Math.floor(Math.random() * 100) + 50
                }
            })

            projectGrowthData = Array.from({ length: 30 }, (_, i) => {
                const date = new Date(today)
                date.setDate(date.getDate() - (29 - i))
                const dateStr = date.toISOString().split('T')[0]
                return {
                    date: dateStr || '',
                    count: Math.floor(Math.random() * 50) + 20
                }
            })

            paymentData = Array.from({ length: 30 }, (_, i) => {
                const date = new Date(today)
                date.setDate(date.getDate() - (29 - i))
                const dateStr = date.toISOString().split('T')[0]
                return {
                    date: dateStr || '',
                    amount: Math.floor(Math.random() * 10000) + 1000
                }
            })
        }
    } catch (err) {
        console.error('Failed to fetch analytics data', err)
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Platform Analytics</h1>
                        <div className="flex space-x-2">
                            <select className="rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                            </select>
                            <Button variant="outline">Export Data</Button>
                        </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600">Total Users</p>
                                    <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total_users}</p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600">Total Creatives</p>
                                    <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.creatives}</p>
                                </div>
                                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600">Total Clients</p>
                                    <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.clients}</p>
                                </div>
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-600">Total Admins</p>
                                    <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.admins}</p>
                                </div>
                                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                                    <BarChart3 className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* User Growth Chart */}
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">User Growth</h2>
                            <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                                <p className="text-neutral-500">User growth chart visualization would go here</p>
                            </div>
                        </div>

                        {/* Project Growth Chart */}
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Project Growth</h2>
                            <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                                <p className="text-neutral-500">Project growth chart visualization would go here</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Analytics */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Payment Analytics</h2>
                        <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
                            <p className="text-neutral-500">Payment analytics chart visualization would go here</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Platform Activity</h2>
                        <div className="space-y-4">
                            <div className="border border-neutral-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-neutral-900">New user registered</h3>
                                        <p className="text-sm text-neutral-600">Creative user Jane Smith joined the platform</p>
                                    </div>
                                    <span className="text-sm text-neutral-500">2 hours ago</span>
                                </div>
                            </div>

                            <div className="border border-neutral-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-neutral-900">Project posted</h3>
                                        <p className="text-sm text-neutral-600">Client Company XYZ posted a new project</p>
                                    </div>
                                    <span className="text-sm text-neutral-500">5 hours ago</span>
                                </div>
                            </div>

                            <div className="border border-neutral-200 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium text-neutral-900">Payment released</h3>
                                        <p className="text-sm text-neutral-600">Payment of $3,000 released to creative</p>
                                    </div>
                                    <span className="text-sm text-neutral-500">1 day ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}