'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Briefcase, Calendar, Clock, DollarSign, MapPin, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
    timelineWeeks?: number
    client: {
        id: string
        name: string
        email: string
        location?: string
    }
    requiredSkills?: string[]
    applicationsCount: number
}

interface ProjectDetailsProps {
    id: string;
}

export function ProjectDetails({ id }: ProjectDetailsProps) {
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [applying, setApplying] = useState(false)
    const [coverLetter, setCoverLetter] = useState('')
    const { showNotification } = useNotification()
    const router = useRouter()

    useEffect(() => {
        loadProject()
    }, [id])

    const loadProject = async () => {
        try {
            setLoading(true)
            // Mock data for demonstration
            const mockProject: Project = {
                id: id,
                title: 'Fashion Editorial Photography',
                description: 'We are looking for a talented fashion photographer to shoot our upcoming editorial featuring summer collection. The shoot will take place in multiple locations around the city and will require 10+ outfit changes. We are looking for someone with experience in high-fashion photography and a strong portfolio in editorial work.\n\nResponsibilities:\n- Conceptualize and execute creative photography for fashion editorial\n- Work with art director and stylist to bring vision to life\n- Manage lighting setup and equipment\n- Deliver high-quality edited images within deadline\n\nRequirements:\n- Minimum 5 years of fashion photography experience\n- Strong portfolio in fashion/editorial photography\n- Proficiency in lighting techniques\n- Experience with Adobe Lightroom and Photoshop\n- Ability to work under tight deadlines',
                category: 'Photography',
                status: 'active',
                budgetMin: 1500,
                budgetMax: 2500,
                createdAt: '2023-06-10T14:30:00Z',
                deadline: '2023-07-15T00:00:00Z',
                timelineWeeks: 3,
                client: {
                    id: '101',
                    name: 'StyleCraft Magazine',
                    email: 'projects@stylecraft.com',
                    location: 'New York, NY'
                },
                requiredSkills: [
                    'Fashion Photography',
                    'Editorial Photography',
                    'Lighting',
                    'Adobe Lightroom',
                    'Adobe Photoshop'
                ],
                applicationsCount: 8
            }

            setProject(mockProject)
            setLoading(false)
            setError(null)
        } catch (err) {
            console.error('Error loading project:', err)
            setError('Failed to load project. Please try again.')
            setLoading(false)
        }
    }

    const handleApply = async () => {
        try {
            setApplying(true)
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            showNotification(
                'Application submitted successfully!',
                'success',
                'The client will review your application and get back to you soon.',
                5000
            )

            setApplying(false)
            setCoverLetter('')
            router.push('/applications')
        } catch (err) {
            console.error('Error applying to project:', err)
            showNotification(
                'Failed to submit application',
                'error',
                'Please try again or contact support if the issue persists.',
                5000
            )
            setApplying(false)
        }
    }

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search projects...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading project..." />
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
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Project</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={loadProject}>
                                Try Again
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </SimplifiedLayout>
        )
    }

    if (!project) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search projects...">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Briefcase className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Project Not Found</h3>
                        <p className="text-neutral-600">The project you're looking for doesn't exist or has been removed.</p>
                        <Button variant="primary" onClick={() => router.push('/projects')} className="mt-6">
                            Browse Projects
                        </Button>
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search projects...">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                        {/* Project Header */}
                        <div className="bg-gradient-to-r from-beacon-purple to-beacon-purple-dark p-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold">{project.title}</h1>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                                            {project.category}
                                        </span>
                                        {project.client.location && (
                                            <span className="inline-flex items-center text-sm">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {project.client.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-sm text-purple-100">Budget Range</div>
                                        <div className="font-semibold">
                                            {project.budgetMin && project.budgetMax
                                                ? `${formatCurrency(project.budgetMin)} - ${formatCurrency(project.budgetMax)}`
                                                : 'Budget not specified'}
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                                        onClick={() => {
                                            const element = document.getElementById('apply-section')
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' })
                                            }
                                        }}
                                    >
                                        Apply Now
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Content */}
                                <div className="lg:col-span-2">
                                    {/* Description Section */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Project Description</h2>
                                        <div className="prose prose-neutral">
                                            {project.description.split('\n\n').map((paragraph, index) => (
                                                <div key={index} className="mb-4 last:mb-0">
                                                    {paragraph.includes('\n') ? (
                                                        <ul className="list-disc pl-4 space-y-2">
                                                            {paragraph.split('\n').map((line, lineIndex) => (
                                                                <li key={lineIndex} className="text-neutral-700">
                                                                    {line.replace('- ', '')}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-neutral-700">{paragraph}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    {project.requiredSkills && project.requiredSkills.length > 0 && (
                                        <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
                                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Required Skills</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {project.requiredSkills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-beacon-purple-light/20 text-beacon-purple"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Application Section */}
                                    <div id="apply-section" className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Apply for this Project</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="coverLetter" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Cover Letter
                                                </label>
                                                <textarea
                                                    id="coverLetter"
                                                    rows={6}
                                                    className="block w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-beacon-purple focus:ring-2 focus:ring-beacon-purple/20"
                                                    placeholder="Introduce yourself and explain why you're a great fit for this project..."
                                                    value={coverLetter}
                                                    onChange={(e) => setCoverLetter(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Button
                                                    variant="primary"
                                                    className="w-full"
                                                    onClick={handleApply}
                                                    isLoading={applying}
                                                    disabled={!coverLetter.trim()}
                                                >
                                                    {applying ? 'Submitting Application...' : 'Submit Application'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Quick Stats */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-5 h-5 text-neutral-500 mr-3" />
                                                <div>
                                                    <div className="text-sm text-neutral-600">Posted</div>
                                                    <div className="font-medium text-neutral-900">
                                                        {formatDate(project.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                            {project.deadline && (
                                                <div className="flex items-center">
                                                    <Clock className="w-5 h-5 text-neutral-500 mr-3" />
                                                    <div>
                                                        <div className="text-sm text-neutral-600">Deadline</div>
                                                        <div className="font-medium text-neutral-900">
                                                            {formatDate(project.deadline, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {project.timelineWeeks && (
                                                <div className="flex items-center">
                                                    <Calendar className="w-5 h-5 text-neutral-500 mr-3" />
                                                    <div>
                                                        <div className="text-sm text-neutral-600">Timeline</div>
                                                        <div className="font-medium text-neutral-900">
                                                            {project.timelineWeeks} {project.timelineWeeks === 1 ? 'week' : 'weeks'}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <Users className="w-5 h-5 text-neutral-500 mr-3" />
                                                <div>
                                                    <div className="text-sm text-neutral-600">Applications</div>
                                                    <div className="font-medium text-neutral-900">
                                                        {project.applicationsCount}
                                                    </div>
                                                </div>
                                            </div>
                                            {project.budgetMin && project.budgetMax && (
                                                <div className="flex items-center">
                                                    <DollarSign className="w-5 h-5 text-neutral-500 mr-3" />
                                                    <div>
                                                        <div className="text-sm text-neutral-600">Budget</div>
                                                        <div className="font-medium text-neutral-900">
                                                            {formatCurrency(project.budgetMin)} - {formatCurrency(project.budgetMax)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <h3 className="font-semibold text-neutral-900 mb-4">About the Client</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-beacon-purple-light/20 flex items-center justify-center text-beacon-purple font-medium">
                                                    {project.client.name.charAt(0)}
                                                </div>
                                                <div className="ml-3">
                                                    <div className="font-medium text-neutral-900">{project.client.name}</div>
                                                    {project.client.location && (
                                                        <div className="text-sm text-neutral-600">{project.client.location}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <Button variant="outline" className="w-full">
                                                Contact Client
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SimplifiedLayout>
    );
}
