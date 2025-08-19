import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { serverFetch } from '@/lib/api'
import type { Project, User } from '@/types/api'
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
        { label: 'Active Projects', value: '0', icon: Briefcase, color: 'text-beacon-green' },
        { label: 'Total Payments', value: '0', icon: Wallet, color: 'text-beacon-purple' },
        { label: 'Platform Analytics', value: '0', icon: BarChart3, color: 'text-beacon-orange' },
    ]

    let recentUsers: User[] = []
    let recentProjects: Project[] = []

    try {
        // Use serverFetch which centralizes API base handling
        // Note: Admin endpoints would need to be implemented in the backend
        // For now, we'll use mock data or existing endpoints for demonstration
        const [usersResp, projectsResp] = await Promise.allSettled([
            serverFetch('/users?limit=6'), // This would need admin permissions
            serverFetch('/projects?limit=6'), // This would need admin permissions
        ])

        if (usersResp.status === 'fulfilled' && Array.isArray(usersResp.value)) {
            recentUsers = usersResp.value as User[]
            // Update stats with real data
            if (stats[0]) stats[0].value = String(recentUsers.length)
        }

        if (projectsResp.status === 'fulfilled' && Array.isArray(projectsResp.value)) {
            recentProjects = projectsResp.value as Project[]
            // Update stats with real data
            if (stats[1]) stats[1].value = String(recentProjects.length)
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
                                    <Link href="/admin/projects" className="block">
                                        <Button variant="outline" fullWidth className="justify-start gap-3">
                                            <Briefcase className="h-4 w-4" />
                                            Manage Projects
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

                            {/* Recent Projects */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Projects</h3>
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
                                                    <Link href={`/admin/projects/${project.id}`} className="text-beacon-purple hover:underline text-sm font-medium">
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
                                        <p className="text-neutral-600">No recent projects found.</p>
                                    )}
                                </div>
                                <Link href="/admin/projects" className="block mt-4">
                                    <Button variant="outline" size="sm" fullWidth>View All Projects</Button>
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
                                            <span className="text-sm font-medium">Project Categories</span>
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