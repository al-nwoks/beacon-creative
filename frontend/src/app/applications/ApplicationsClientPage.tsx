'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { clientFetcher } from '@/lib/api'
import type { Application } from '@/types/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ApplicationsClientPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string>('')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const limit = 10

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    useEffect(() => {
        const fetchUserAndApplications = async () => {
            try {
                setLoading(true)
                setError(null)

                // First, get current user to determine role
                const user = await clientFetcher('/api/users/me')
                setUserRole(user.role)

                // Then fetch applications based on role
                const skip = (page - 1) * limit
                let applicationsData: Application[]

                if (user.role === 'creative') {
                    // For creatives, get their applications with gig info
                    applicationsData = await clientFetcher(`/api/applications/me/with-gig?skip=${skip}&limit=${limit}`)
                } else if (user.role === 'client') {
                    // For clients, get applications to their gigs with gig info
                    applicationsData = await clientFetcher(`/api/applications/client/me/with-gig?skip=${skip}&limit=${limit}`)
                } else {
                    throw new Error('Invalid user role')
                }

                if (Array.isArray(applicationsData)) {
                    // For first page, replace all applications
                    // For subsequent pages, append to existing applications
                    if (page === 1) {
                        setApplications(applicationsData)
                    } else {
                        setApplications(prev => [...prev, ...applicationsData])
                    }
                    setHasMore(applicationsData.length === limit)
                } else {
                    setApplications([])
                    setHasMore(false)
                }
            } catch (err) {
                console.error('Failed to fetch applications', err)
                setError('Failed to load applications')
            } finally {
                setLoading(false)
            }
        }

        fetchUserAndApplications()
    }, [page])

    const loadMore = () => {
        setPage(prev => prev + 1)
    }

    const refreshApplications = () => {
        setPage(1)
        setApplications([])
    }

    const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
        try {
            await clientFetcher(`/api/applications/${applicationId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus })
            })

            // Refresh applications to show updated status
            refreshApplications()
        } catch (err) {
            console.error('Failed to update application status', err)
            setError('Failed to update application status')
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search applications...">
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                            {userRole === 'client' ? 'Applications to My Gigs' : 'My Applications'}
                        </h1>
                        <p className="text-neutral-600">
                            {userRole === 'client'
                                ? 'View and manage applications submitted to your gigs.'
                                : 'View and manage your gig applications.'
                            }
                        </p>
                    </div>

                    {error ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Error Loading Applications</h2>
                            <p className="text-neutral-600 mb-6">{error}</p>
                            <button
                                onClick={refreshApplications}
                                className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : applications.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                            <div className="divide-y divide-neutral-200">
                                {applications.map((application: any) => (
                                    <div key={application.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h2 className="text-xl font-semibold text-neutral-900">
                                                            {typeof application.gig === 'object' && application.gig !== null
                                                                ? (application.gig as any).title || 'Untitled Gig'
                                                                : 'Gig'}
                                                        </h2>
                                                        {typeof application.gig === 'object' && application.gig !== null && (application.gig as any).client?.company_name && (
                                                            <p className="text-neutral-600 text-sm">
                                                                {((application.gig as any).client as any).company_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                        {application.status}
                                                    </span>
                                                </div>

                                                <p className="text-neutral-600 mb-3 line-clamp-3">
                                                    {application.cover_letter}
                                                </p>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div className="text-sm">
                                                        <span className="font-medium text-neutral-700">Applied:</span>
                                                        <span className="text-neutral-600 ml-1">
                                                            {application.applied_at || application.created_at
                                                                ? new Date(application.applied_at || application.created_at).toLocaleDateString()
                                                                : 'Unknown date'}
                                                        </span>
                                                    </div>
                                                    {application.proposed_budget && (
                                                        <div className="text-sm">
                                                            <span className="font-medium text-neutral-700">Proposed Budget:</span>
                                                            <span className="text-neutral-600 ml-1">
                                                                {formatCurrency(application.proposed_budget)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {application.proposed_timeline_weeks && (
                                                        <div className="text-sm">
                                                            <span className="font-medium text-neutral-700">Timeline:</span>
                                                            <span className="text-neutral-600 ml-1">
                                                                {application.proposed_timeline_weeks} {application.proposed_timeline_weeks === 1 ? 'week' : 'weeks'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    <Link
                                                        href={`/gigs/${typeof application.gig === 'object' && application.gig !== null ? (application.gig as any).id : application.gig_id || ''}`}
                                                        className="text-beacon-purple hover:underline text-sm font-medium"
                                                    >
                                                        View Gig Details
                                                    </Link>

                                                    {userRole === 'client' && application.status === 'pending' && (
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(application.id, 'accepted')}
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="px-6 py-4 border-t border-neutral-200 flex justify-between items-center">
                                <div className="text-sm text-neutral-500">
                                    Showing {applications.length} of {hasMore ? 'many' : applications.length} applications
                                </div>
                                <div className="flex space-x-2">
                                    {page > 1 && (
                                        <button
                                            onClick={() => setPage(1)}
                                            className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                                        >
                                            First
                                        </button>
                                    )}
                                    {page > 1 && (
                                        <button
                                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                            className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    {hasMore && (
                                        <button
                                            onClick={loadMore}
                                            disabled={loading}
                                            className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50"
                                        >
                                            {loading ? 'Loading...' : 'Load More'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                                {userRole === 'client' ? 'No applications received' : 'No applications yet'}
                            </h2>
                            <p className="text-neutral-600 mb-6">
                                {userRole === 'client'
                                    ? 'Applications to your gigs will appear here.'
                                    : 'Your gig applications will appear here once you apply to gigs.'
                                }
                            </p>
                            <Link
                                href={userRole === 'client' ? '/gigs/new' : '/gigs'}
                                className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors"
                            >
                                {userRole === 'client' ? 'Post a Gig' : 'Browse Gigs'}
                            </Link>
                        </div>
                    )}

                    {/* Loading indicator */}
                    {loading && page === 1 && (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beacon-purple"></div>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}