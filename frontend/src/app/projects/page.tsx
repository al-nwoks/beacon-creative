'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Briefcase, Clock, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

interface Project {
    id: string
    title: string
    description: string
    category: string
    status: 'draft' | 'active' | 'completed' | 'cancelled'
    budgetMin?: number
    budgetMax?: number
    createdAt: string
    deadline?: string
    applicationsCount: number
    client: {
        id: string
        name: string
    }
    requiredSkills?: string[]
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterCategory, setFilterCategory] = useState('all')

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true)
            // Mock data for demonstration
            const mockProjects: Project[] = [
                {
                    id: '1',
                    title: 'Fashion Editorial Photography',
                    description: 'Need a photographer for a fashion editorial shoot with 10+ outfit changes and multiple locations. Looking for someone with experience in high-fashion photography.',
                    category: 'Photography',
                    status: 'active',
                    budgetMin: 1500,
                    budgetMax: 2500,
                    createdAt: '2023-06-10T14:30:00Z',
                    deadline: '2023-07-15T00:00:00Z',
                    applicationsCount: 12,
                    client: {
                        id: '101',
                        name: 'Sarah Johnson'
                    },
                    requiredSkills: ['Fashion Photography', 'Portrait', 'Lighting']
                },
                {
                    id: '2',
                    title: 'Brand Identity Design',
                    description: 'Looking for a creative director to develop a complete brand identity for our tech startup. Need logo design, color palette, typography, and brand guidelines.',
                    category: 'Design',
                    status: 'active',
                    budgetMin: 3000,
                    budgetMax: 5000,
                    createdAt: '2023-06-05T09:15:00Z',
                    deadline: '2023-07-20T00:00:00Z',
                    applicationsCount: 8,
                    client: {
                        id: '102',
                        name: 'Michael Chen'
                    },
                    requiredSkills: ['Brand Identity', 'Logo Design', 'Typography']
                },
                {
                    id: '3',
                    title: 'Website Copywriting',
                    description: 'Need compelling copy for our SaaS platform website and marketing materials. Looking for someone with experience in tech and SaaS copywriting.',
                    category: 'Writing',
                    status: 'active',
                    budgetMin: 1000,
                    budgetMax: 1500,
                    createdAt: '2023-05-15T16:45:00Z',
                    deadline: '2023-06-30T00:00:00Z',
                    applicationsCount: 5,
                    client: {
                        id: '103',
                        name: 'Emma Rodriguez'
                    },
                    requiredSkills: ['Copywriting', 'SaaS', 'Tech']
                },
                {
                    id: '4',
                    title: 'Product Video Animation',
                    description: 'Create an animated explainer video for our new product launch. Need motion graphics and animation skills.',
                    category: 'Video',
                    status: 'active',
                    budgetMin: 2000,
                    budgetMax: 3500,
                    createdAt: '2023-06-12T11:20:00Z',
                    deadline: '2023-07-25T00:00:00Z',
                    applicationsCount: 3,
                    client: {
                        id: '104',
                        name: 'David Kim'
                    },
                    requiredSkills: ['Animation', 'Motion Graphics', 'Video Editing']
                },
                {
                    id: '5',
                    title: 'Social Media Content Creation',
                    description: 'Looking for a content creator to manage our Instagram and TikTok accounts for 3 months. Need someone who can create engaging content and grow our audience.',
                    category: 'Marketing',
                    status: 'active',
                    budgetMin: 800,
                    budgetMax: 1200,
                    createdAt: '2023-06-08T14:30:00Z',
                    deadline: '2023-09-08T00:00:00Z',
                    applicationsCount: 15,
                    client: {
                        id: '105',
                        name: 'Lisa Thompson'
                    },
                    requiredSkills: ['Social Media', 'Content Creation', 'Photography']
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


    const getStatusInfo = (status: Project['status']) => {
        switch (status) {
            case 'draft':
                return {
                    text: 'Draft',
                    icon: <Clock className="h-4 w-4" />,
                    color: 'text-gray-600 bg-gray-100'
                }
            case 'active':
                return {
                    text: 'Active',
                    icon: <Briefcase className="h-4 w-4" />,
                    color: 'text-green-600 bg-green-100'
                }
            case 'completed':
                return {
                    text: 'Completed',
                    icon: <Briefcase className="h-4 w-4" />,
                    color: 'text-blue-600 bg-blue-100'
                }
            case 'cancelled':
                return {
                    text: 'Cancelled',
                    icon: <Clock className="h-4 w-4" />,
                    color: 'text-red-600 bg-red-100'
                }
            default:
                return {
                    text: status,
                    icon: null,
                    color: 'text-gray-600 bg-gray-100'
                }
        }
    }

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = filterStatus === 'all' || project.status === filterStatus
        const matchesCategory = filterCategory === 'all' || project.category === filterCategory

        return matchesSearch && matchesStatus && matchesCategory
    })

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search projects...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading projects..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search projects...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Projects</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={loadProjects}>
                                Try Again
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search projects...">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Projects</h1>
                        <p className="text-neutral-600 mt-2">
                            Find exciting creative opportunities
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Link href="/projects/new">
                            <Button variant="primary">
                                <Plus className="h-4 w-4 mr-2" />
                                Post a Project
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search projects..."
                                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            >
                                <option value="all">All Categories</option>
                                <option value="Design">Design</option>
                                <option value="Photography">Photography</option>
                                <option value="Writing">Writing</option>
                                <option value="Video">Video</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                    </div>
                </div>

                <ErrorBoundary>
                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => {
                                const statusInfo = getStatusInfo(project.status)

                                return (
                                    <div key={project.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-beacon-purple-light/20 text-beacon-purple">
                                                        {project.category}
                                                    </span>
                                                </div>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                    {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
                                                    {statusInfo.text}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                                                {project.title}
                                            </h3>

                                            <p className="text-neutral-700 text-sm mb-4 line-clamp-3">
                                                {project.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {project.requiredSkills?.slice(0, 3).map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {project.requiredSkills && project.requiredSkills.length > 3 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                        +{project.requiredSkills.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                                                <div>
                                                    <p>Client: {project.client.name}</p>
                                                    <p className="mt-1">
                                                        Posted: {formatDate(project.createdAt, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                {project.budgetMin && project.budgetMax && (
                                                    <div className="text-right">
                                                        <p className="font-medium text-neutral-900">
                                                            {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                                                        </p>
                                                        <p>Budget</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-sm text-neutral-600">
                                                    <Briefcase className="h-4 w-4 mr-1" />
                                                    <span>{project.applicationsCount} applications</span>
                                                </div>
                                                <Link href={`/projects/${project.id}`}>
                                                    <Button variant="primary" size="sm">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Briefcase className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Projects Found</h3>
                            <p className="text-neutral-600 mb-6">
                                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'There are currently no projects available.'}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3">
                                <Button variant="primary" onClick={() => {
                                    setSearchQuery('')
                                    setFilterStatus('all')
                                    setFilterCategory('all')
                                }}>
                                    Clear Filters
                                </Button>
                                <Link href="/projects/new">
                                    <Button variant="outline">
                                        Post a Project
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </SimplifiedLayout>
    )
}