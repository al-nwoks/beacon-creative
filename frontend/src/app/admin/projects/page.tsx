import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Project } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Manage Projects | B3ACON Admin',
    description: 'View and manage platform projects.',
}

export default function AdminProjectsPage() {
    // Mock data for projects
    const projects: Project[] = [
        {
            id: 1,
            title: 'Website Redesign',
            description: 'Redesign company website to improve user experience',
            budget_min: 3000,
            budget_max: 5000,
            timeline_weeks: 4,
            required_skills: ['UI/UX', 'React'],
            created_at: '2023-06-15T10:30:00Z',
            status: 'active',
        },
        {
            id: 2,
            title: 'Mobile App Development',
            description: 'Develop cross-platform mobile app for fitness tracking',
            budget_min: 8000,
            budget_max: 12000,
            timeline_weeks: 12,
            required_skills: ['React Native', 'Firebase'],
            created_at: '2023-06-20T14:45:00Z',
            status: 'hired',
        },
        {
            id: 3,
            title: 'Brand Identity',
            description: 'Create complete brand identity package',
            budget_min: 2000,
            budget_max: 3500,
            timeline_weeks: 3,
            required_skills: ['Logo Design', 'Illustration'],
            created_at: '2023-06-25T09:15:00Z',
            status: 'completed',
        },
        {
            id: 4,
            title: 'Content Marketing',
            description: 'Develop content marketing strategy',
            budget_min: 1500,
            budget_max: 2500,
            timeline_weeks: 6,
            required_skills: ['SEO', 'Copywriting'],
            created_at: '2023-07-01T16:20:00Z',
            status: 'active',
        },
    ]

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search projects...">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Manage Projects</h1>
                        <button className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                            Add New Project
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        <div className="divide-y divide-neutral-200">
                            {projects.map((project) => (
                                <div key={project.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-neutral-900">{project.title}</h2>
                                            <p className="text-neutral-600 line-clamp-2">{project.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-sm text-neutral-500">
                                                {project.budget_min && project.budget_max
                                                    ? `$${project.budget_min} - $${project.budget_max}`
                                                    : 'Budget not specified'}
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    project.status === 'hired' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {project.status || 'active'}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button className="text-beacon-purple hover:underline text-sm font-medium">
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:underline text-sm font-medium">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-3 text-sm text-neutral-500">
                                        <span className="mr-4">
                                            Posted {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown date'}
                                        </span>
                                        <span>
                                            Timeline: {project.timeline_weeks || 'N/A'} weeks
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 rounded-md bg-beacon-purple text-white text-sm font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                2
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                3
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Next
                            </button>
                        </nav>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}