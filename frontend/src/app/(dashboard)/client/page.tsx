import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Application, MessageSummary, Project, User } from '@/types/api'
import { Briefcase, DollarSign, MessageSquare, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Client Dashboard | B3ACON Creative Connect',
    description: 'Manage your projects and connect with creative talent.',
}

export default async function ClientDashboardPage() {
    // Server-side initial data fetch (hybrid approach)
    let user: User | null = null
    let stats = [
        { label: 'Active Projects', value: '0', icon: Briefcase, color: 'text-beacon-blue' },
        { label: 'Total Spent', value: '$0', icon: DollarSign, color: 'text-beacon-green' },
        { label: 'Applications', value: '0', icon: Users, color: 'text-beacon-purple' },
        { label: 'Messages', value: '0', icon: MessageSquare, color: 'text-beacon-orange' },
    ]

    let recentProjects: Project[] = []
    let recentMessages: MessageSummary[] = []

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
            const [userResp, projectsResp, appsResp, messagesResp, paymentsResp] = await Promise.allSettled([
                fetch(`${apiBase}/users/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/projects/my-projects?limit=6`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/applications/project/me?limit=6`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/messages/conversations?limit=6`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
                fetch(`${apiBase}/payments/me`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    },
                    cache: 'no-store',
                }),
            ])

            if (userResp.status === 'fulfilled' && userResp.value.ok) {
                user = await userResp.value.json() as User
            }

            if (projectsResp.status === 'fulfilled' && projectsResp.value.ok) {
                const projectsData = await projectsResp.value.json()
                if (Array.isArray(projectsData)) {
                    recentProjects = projectsData as Project[]
                    // Update stats with real data
                    if (stats[0]) stats[0].value = String(recentProjects.length)
                }
            }

            if (appsResp.status === 'fulfilled' && appsResp.value.ok) {
                const appsData = await appsResp.value.json()
                if (Array.isArray(appsData)) {
                    const apps = appsData as Application[]
                    const appsCount = apps.length
                    if (stats[2]) stats[2].value = String(appsCount)
                }
            }

            if (messagesResp.status === 'fulfilled' && messagesResp.value.ok) {
                const messagesData = await messagesResp.value.json()
                if (Array.isArray(messagesData)) {
                    recentMessages = messagesData as MessageSummary[]
                    const messagesCount = recentMessages.length
                    if (stats[3]) stats[3].value = String(messagesCount)
                }
            }

            // Calculate total spent from payments
            if (paymentsResp.status === 'fulfilled' && paymentsResp.value.ok) {
                const paymentsData = await paymentsResp.value.json()
                if (Array.isArray(paymentsData)) {
                    const payments = paymentsData as any[]
                    const totalSpent = payments
                        .filter((payment: any) => payment.status === 'released')
                        .reduce((sum: number, payment: any) => sum + payment.amount, 0)
                    if (stats[1]) stats[1].value = `$${totalSpent.toFixed(2)}`
                }
            }
        }
    } catch (err) {
        // Log on server; page will render with fallback/mock data
        console.error('Initial dashboard fetch failed', err)
    }

    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                            Welcome, {user?.name || 'Client'}!
                        </h1>
                        <p className="text-neutral-600">
                            Manage your projects and connect with creative talent from this dashboard.
                        </p>
                        {user?.created_at && (
                            <p className="text-sm text-neutral-500 mt-2">
                                Member since {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        )}
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
                                    <h2 className="text-xl font-semibold text-neutral-900">Your Recent Projects</h2>
                                    <Link href="/projects">
                                        <Button variant="outline" size="sm">View All</Button>
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {recentProjects.length > 0 ? (
                                        recentProjects.map((project) => (
                                            <div key={project.id} className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{project.title ?? 'Untitled project'}</h3>
                                                <p className="text-neutral-600 text-sm mb-3 line-clamp-2">{project.description ?? ''}</p>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-neutral-500">
                                                        {project.budget_min && project.budget_max
                                                            ? `$${project.budget_min} - $${project.budget_max}`
                                                            : 'Budget not specified'}
                                                    </span>
                                                    <Link href={`/projects/${project.id}`} className="text-beacon-purple hover:underline text-sm font-medium">
                                                        View Details
                                                    </Link>
                                                </div>
                                                {project.status && (
                                                    <div className="mt-2">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {project.status}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-neutral-600">No projects yet. <Link href="/projects/create" className="text-beacon-purple hover:underline">Create your first project</Link>.</p>
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
                                    <Link href="/projects/create" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Briefcase className="h-4 w-4" />
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