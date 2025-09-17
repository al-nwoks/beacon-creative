'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { buildQuery, clientFetcher } from '@/lib/api'
import type { GigsPaginatedResponse } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface FilterState {
    search: string
    category: string
    status: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
}

export default function GigsClientPage() {
    const router = useRouter()
    const [gigsData, setGigsData] = useState<GigsPaginatedResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: '',
        status: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
    })
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const limit = 9

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search)
        }, 500)
        return () => clearTimeout(timer)
    }, [filters.search])

    // Reset page when filters change
    useEffect(() => {
        if (page !== 1) {
            setPage(1)
        }
    }, [debouncedSearch, filters.category, filters.status, filters.sortBy, filters.sortOrder])

    const fetchGigs = useCallback(async (currentPage: number, currentFilters: FilterState, searchTerm: string) => {
        try {
            setLoading(true)
            setError(null)

            const params: Record<string, any> = {
                skip: (currentPage - 1) * limit,
                limit,
                sort_by: currentFilters.sortBy,
                sort_order: currentFilters.sortOrder
            }

            if (searchTerm.trim()) {
                params.search = searchTerm.trim()
            }
            if (currentFilters.category) {
                params.category = currentFilters.category
            }
            if (currentFilters.status) {
                params.status = currentFilters.status
            }

            const queryString = buildQuery(params)
            const data = await clientFetcher(`/api/gigs${queryString}`)
            setGigsData(data)
        } catch (err) {
            console.error('Failed to fetch gigs', err)
            setError('Failed to load gigs. Please try again.')
        } finally {
            setLoading(false)
        }
    }, [limit])

    useEffect(() => {
        fetchGigs(page, filters, debouncedSearch)
    }, [page, filters.category, filters.status, filters.sortBy, filters.sortOrder, debouncedSearch, fetchGigs])

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            status: '',
            sortBy: 'created_at',
            sortOrder: 'desc'
        })
        setPage(1)
    }

    const handleViewGig = (gigId: string | number) => {
        router.push(`/gigs/${gigId}`)
    }

    const categories = [
        'Photography',
        'Design',
        'Video',
        'Music',
        'Modeling',
        'Writing',
        'Marketing',
        'Development'
    ]

    const statuses = [
        { value: 'active', label: 'Active' },
        { value: 'draft', label: 'Draft' },
        { value: 'hired', label: 'Hired' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const sortOptions = [
        { value: 'created_at', label: 'Date Posted' },
        { value: 'budget_max', label: 'Budget' },
        { value: 'title', label: 'Title' }
    ]

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Browse Gigs</h1>
                        <p className="text-neutral-600">Find and apply to gigs that match your skills and interests.</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Search */}
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search gigs..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-transparent"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-transparent"
                                >
                                    <option value="">All Statuses</option>
                                    {statuses.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label htmlFor="sort" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Sort By
                                </label>
                                <div className="flex space-x-2">
                                    <select
                                        id="sort"
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-transparent"
                                    >
                                        {sortOptions.map(option => (
                                            <option key={option.value} value={option.value}>{option.label}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                                        className="px-3 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-beacon-purple"
                                        title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                                    >
                                        {filters.sortOrder === 'asc' ? '↑' : '↓'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-beacon-purple hover:text-beacon-purple-dark"
                            >
                                Clear all filters
                            </button>
                            {gigsData && (
                                <div className="text-sm text-neutral-600">
                                    Showing {gigsData.items.length} of {gigsData.total} gigs
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    {error ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Error Loading Gigs</h2>
                            <p className="text-neutral-600 mb-6">{error}</p>
                            <button
                                onClick={() => fetchGigs(page, filters, debouncedSearch)}
                                className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beacon-purple"></div>
                        </div>
                    ) : gigsData && gigsData.items.length > 0 ? (
                        <>
                            {/* Gigs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {gigsData.items.map((gig) => (
                                    <div key={gig.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h2 className="text-xl font-semibold text-neutral-900 line-clamp-2">{gig.title}</h2>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${gig.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    gig.status === 'hired' ? 'bg-blue-100 text-blue-800' :
                                                        gig.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                            gig.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {gig.status}
                                            </span>
                                        </div>

                                        <p className="text-neutral-600 mb-4 line-clamp-3">{gig.description}</p>

                                        {gig.category && (
                                            <div className="mb-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-beacon-purple-light/20 text-beacon-purple">
                                                    {gig.category}
                                                </span>
                                            </div>
                                        )}

                                        {gig.required_skills && gig.required_skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {gig.required_skills.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {gig.required_skills.length > 3 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                        +{gig.required_skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}

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
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewGig(gig.id)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {gigsData.pages > 1 && (
                                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                        <div className="text-sm text-neutral-600">
                                            Page {gigsData.page} of {gigsData.pages} ({gigsData.total} total gigs)
                                        </div>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handlePageChange(1)}
                                                disabled={gigsData.page === 1}
                                                className="px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                First
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(gigsData.page - 1)}
                                                disabled={gigsData.page === 1}
                                                className="px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            {/* Page numbers */}
                                            {Array.from({ length: Math.min(5, gigsData.pages) }, (_, i) => {
                                                const pageNum = Math.max(1, Math.min(gigsData.pages - 4, gigsData.page - 2)) + i
                                                if (pageNum > gigsData.pages) return null
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-3 py-2 text-sm border rounded-md ${pageNum === gigsData.page
                                                                ? 'bg-beacon-purple text-white border-beacon-purple'
                                                                : 'border-neutral-300 hover:bg-neutral-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                )
                                            })}

                                            <button
                                                onClick={() => handlePageChange(gigsData.page + 1)}
                                                disabled={gigsData.page === gigsData.pages}
                                                className="px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(gigsData.pages)}
                                                disabled={gigsData.page === gigsData.pages}
                                                className="px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Last
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No gigs found</h2>
                            <p className="text-neutral-600 mb-6">
                                {filters.search || filters.category || filters.status
                                    ? 'Try adjusting your filters to see more results.'
                                    : 'Check back later for new gig opportunities.'
                                }
                            </p>
                            {(filters.search || filters.category || filters.status) && (
                                <button
                                    onClick={clearFilters}
                                    className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}