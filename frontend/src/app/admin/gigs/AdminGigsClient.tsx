'use client'

import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { useNotification } from '@/components/ui/NotificationProvider'
import { clientFetcher } from '@/lib/api'
import { Briefcase, Clock, DollarSign, Edit, Eye, Search, Trash2, Users } from 'lucide-react'
import { useState } from 'react'

interface AdminGigsClientProps {
    initialGigs: any[]
    initialStats: any
    error: string | null
}

export default function AdminGigsClient({ initialGigs, initialStats, error: initialError }: AdminGigsClientProps) {
    const [gigs, setGigs] = useState(initialGigs)
    const [stats, setStats] = useState(initialStats)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(initialError)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedGigs, setSelectedGigs] = useState<string[]>([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [gigToDelete, setGigToDelete] = useState<string | null>(null)
    const { showNotification } = useNotification()

    // Filter gigs based on search and status
    const filteredGigs = gigs.filter(gig => {
        const matchesSearch = !searchTerm ||
            gig.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gig.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gig.company?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || gig.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Refresh data
    const refreshData = async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await clientFetcher('/api/admin/gigs?limit=50', { method: 'GET' })

            if (Array.isArray(data)) {
                setGigs(data)

                // Recalculate stats
                const newStats = {
                    total_gigs: data.length,
                    active_gigs: data.filter(g => g.status === 'active' || g.status === 'open').length,
                    completed_gigs: data.filter(g => g.status === 'completed').length,
                    pending_gigs: data.filter(g => g.status === 'pending' || g.status === 'draft').length
                }
                setStats(newStats)
            }

            showNotification('Gigs data refreshed successfully', 'success')
        } catch (err: any) {
            console.error('Failed to refresh gigs data:', err)
            setError('Failed to refresh gigs data')
            showNotification('Failed to refresh gigs data', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Delete gig
    const handleDeleteGig = async (gigId: string) => {
        try {
            await clientFetcher(`/api/admin/gigs/${gigId}`, { method: 'DELETE' })

            setGigs(prev => prev.filter(g => g.id !== gigId))
            setSelectedGigs(prev => prev.filter(id => id !== gigId))
            setShowDeleteModal(false)
            setGigToDelete(null)

            showNotification('Gig deleted successfully', 'success')
        } catch (err: any) {
            console.error('Failed to delete gig:', err)
            showNotification('Failed to delete gig', 'error')
        }
    }

    // Bulk delete gigs
    const handleBulkDelete = async () => {
        try {
            await Promise.all(
                selectedGigs.map(gigId =>
                    clientFetcher(`/api/admin/gigs/${gigId}`, { method: 'DELETE' })
                )
            )

            setGigs(prev => prev.filter(g => !selectedGigs.includes(g.id)))
            setSelectedGigs([])

            showNotification(`${selectedGigs.length} gigs deleted successfully`, 'success')
        } catch (err: any) {
            console.error('Failed to delete gigs:', err)
            showNotification('Failed to delete selected gigs', 'error')
        }
    }

    // Toggle gig selection
    const toggleGigSelection = (gigId: string) => {
        setSelectedGigs(prev =>
            prev.includes(gigId)
                ? prev.filter(id => id !== gigId)
                : [...prev, gigId]
        )
    }

    // Select all gigs
    const toggleSelectAll = () => {
        if (selectedGigs.length === filteredGigs.length) {
            setSelectedGigs([])
        } else {
            setSelectedGigs(filteredGigs.map(g => g.id))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
            case 'open':
                return 'bg-green-100 text-green-800'
            case 'completed':
                return 'bg-blue-100 text-blue-800'
            case 'pending':
            case 'draft':
                return 'bg-yellow-100 text-yellow-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (error && !gigs.length) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Unable to load gigs</h3>
                    <p className="mt-2 text-sm text-neutral-500">{error}</p>
                    <Button onClick={refreshData} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Gig Management</h1>
                    <p className="text-neutral-600 mt-2">Manage platform gigs and projects</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={refreshData} disabled={loading}>
                        {loading ? <EnhancedLoadingSpinner size="sm" /> : 'Refresh'}
                    </Button>
                    {selectedGigs.length > 0 && (
                        <Button variant="outline" onClick={handleBulkDelete} className="text-red-600">
                            Delete Selected ({selectedGigs.length})
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Total Gigs</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total_gigs}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Briefcase className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Active Gigs</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.active_gigs}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Completed</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.completed_gigs}</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Pending</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.pending_gigs}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search gigs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="open">Open</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="draft">Draft</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Gigs Table */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-neutral-900">
                            Gigs ({filteredGigs.length})
                        </h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={selectedGigs.length === filteredGigs.length && filteredGigs.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-neutral-300 text-beacon-purple focus:ring-beacon-purple"
                            />
                            <span className="text-sm text-neutral-500">Select All</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    <input
                                        type="checkbox"
                                        checked={selectedGigs.length === filteredGigs.length && filteredGigs.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-neutral-300 text-beacon-purple focus:ring-beacon-purple"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Gig
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Budget
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {filteredGigs.map((gig) => (
                                <tr key={gig.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            checked={selectedGigs.includes(gig.id)}
                                            onChange={() => toggleGigSelection(gig.id)}
                                            className="rounded border-neutral-300 text-beacon-purple focus:ring-beacon-purple"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-neutral-900">
                                                    {gig.title || 'Untitled Gig'}
                                                </div>
                                                <div className="text-sm text-neutral-500 line-clamp-2">
                                                    {gig.description || 'No description'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900">
                                            {gig.company || gig.client?.name || 'Unknown Client'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900">
                                            {gig.budget_min && gig.budget_max
                                                ? `$${gig.budget_min} - $${gig.budget_max}`
                                                : 'Not specified'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(gig.status)}`}>
                                            {gig.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {gig.created_at ? new Date(gig.created_at).toLocaleDateString() : 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setGigToDelete(gig.id)
                                                    setShowDeleteModal(true)
                                                }}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredGigs.length === 0 && (
                    <div className="text-center py-12">
                        <Briefcase className="mx-auto h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900">No gigs found</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'No gigs have been created yet.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">Confirm Delete</h3>
                        <p className="text-sm text-neutral-600 mb-6">
                            Are you sure you want to delete this gig? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setGigToDelete(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => gigToDelete && handleDeleteGig(gigToDelete)}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <EnhancedLoadingSpinner size="lg" message="Loading gigs..." />
                </div>
            )}
        </main>
    )
}