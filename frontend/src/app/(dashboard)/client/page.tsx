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
    // Mock data for dashboard
    const stats = [
        { label: 'Active Gigs', value: '3', change: '+2 from last month' },
        { label: 'Total Spent', value: '$12,450', change: '+15% from last month' },
        { label: 'Applications', value: '24', change: '+8 from last week' },
        { label: 'Active Creatives', value: '7', change: '+2 from last month' },
    ]

    const recentGigs: Gig[] = [
        {
            id: '1',
            title: 'Brand Photography for Fashion Startup',
            description: 'High-quality product photography for fashion line',
            budget_min: 1500,
            budget_max: 2500,
            timeline_weeks: 4,
            required_skills: ['Photography', 'Fashion', 'Lighting'],
            created_at: '2023-06-15T10:30:00Z',
            status: 'active'
        },
        {
            id: '2',
            title: 'UI/UX Design for Mobile App',
            description: 'Design a complete user interface for fitness tracking app',
            budget_min: 3000,
            budget_max: 5000,
            timeline_weeks: 6,
            required_skills: ['UI/UX Design', 'Figma', 'Mobile Design'],
            created_at: '2023-06-10T09:15:00Z',
            status: 'active'
        },
        {
            id: '3',
            title: 'Content Writing for Tech Blog',
            description: 'Technical writing for technology blog',
            budget_min: 500,
            budget_max: 1000,
            timeline_weeks: 2,
            required_skills: ['Technical Writing', 'SEO', 'Tech'],
            created_at: '2023-06-05T16:20:00Z',
            status: 'completed'
        }
    ]

    const recentActivity = [
        { action: 'New application received', gig: 'Brand Photography', time: '2 hours ago' },
        { action: 'Payment released', gig: 'UI/UX Design', time: '1 day ago' },
        { action: 'Gig completed', gig: 'Content Writing', time: '2 days ago' },
        { action: 'New application received', gig: 'Brand Photography', time: '3 days ago' },
    ]

    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client">
                <main className="container mx-auto px-4 py-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back!</h1>
                        <p className="text-neutral-600">Manage your gigs and creative projects from this dashboard.</p>
                    </div>

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