'use client'

import { MainLayout } from '@/components/layout'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { Briefcase, Calendar, DollarSign, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface Project {
    id: string
    title: string
    description: string
    status: string
    budget_min?: number
    budget_max?: number
    created_at: string
    deadline?: string
    applications_count: number
}

export default function ClientDashboardPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true)
            // Mock data for demonstration
            const mockProjects: Project[] = [
                {
                    id: '1',
                    title: 'Brand Identity Design',
                    description: 'Create a complete brand identity for a new tech startup including logo, color palette, and brand guidelines.',
                    status: 'active',
                    budget_min: 2000,
                    budget_max: 3500,
                    created_at: '2023-06-15T10:30:00Z',
                    deadline: '2023-07-30T00:00:00Z',
                    applications_count: 8
                },
                {
                    id: '2',
                    title: 'Website Redesign',
                    description: 'Redesign our company website with a modern, responsive design and improved user experience.',
                    status: 'hired',
                    budget_min: 5000,
                    budget_max: 8000,
                    created_at: '2023-06-10T14:20:00Z',
                    deadline: '2023-08-15T00:00:00Z',
                    applications_count: 1
                },
                {
                    id: '3',
                    title: 'Social Media Content',
                    description: 'Create monthly social media content for our fashion brand including images and captions.',
                    status: 'completed',
                    budget_min: 1500,
                    budget_max: 2500,
                    created_at: '2023-05-20T09:15:00Z',
                    deadline: '2023-06-20T00:00:00Z',
                    applications_count: 5
                }
            ]
            setProjects(mockProjects)
        } catch (err) {
            console.error('Error loading projects:', err)
            setError('Failed to load projects. Please try again.')
            showNotification('Failed to load projects', 'error')
        } finally {
            setLoading(false)
        }
    }, [showNotification])

    useEffect(() => {
        loadProjects()
    }, [loadProjects])


    if (loading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading dashboard..." />
                    </div>
                </div>
            </MainLayout>
        )
    }

    if (error) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={loadProjects}
                                className="px-4 py-2 bg-beacon-purple text-white rounded-md hover:bg-beacon-purple-dark transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </ErrorBoundary>
                </div>
            </MainLayout>
        )
    }

    // Calculate stats
    const activeProjects = projects.filter(p => p.status === 'active').length
    const totalBudget = projects.reduce((sum, project) => sum + (project.budget_max || 0), 0)
    const totalApplications = projects.reduce((sum, project) => sum + project.applications_count, 0)

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Client Dashboard</h1>
                    <p className="text-neutral-600">Manage your projects and connect with creative talent.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border border-neutral-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-neutral-600">Total Projects</p>
                                <p className="text-2xl font-bold text-neutral-900">{projects.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-neutral-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-neutral-600">Active Projects</p>
                                <p className="text-2xl font-bold text-neutral-900">{activeProjects}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-neutral-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-neutral-600">Total Budget</p>
                                <p className="text-2xl font-bold text-neutral-900">${totalBudget.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-neutral-200">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-neutral-600">Applications</p>
                                <p className="text-2xl font-bold text-neutral-900">{totalApplications}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Projects Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">Your Projects</h2>
                        <button className="px-4 py-2 bg-beacon-purple text-white rounded-md hover:bg-beacon-purple-dark transition-colors">
                            Create New Project
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg shadow p-6 border border-neutral-200 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">{project.title}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                            project.status === 'hired' ? 'bg-blue-100 text-blue-800' :
                                                project.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        {project.budget_min && project.budget_max && (
                                            <p className="text-sm font-medium text-neutral-900">
                                                ${project.budget_min.toLocaleString()} - ${project.budget_max.toLocaleString()}
                                            </p>
                                        )}
                                        <p className="text-xs text-neutral-500">
                                            Created: {new Date(project.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-neutral-700 mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-sm text-neutral-600">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>{project.applications_count} applications</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-sm text-beacon-purple hover:underline">
                                            View Details
                                        </button>
                                        <button className="text-sm text-neutral-600 hover:text-neutral-900">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow p-6 border border-neutral-200">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex flex-col items-center justify-center p-6 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                            <Briefcase className="h-8 w-8 text-beacon-purple mb-2" />
                            <span className="font-medium text-neutral-900">Post a Project</span>
                            <p className="text-sm text-neutral-600 mt-1 text-center">Find creative talent for your next project</p>
                        </button>

                        <button className="flex flex-col items-center justify-center p-6 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                            <Users className="h-8 w-8 text-beacon-purple mb-2" />
                            <span className="font-medium text-neutral-900">Browse Talent</span>
                            <p className="text-sm text-neutral-600 mt-1 text-center">Discover creative professionals</p>
                        </button>

                        <button className="flex flex-col items-center justify-center p-6 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                            <Calendar className="h-8 w-8 text-beacon-purple mb-2" />
                            <span className="font-medium text-neutral-900">View Calendar</span>
                            <p className="text-sm text-neutral-600 mt-1 text-center">Manage project deadlines</p>
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}