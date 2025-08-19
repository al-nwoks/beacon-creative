import ProtectedRoute from '@/components/auth/ProtectedRoute'
import JobCard from '@/components/dashboard/JobCard'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { serverFetch } from '@/lib/api'
import type { MessageSummary, Project, User } from '@/types/api'
import { Briefcase, DollarSign, MessageSquare, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Creative Dashboard | B3ACON Creative Connect',
    description: 'Manage your profile, projects, and applications.',
}

export default async function CreativeDashboardPage() {
    // Server-side initial data fetch (hybrid approach)
    let user: User | null = null
    let stats = [
        { label: 'Active Applications', value: '0', icon: Briefcase, color: 'text-beacon-blue' },
        { label: 'Earnings', value: '$0', icon: DollarSign, color: 'text-beacon-green' },
        { label: 'Completed Projects', value: '0', icon: Users, color: 'text-beacon-purple' },
        { label: 'Messages', value: '0', icon: MessageSquare, color: 'text-beacon-orange' },
    ]

    let recentProjects: Project[] = []
    let recentMessages: MessageSummary[] = []

    try {
        // Use serverFetch which centralizes API base handling
        const [userResp, projectsResp, appsResp, messagesResp, paymentsResp] = await Promise.allSettled([
            serverFetch('/users/me'),
            serverFetch('/projects?limit=6'),
            serverFetch('/applications/me?limit=6&status=accepted'),
            serverFetch('/messages/conversations?limit=6'),
            serverFetch('/payments/me'),
        ])

        if (userResp.status === 'fulfilled') {
            user = userResp.value as User
        }

        if (projectsResp.status === 'fulfilled' && Array.isArray(projectsResp.value)) {
            recentProjects = projectsResp.value as Project[]
        }

        if (appsResp.status === 'fulfilled' && Array.isArray(appsResp.value)) {
            const apps = appsResp.value as any[]
            const appsCount = apps.length
            if (stats[0]) stats[0].value = String(appsCount)

            // Calculate completed projects from accepted applications
            // For now, we'll assume all accepted applications are for completed projects
            // In a real implementation, we would check the project status
            const completedProjectsCount = apps.filter((app: any) => app.status === 'accepted').length
            if (stats[2]) stats[2].value = String(completedProjectsCount)
        }

        if (messagesResp.status === 'fulfilled' && Array.isArray(messagesResp.value)) {
            recentMessages = messagesResp.value as MessageSummary[]
            const messagesCount = recentMessages.length
            if (stats[3]) stats[3].value = String(messagesCount)
        }

        // Calculate earnings from payments
        if (paymentsResp.status === 'fulfilled' && Array.isArray(paymentsResp.value)) {
            const payments = paymentsResp.value as any[]
            const earnings = payments
                .filter((payment: any) => payment.status === 'released')
                .reduce((sum: number, payment: any) => sum + payment.amount, 0)
            if (stats[1]) stats[1].value = `$${earnings.toFixed(2)}`
        }
    } catch (err) {
        // Log on server; page will render with fallback/mock data
        console.error('Initial dashboard fetch failed', err)
    }

    return (
        <ProtectedRoute requiredRole="creative">
            <SimplifiedLayout userType="creative" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    {/* Welcome Banner (beacon purple gradient) */}
                    <div className="rounded-lg overflow-hidden mb-8 shadow-sm">
                        <div className="bg-gradient-to-r from-beacon-purple to-beacon-purple-dark p-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                                        Welcome to B3ACON
                                    </h1>
                                    <p className="text-beacon-purple-light max-w-xl">
                                        Connect with top creative talent and exciting opportunities worldwide.
                                    </p>
                                    {user?.created_at && (
                                        <p className="text-sm text-beacon-purple-light mt-3">
                                            Member since {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href="/profile">
                                        <Button className="bg-white text-beacon-purple hover:bg-neutral-100" size="md">
                                            Complete Your Profile
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="border-white text-white hidden md:inline-flex">
                                        <span className="mr-2">🔍</span> Filter
                                    </Button>
                                </div>
                            </div>
                        </div>
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
                        {/* Recent Projects */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Available Projects</h2>
                                    <Link href="/projects">
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentProjects.length > 0 ? (
                                        recentProjects.map((project) => {
                                            // cast to any to avoid strict backend Project differences and safely coerce fields
                                            const p: any = project as any
                                            return (
                                                <JobCard
                                                    key={String(p.id)}
                                                    id={String(p.id)}
                                                    title={p.title ?? 'Untitled project'}
                                                    company={p.client?.name ?? p.company ?? 'Client'}
                                                    description={p.description ?? ''}
                                                    location={p.location ?? p.city ?? ''}
                                                    budget_min={typeof p.budget_min === 'number' ? p.budget_min : undefined}
                                                    budget_max={typeof p.budget_max === 'number' ? p.budget_max : undefined}
                                                    required_skills={Array.isArray(p.skills) ? p.skills : (p.required_skills ?? [])}
                                                    deadline={p.deadline ?? undefined}
                                                    created_at={p.created_at ?? new Date().toISOString()}
                                                    showApplyButton={true}
                                                />
                                            )
                                        })
                                    ) : (
                                        <p className="text-neutral-600">No available projects at the moment.</p>
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
                                    <Link href="/projects" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Briefcase className="h-4 w-4" />
                                            Browse Projects
                                        </Button>
                                    </Link>
                                    <Link href="/applications" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Users className="h-4 w-4" />
                                            My Applications
                                        </Button>
                                    </Link>
                                    <Link href="/messages" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <MessageSquare className="h-4 w-4" />
                                            View Messages
                                        </Button>
                                    </Link>
                                    <Link href="/profile" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <DollarSign className="h-4 w-4" />
                                            Profile Settings
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Recent Messages */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Messages</h3>
                                <div className="space-y-4">
                                    {recentMessages.length > 0 ? (
                                        recentMessages.map((message) => (
                                            <div key={message.id} className="flex items-start space-x-3">
                                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-10 h-10 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">{message.name}</p>
                                                    <p className="text-sm text-neutral-600 truncate">{message.preview || 'No message preview'}</p>
                                                    <p className="text-xs text-neutral-500 mt-1">{message.time || 'Unknown time'}</p>
                                                </div>
                                                {message.unread && (
                                                    <div className="w-2 h-2 bg-beacon-purple rounded-full flex-shrink-0 mt-2"></div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-600">No recent messages.</p>
                                    )}
                                </div>
                                <Link href="/messages" className="block mt-4">
                                    <Button variant="outline" size="sm" fullWidth>View All Messages</Button>
                                </Link>
                            </div>

                            {/* Settings */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Settings</h3>
                                <div className="space-y-3">
                                    <Link href="/profile" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <span className="text-sm font-medium">Profile Settings</span>
                                        </Button>
                                    </Link>
                                    <Link href="/settings" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <span className="text-sm font-medium">Account Settings</span>
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