import ProtectedRoute from '@/components/auth/ProtectedRoute'
import JobCard from '@/components/dashboard/JobCard'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { CheckCircle, DollarSign, FileText, MessageSquare, Search, Star, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Creative Dashboard | B3ACON Creative Connect',
    description: 'Find projects, manage applications, and grow your creative career.',
}

export default async function CreativeDashboardPage() {
    // Read token from HttpOnly cookie on the server
    const token = (await cookies()).get('access_token')?.value

    // Compose internal backend base and ensure /api/v1
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000').replace(/\/+$/, '')
    const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

    // Fetch current user to tailor UI; do not cache to keep it fresh
    const meResp = await fetch(`${apiBase}/users/me`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store',
    })

    const isAuthed = meResp.ok
    const me = isAuthed ? await meResp.json() : null

    // Mock data - replace with real API calls
    const stats = [
        { label: 'Active Applications', value: '8', icon: FileText, color: 'text-blue-600' },
        { label: 'Earnings This Month', value: '$3,200', icon: DollarSign, color: 'text-green-600' },
        { label: 'Projects Completed', value: '12', icon: CheckCircle, color: 'text-purple-600' },
        { label: 'New Messages', value: '5', icon: MessageSquare, color: 'text-orange-600' },
    ]

    const availableProjects = [
        {
            id: '1',
            title: 'E-commerce Website Design',
            company: 'TechStart Inc.',
            description: 'Design a modern, responsive e-commerce website with clean UI/UX. Need someone experienced with Figma and user experience principles.',
            budget_min: 3000,
            budget_max: 5000,
            timeline_weeks: 4,
            required_skills: ['UI/UX Design', 'Figma', 'E-commerce'],
            created_at: '2024-01-20T08:00:00Z',
        },
        {
            id: '2',
            title: 'Brand Identity Package',
            company: 'Green Earth Co.',
            description: 'Complete brand identity including logo, color palette, typography, and brand guidelines for sustainable products company.',
            budget_min: 2000,
            budget_max: 3500,
            timeline_weeks: 3,
            required_skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator'],
            created_at: '2024-01-18T08:00:00Z',
        },
        {
            id: '3',
            title: 'Mobile App UI Design',
            company: 'FitLife App',
            description: 'Design intuitive and engaging UI for fitness tracking mobile app. Experience with mobile design patterns required.',
            budget_min: 4000,
            budget_max: 6000,
            timeline_weeks: 5,
            required_skills: ['Mobile Design', 'UI/UX', 'Sketch', 'Prototyping'],
            created_at: '2024-01-16T08:00:00Z',
        },
    ]

    const myApplications = [
        { project: 'Website Redesign', status: 'Under Review', applied: '3 days ago', statusColor: 'text-yellow-600' },
        { project: 'Logo Design', status: 'Accepted', applied: '1 week ago', statusColor: 'text-green-600' },
        { project: 'Mobile App UI', status: 'Rejected', applied: '2 weeks ago', statusColor: 'text-red-600' },
        { project: 'Brand Guidelines', status: 'In Progress', applied: '3 weeks ago', statusColor: 'text-blue-600' },
    ]

    const recentActivity = [
        { action: 'Application accepted', project: 'Logo Design Project', time: '2 hours ago' },
        { action: 'New message from client', project: 'Website Redesign', time: '4 hours ago' },
        { action: 'Payment received', project: 'Brand Identity', time: '1 day ago' },
        { action: 'Project milestone completed', project: 'Mobile App UI', time: '2 days ago' },
    ]

    return (
        <ProtectedRoute requiredRole="creative">
            <SimplifiedLayout userType="creative" showSearch={false}>

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
                        {/* Available Projects */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Recommended Projects</h2>
                                    <Link href="/projects">
                                        <Button variant="outline" size="sm">Browse All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {availableProjects.map((project) => (
                                        <JobCard
                                            key={project.id}
                                            {...project}
                                            showApplyButton={true}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link href="/projects" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Search className="h-4 w-4" />
                                            Find Projects
                                        </Button>
                                    </Link>
                                    <Link href="/applications" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <FileText className="h-4 w-4" />
                                            My Applications
                                        </Button>
                                    </Link>
                                    <Link href="/messages" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <MessageSquare className="h-4 w-4" />
                                            Messages
                                        </Button>
                                    </Link>
                                    <Link href="/profile" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Star className="h-4 w-4" />
                                            Update Profile
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* My Applications Status */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Application Status</h3>
                                <div className="space-y-4">
                                    {myApplications.map((app, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{app.project}</p>
                                                <p className="text-xs text-neutral-500">{app.applied}</p>
                                            </div>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${app.statusColor} bg-opacity-10`}>
                                                {app.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/applications" className="block mt-4">
                                    <Button variant="outline" size="sm" fullWidth>View All Applications</Button>
                                </Link>
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
                                        <span className="text-purple-100">Applications Sent</span>
                                        <span className="font-semibold">12</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-100">Projects Won</span>
                                        <span className="font-semibold">3</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-100">Earnings</span>
                                        <span className="font-semibold">$3,200</span>
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