import ProtectedRoute from '@/components/auth/ProtectedRoute'
import JobCard from '@/components/dashboard/JobCard'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { Briefcase, DollarSign, MessageSquare, PlusCircle, TrendingUp, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Dashboard | B3ACON Creative Connect',
    description: 'Manage your projects, track applications, and connect with creative talent.',
}

export default function ClientDashboardPage() {
    // Mock data - replace with real API calls
    const stats = [
        { label: 'Active Projects', value: '12', icon: Briefcase, color: 'text-blue-600' },
        { label: 'Total Spent', value: '$24,500', icon: DollarSign, color: 'text-green-600' },
        { label: 'Applications', value: '48', icon: Users, color: 'text-purple-600' },
        { label: 'Messages', value: '7', icon: MessageSquare, color: 'text-orange-600' },
    ]

    const recentProjects = [
        {
            id: '1',
            title: 'Brand Identity Design',
            company: 'Your Company',
            description: 'Complete brand identity package including logo, business cards, and style guide.',
            budget_min: 2000,
            budget_max: 4000,
            timeline_weeks: 3,
            required_skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator'],
            created_at: '2024-01-15T08:00:00Z',
        },
        {
            id: '2',
            title: 'Website Redesign',
            company: 'Your Company',
            description: 'Modern, responsive website redesign for e-commerce platform.',
            budget_min: 5000,
            budget_max: 8000,
            timeline_weeks: 6,
            required_skills: ['UI/UX Design', 'React', 'Figma'],
            created_at: '2024-01-10T08:00:00Z',
        },
    ]

    const recentActivity = [
        { action: 'New application received', project: 'Brand Identity Design', time: '2 hours ago' },
        { action: 'Message from Sarah M.', project: 'Website Redesign', time: '4 hours ago' },
        { action: 'Project milestone completed', project: 'Mobile App UI', time: '1 day ago' },
        { action: 'Payment released', project: 'Logo Design', time: '2 days ago' },
    ]

    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client" showSearch={false}>

                <main className="container mx-auto px-4 py-8">
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
                        {/* Recent Projects */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Your Recent Projects</h2>
                                    <Link href="/projects">
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <JobCard
                                            key={project.id}
                                            {...project}
                                            showApplyButton={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions & Activity */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link href="/projects/create" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <PlusCircle className="h-4 w-4" />
                                            Post New Project
                                        </Button>
                                    </Link>
                                    <Link href="/creatives" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Users className="h-4 w-4" />
                                            Browse Creatives
                                        </Button>
                                    </Link>
                                    <Link href="/messages" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <MessageSquare className="h-4 w-4" />
                                            View Messages
                                        </Button>
                                    </Link>
                                    <Link href="/payments" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <DollarSign className="h-4 w-4" />
                                            Manage Payments
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="w-2 h-2 bg-beacon-purple rounded-full mt-2 flex-shrink-0"></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900">{activity.action}</p>
                                                <p className="text-sm text-neutral-600">{activity.project}</p>
                                                <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Summary */}
                            <div className="bg-gradient-to-r from-beacon-purple to-beacon-purple-dark rounded-lg p-6 text-white">
                                <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp className="h-6 w-6" />
                                    <h3 className="text-lg font-semibold">This Month</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-purple-100">Projects Posted</span>
                                        <span className="font-semibold">3</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-100">Applications Received</span>
                                        <span className="font-semibold">24</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-100">Projects Completed</span>
                                        <span className="font-semibold">2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}