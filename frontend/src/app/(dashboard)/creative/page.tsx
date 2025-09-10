import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Application } from '@/types/api'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Creative Dashboard | B3ACON Creative Connect',
    description: 'Find gigs and manage your creative work.',
}

export default async function CreativeDashboardPage() {
    // Mock data for dashboard
    const stats = [
        { label: 'Active Applications', value: '5', change: '+2 from last week' },
        { label: 'Total Earned', value: '$8,250', change: '+12% from last month' },
        { label: 'Completed Gigs', value: '12', change: '+3 from last month' },
        { label: 'Success Rate', value: '85%', change: '+5% from last month' },
    ]

    const recentApplications: Application[] = [
        {
            id: '1',
            gig: {
                id: '101',
                title: 'Brand Photography for Fashion Startup',
                description: 'High-quality product photography for fashion line',
                budget_min: 1500,
                budget_max: 2500,
                timeline_weeks: 4,
                required_skills: ['Photography', 'Fashion', 'Lighting'],
                created_at: '2023-06-15T10:30:00Z',
                status: 'active'
            },
            status: 'pending',
            applied_at: '2023-06-20T14:30:00Z',
            cover_letter: 'I have extensive experience in fashion photography and would love to work on this gig.',
            proposed_budget: 2000,
            proposed_timeline_weeks: 3
        },
        {
            id: '2',
            gig: {
                id: '102',
                title: 'UI/UX Design for Mobile App',
                description: 'Design a complete user interface for fitness tracking app',
                budget_min: 3000,
                budget_max: 5000,
                timeline_weeks: 6,
                required_skills: ['UI/UX Design', 'Figma', 'Mobile Design'],
                created_at: '2023-06-10T09:15:00Z',
                status: 'active'
            },
            status: 'accepted',
            applied_at: '2023-06-12T11:45:00Z',
            cover_letter: 'My portfolio includes several successful mobile app designs. I\'m confident I can deliver exceptional results for your gig.',
            proposed_budget: 4500,
            proposed_timeline_weeks: 5
        },
        {
            id: '3',
            gig: {
                id: '103',
                title: 'Content Writing for Tech Blog',
                description: 'Technical writing for technology blog',
                budget_min: 500,
                budget_max: 1000,
                timeline_weeks: 2,
                required_skills: ['Technical Writing', 'SEO', 'Tech'],
                created_at: '2023-06-05T16:20:00Z',
                status: 'completed'
            },
            status: 'rejected',
            applied_at: '2023-06-07T09:30:00Z',
            cover_letter: 'I specialize in technical content and have written for several tech publications.',
            proposed_budget: 750,
            proposed_timeline_weeks: 2
        }
    ]

    const recentActivity = [
        { action: 'Application accepted', gig: 'UI/UX Design', time: '1 day ago' },
        { action: 'New message received', gig: 'Brand Photography', time: '2 days ago' },
        { action: 'Payment received', gig: 'Content Writing', time: '3 days ago' },
        { action: 'Application submitted', gig: 'Brand Photography', time: '1 week ago' },
    ]

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
                                                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                                                        {typeof application.gig === 'object' && application.gig !== null
                                                            ? (application.gig as any).title || 'Untitled Gig'
                                                            : 'Gig'}
                                                    </h3>
                                                    <p className="text-neutral-600 text-sm mb-3">
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
                                                <Link href={`/gigs/${typeof application.gig === 'object' && application.gig !== null ? application.gig.id : ''}`} className="text-beacon-purple hover:underline text-sm font-medium">
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