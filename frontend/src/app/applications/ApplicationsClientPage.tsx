'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Application } from '@/types/api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ApplicationsClientPage() {
    const [applications, setApplications] = useState<Application[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
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
        const fetchApplications = async () => {
            try {
                setLoading(true)
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('access_token='))
                    ?.split('=')[1]

                if (token) {
                    const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
                    const base = rawBase.replace(/\/+$/, '')
                    const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

                    // Fetch applications with pagination
                    const skip = (page - 1) * limit
                    const applicationsResp = await fetch(`${apiBase}/applications/me?skip=${skip}&limit=${limit}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json'
                        },
                    })

                    if (applicationsResp.ok) {
                        const applicationsData = await applicationsResp.json()
                        if (Array.isArray(applicationsData)) {
                            // For first page, replace all applications
                            // For subsequent pages, append to existing applications
                            if (page === 1) {
                                setApplications(applicationsData as Application[])
                            } else {
                                setApplications(prev => [...prev, ...applicationsData as Application[]])
                            }
                            setHasMore(applicationsData.length === limit)
                        }
                    } else {
                        throw new Error('Failed to load applications')
                    }
                }
            } catch (err) {
                console.error('Failed to fetch applications', err)
                setError('Failed to load applications')
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [page])

    const loadMore = () => {
        setPage(prev => prev + 1)
    }

    const refreshApplications = () => {
        setPage(1)
        setApplications([])
    }

    return (
        <ProtectedRoute requiredRole="creative">
            <SimplifiedLayout userType="creative">
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Applications</h1>
                        <p className="text-neutral-600">View and manage your gig applications.</p>
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
                                            <div>
                                                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                                                    {typeof application.gig === 'object' && application.gig !== null
                                                        ? (application.gig as any).title || 'Untitled Gig'
                                                        : 'Gig'}
                                                </h2>
                                                <p className="text-neutral-600 mb-3">
                                                    {application.cover_letter}
                                                </p>
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <span>Applied {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Unknown date'}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>
                                                        Proposed: ${application.proposed_budget} in {application.proposed_timeline_weeks} weeks
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <Link href={`/gigs/${typeof application.gig === 'object' && application.gig !== null ? application.gig.id : ''}`} className="text-beacon-purple hover:underline text-sm font-medium">
                                                View Gig Details
                                            </Link>
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
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No applications yet</h2>
                            <p className="text-neutral-600 mb-6">Your gig applications will appear here once you apply to gigs.</p>
                            <a href="/gigs" className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                                Browse Gigs
                            </a>
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