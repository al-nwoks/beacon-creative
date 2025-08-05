'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Application {
    id: string
    projectId: string
    projectName: string
    projectDescription: string
    clientId: string
    clientName: string
    coverLetter: string
    proposedBudget?: number
    proposedTimelineWeeks?: number
    status: 'pending' | 'accepted' | 'rejected'
    createdAt: string
    updatedAt: string
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()
    const [filterStatus, setFilterStatus] = useState('all')

    // Mock data for demonstration
    const mockApplications: Application[] = [
        {
            id: '1',
            projectId: '101',
            projectName: 'Fashion Editorial Photography',
            projectDescription: 'Need a photographer for a fashion editorial shoot with 10+ outfit changes and multiple locations.',
            clientId: '201',
            clientName: 'Sarah Johnson',
            coverLetter: 'I have extensive experience with fashion editorials and would love to work on this project. My portfolio includes similar work for major fashion brands.',
            proposedBudget: 2000,
            proposedTimelineWeeks: 3,
            status: 'pending',
            createdAt: '2023-06-15T14:30:00Z',
            updatedAt: '2023-06-15T14:30:00Z'
        },
        {
            id: '2',
            projectId: '102',
            projectName: 'Brand Identity Design',
            projectDescription: 'Looking for a creative director to develop a complete brand identity for our tech startup.',
            clientId: '202',
            clientName: 'Michael Chen',
            coverLetter: 'As a creative director with 10+ years of experience, I specialize in developing compelling brand identities for tech companies. I would bring a fresh perspective to your project.',
            proposedBudget: 4500,
            proposedTimelineWeeks: 4,
            status: 'accepted',
            createdAt: '2023-06-10T09:15:00Z',
            updatedAt: '2023-06-12T11:20:00Z'
        },
        {
            id: '3',
            projectId: '103',
            projectName: 'Website Copywriting',
            projectDescription: 'Need compelling copy for our SaaS platform website and marketing materials.',
            clientId: '203',
            clientName: 'Emma Rodriguez',
            coverLetter: 'I specialize in SaaS copywriting and have helped numerous tech companies articulate their value propositions effectively. I would be excited to contribute to your project.',
            proposedBudget: 1200,
            proposedTimelineWeeks: 2,
            status: 'rejected',
            createdAt: '2023-06-05T16:45:00Z',
            updatedAt: '2023-06-08T14:30:00Z'
        },
        {
            id: '4',
            projectId: '104',
            projectName: 'Product Video Animation',
            projectDescription: 'Create an animated explainer video for our new product launch.',
            clientId: '204',
            clientName: 'David Kim',
            coverLetter: 'I have extensive experience in motion graphics and animation for product explainer videos. My approach combines storytelling with visual excellence to create engaging content.',
            proposedBudget: 3200,
            proposedTimelineWeeks: 3,
            status: 'pending',
            createdAt: '2023-06-01T11:20:00Z',
            updatedAt: '2023-06-01T11:20:00Z'
        }
    ]

    // Simulate loading
    setTimeout(() => {
        setApplications(mockApplications)
        setLoading(false)
    }, 500)

    const filteredApplications = applications.filter(application => {
        return filterStatus === 'all' || application.status === filterStatus
    })

    const getStatusInfo = (status: Application['status']) => {
        switch (status) {
            case 'pending':
                return {
                    text: 'Pending',
                    icon: <Clock className="h-4 w-4" />,
                    color: 'text-yellow-600 bg-yellow-100'
                }
            case 'accepted':
                return {
                    text: 'Accepted',
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: 'text-green-600 bg-green-100'
                }
            case 'rejected':
                return {
                    text: 'Rejected',
                    icon: <XCircle className="h-4 w-4" />,
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

    const handleWithdrawApplication = async (applicationId: string) => {
        try {
            // In a real implementation, this would call the API
            // await applicationsAPI.deleteApplication(applicationId)

            setApplications(prev =>
                prev.filter(application => application.id !== applicationId)
            )

            showNotification('Application withdrawn successfully!', 'success')
        } catch (err) {
            console.error('Error withdrawing application:', err)
            showNotification('Failed to withdraw application. Please try again.', 'error')
        }
    }

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search applications...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading applications..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search applications...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Applications</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={() => {
                                setApplications(mockApplications)
                                setLoading(false)
                            }}>
                                Try Again
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search applications...">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">My Applications</h1>
                        <p className="text-neutral-600 mt-2">
                            Track the status of your project applications
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                        >
                            <option value="all">All Applications</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <ErrorBoundary>
                    {filteredApplications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredApplications.map((application) => {
                                const statusInfo = getStatusInfo(application.status)

                                return (
                                    <div key={application.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                        {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
                                                        {statusInfo.text}
                                                    </span>
                                                </div>
                                                {application.status === 'pending' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleWithdrawApplication(application.id)}
                                                    >
                                                        Withdraw
                                                    </Button>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2">
                                                {application.projectName}
                                            </h3>

                                            <p className="text-neutral-700 text-sm mb-4 line-clamp-3">
                                                {application.projectDescription}
                                            </p>

                                            <div className="mb-4">
                                                <p className="text-sm text-neutral-600">
                                                    Client: <span className="font-medium text-neutral-900">{application.clientName}</span>
                                                </p>
                                            </div>

                                            {application.proposedBudget && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-neutral-600">
                                                        Proposed Budget: <span className="font-medium text-neutral-900">{formatCurrency(application.proposedBudget)}</span>
                                                    </p>
                                                </div>
                                            )}

                                            {application.proposedTimelineWeeks && (
                                                <div className="mb-4">
                                                    <p className="text-sm text-neutral-600">
                                                        Timeline: <span className="font-medium text-neutral-900">{application.proposedTimelineWeeks} week{application.proposedTimelineWeeks > 1 ? 's' : ''}</span>
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <p className="text-sm text-neutral-600">
                                                    Applied: <span className="font-medium text-neutral-900">{formatDate(application.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </p>
                                            </div>

                                            <div className="mt-4">
                                                <Button variant="primary" className="w-full">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <Clock className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                {filterStatus === 'all' ? 'No Applications Found' : `No ${filterStatus} Applications`}
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                {filterStatus === 'all'
                                    ? 'You haven\'t applied to any projects yet.'
                                    : `You don't have any ${filterStatus} applications.`}
                            </p>
                            <Button variant="primary" onClick={() => setFilterStatus('all')}>
                                View All Applications
                            </Button>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </SimplifiedLayout>
    )
}