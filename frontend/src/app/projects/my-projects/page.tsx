import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Project } from '@/types/api'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'My Projects | B3ACON Creative Connect',
    description: 'View and manage your projects.',
}

export default async function MyProjectsPage() {
    let projects: Project[] = []

    try {
        // Fetch client's projects directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            const projectsResp = await fetch(`${apiBase}/projects/my-projects`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (projectsResp.ok) {
                const data = await projectsResp.json()
                if (Array.isArray(data)) {
                    projects = data as Project[]
                }
            }
        }
    } catch (err) {
        console.error('Failed to fetch projects', err)
    }

    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">My Projects</h1>
                        <Link href="/projects/create">
                            <Button variant="primary">Create New Project</Button>
                        </Link>
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                    <h2 className="text-xl font-semibold text-neutral-900 mb-2">{project.title}</h2>
                                    <p className="text-neutral-600 mb-4 line-clamp-3">{project.description}</p>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-neutral-500">
                                            {project.budget_min && project.budget_max
                                                ? `$${project.budget_min} - $${project.budget_max}`
                                                : 'Budget not specified'}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {project.status || 'active'}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-neutral-500">
                                            Created {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown date'}
                                        </span>
                                        <Link href={`/projects/${project.id}`} className="text-beacon-purple hover:underline text-sm font-medium">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No projects yet</h2>
                            <p className="text-neutral-600 mb-6">Get started by creating your first project.</p>
                            <Link href="/projects/create">
                                <Button variant="primary">Create New Project</Button>
                            </Link>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}