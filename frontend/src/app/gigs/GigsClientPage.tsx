'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Gig } from '@/types/api'
import { useEffect, useState } from 'react'

export default function GigsClientPage() {
    const [gigs, setGigs] = useState<Gig[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const limit = 9

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                setLoading(true)
                setError(null)
                const token = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('access_token='))
                    ?.split('=')[1]

                if (token) {
                    const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
                    const base = rawBase.replace(/\/+$/, '')
                    const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

                    // Fetch gigs with pagination
                    const skip = (page - 1) * limit
                    const gigsResp = await fetch(`${apiBase}/gigs?skip=${skip}&limit=${limit}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json'
                        },
                    })

                    if (gigsResp.ok) {
                        const data = await gigsResp.json()
                        if (Array.isArray(data)) {
                            // For first page, replace all gigs
                            // For subsequent pages, append to existing gigs
                            if (page === 1) {
                                setGigs(data as Gig[])
                            } else {
                                setGigs(prev => [...prev, ...data as Gig[]])
                            }
                            setHasMore(data.length === limit)
                        }
                    } else {
                        throw new Error('Failed to load gigs')
                    }
                }
            } catch (err) {
                console.error('Failed to fetch gigs', err)
                setError('Failed to load gigs')
            } finally {
                setLoading(false)
            }
        }

        fetchGigs()
    }, [page])

    const loadMore = () => {
        setPage(prev => prev + 1)
    }

    const refreshGigs = () => {
        setPage(1)
        setGigs([])
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search gigs...">
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Browse Gigs</h1>
                        <p className="text-neutral-600">Find and apply to gigs that match your skills and interests.</p>
                    </div>

                    {error ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Error Loading Gigs</h2>
                            <p className="text-neutral-600 mb-6">{error}</p>
                            <button
                                onClick={refreshGigs}
                                className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : gigs.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gigs.map((gig) => (
                                    <div key={gig.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">{gig.title}</h2>
                                        <p className="text-neutral-600 mb-4 line-clamp-3">{gig.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {gig.required_skills && gig.required_skills.slice(0, 3).map((skill, index) => (
                                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                    {skill}
                                                </span>
                                            ))}
                                            {gig.required_skills && gig.required_skills.length > 3 && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                    +{gig.required_skills.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center mb-4 text-sm text-neutral-600">
                                            <span>
                                                {gig.budget_min && gig.budget_max
                                                    ? `$${gig.budget_min} - $${gig.budget_max}`
                                                    : 'Budget not specified'}
                                            </span>
                                            <span>
                                                {gig.timeline_weeks
                                                    ? `${gig.timeline_weeks} ${gig.timeline_weeks === 1 ? 'week' : 'weeks'}`
                                                    : 'Timeline not specified'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-neutral-500">
                                                Posted {gig.created_at ? new Date(gig.created_at).toLocaleDateString() : 'Unknown date'}
                                            </span>
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-8 flex justify-between items-center">
                                <div className="text-sm text-neutral-500">
                                    Showing {gigs.length} of {hasMore ? 'many' : gigs.length} gigs
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

                            {/* Loading indicator */}
                            {loading && page === 1 && (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beacon-purple"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No gigs available</h2>
                            <p className="text-neutral-600 mb-6">Check back later for new gig opportunities.</p>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}