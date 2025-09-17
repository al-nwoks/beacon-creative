'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { useNotification } from '@/components/ui/NotificationProvider'
import { clientFetcher } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Gig } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AdminGigDetailsProps {
    id: string
}

export function AdminGigDetails({ id }: AdminGigDetailsProps) {
    const router = useRouter()
    const { showNotification } = useNotification()
    const [gig, setGig] = useState<Gig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editData, setEditData] = useState<Partial<Gig>>({})

    useEffect(() => {
        const fetchGig = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await clientFetcher(`/api/admin/gigs/${id}`)
                setGig(data)
                setEditData(data)
            } catch (err) {
                console.error('Error loading gig:', err)
                setError('Failed to load gig. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchGig()
        }
    }, [id])

    const handleUpdate = async () => {
        if (!editData) return

        setIsUpdating(true)
        try {
            const updatedGig = await clientFetcher(`/api/admin/gigs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(editData)
            })

            setGig(updatedGig)
            setEditMode(false)
            showNotification('Gig updated successfully!', 'success')
        } catch (err) {
            console.error('Error updating gig:', err)
            showNotification('Failed to update gig. Please try again.', 'error')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this gig? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            await clientFetcher(`/api/admin/gigs/${id}`, {
                method: 'DELETE'
            })

            showNotification('Gig deleted successfully!', 'success')
            router.push('/admin/gigs')
        } catch (err) {
            console.error('Error deleting gig:', err)
            showNotification('Failed to delete gig. Please try again.', 'error')
        } finally {
            setIsDeleting(false)
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'hired':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-gray-100 text-gray-800'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'draft':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <ProtectedRoute requiredRole="admin">
                <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search...">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beacon-purple"></div>
                        </div>
                    </div>
                </SimplifiedLayout>
            </ProtectedRoute>
        )
    }

    if (error) {
        return (
            <ProtectedRoute requiredRole="admin">
                <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search...">
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Error Loading Gig</h3>
                            <p className="text-neutral-600 mb-6">{error}</p>
                            <div className="space-x-4">
                                <Button variant="primary" onClick={() => window.location.reload()}>
                                    Try Again
                                </Button>
                                <Button variant="outline" onClick={() => router.push('/admin/gigs')}>
                                    Back to Gigs
                                </Button>
                            </div>
                        </div>
                    </div>
                </SimplifiedLayout>
            </ProtectedRoute>
        )
    }

    if (!gig) {
        return (
            <ProtectedRoute requiredRole="admin">
                <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search...">
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Gig Not Found</h3>
                            <p className="text-neutral-600">The gig you're looking for doesn't exist or has been removed.</p>
                            <Button variant="primary" onClick={() => router.push('/admin/gigs')} className="mt-6">
                                Back to Gigs
                            </Button>
                        </div>
                    </div>
                </SimplifiedLayout>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-beacon-purple hover:text-beacon-purple-dark mb-6"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Admin Gigs
                        </button>

                        {/* Main Gig Details */}
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-1">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={editData.title || ''}
                                            onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                                            className="text-3xl font-bold text-neutral-900 mb-3 w-full border border-neutral-300 rounded px-3 py-2"
                                        />
                                    ) : (
                                        <h1 className="text-3xl font-bold text-neutral-900 mb-3">{gig.title}</h1>
                                    )}
                                    <div className="flex items-center gap-3">
                                        {editMode ? (
                                            <select
                                                value={editData.category || ''}
                                                onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                                                className="border border-neutral-300 rounded px-3 py-1"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Photography">Photography</option>
                                                <option value="Design">Design</option>
                                                <option value="Video">Video</option>
                                                <option value="Music">Music</option>
                                                <option value="Modeling">Modeling</option>
                                                <option value="Writing">Writing</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Development">Development</option>
                                            </select>
                                        ) : (
                                            gig.category && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-beacon-purple-light/20 text-beacon-purple">
                                                    {gig.category}
                                                </span>
                                            )
                                        )}
                                        {editMode ? (
                                            <select
                                                value={editData.status || ''}
                                                onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                                                className="border border-neutral-300 rounded px-3 py-1"
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="active">Active</option>
                                                <option value="hired">Hired</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gig.status || 'active')}`}>
                                                {gig.status || 'Active'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {editMode ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setEditMode(false)
                                                    setEditData(gig)
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={handleUpdate}
                                                disabled={isUpdating}
                                            >
                                                {isUpdating ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={() => setEditMode(true)}
                                            >
                                                Edit Gig
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleDelete}
                                                disabled={isDeleting}
                                            >
                                                {isDeleting ? 'Deleting...' : 'Delete Gig'}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Key Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-neutral-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Budget Range</h3>
                                    {editMode ? (
                                        <div className="space-y-2">
                                            <input
                                                type="number"
                                                placeholder="Min Budget"
                                                value={editData.budget_min || ''}
                                                onChange={(e) => setEditData(prev => ({ ...prev, budget_min: parseFloat(e.target.value) || null }))}
                                                className="w-full text-sm border border-neutral-300 rounded px-2 py-1"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max Budget"
                                                value={editData.budget_max || ''}
                                                onChange={(e) => setEditData(prev => ({ ...prev, budget_max: parseFloat(e.target.value) || null }))}
                                                className="w-full text-sm border border-neutral-300 rounded px-2 py-1"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-lg font-semibold text-neutral-900">
                                            {gig.budget_min && gig.budget_max
                                                ? `${formatCurrency(gig.budget_min)} - ${formatCurrency(gig.budget_max)}`
                                                : 'Budget not specified'}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-neutral-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Timeline</h3>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            placeholder="Weeks"
                                            value={editData.timeline_weeks || ''}
                                            onChange={(e) => setEditData(prev => ({ ...prev, timeline_weeks: parseInt(e.target.value) || null }))}
                                            className="w-full text-lg font-semibold border border-neutral-300 rounded px-2 py-1"
                                        />
                                    ) : (
                                        <div className="text-lg font-semibold text-neutral-900">
                                            {gig.timeline_weeks
                                                ? `${gig.timeline_weeks} ${gig.timeline_weeks === 1 ? 'week' : 'weeks'}`
                                                : 'Timeline not specified'}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-neutral-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Applications</h3>
                                    <div className="text-lg font-semibold text-neutral-900">
                                        {gig.applications_count || 0}
                                    </div>
                                </div>
                                <div className="bg-neutral-50 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-neutral-500 mb-1">Client ID</h3>
                                    <div className="text-lg font-semibold text-neutral-900">
                                        {gig.client_id}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Description</h2>
                                {editMode ? (
                                    <textarea
                                        value={editData.description || ''}
                                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={6}
                                        className="w-full border border-neutral-300 rounded px-3 py-2 text-neutral-700"
                                    />
                                ) : (
                                    <div className="prose prose-neutral max-w-none">
                                        {gig.description?.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="mb-4 text-neutral-700 leading-relaxed">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Required Skills */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Required Skills</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        placeholder="Enter skills separated by commas"
                                        value={editData.required_skills?.join(', ') || ''}
                                        onChange={(e) => setEditData(prev => ({
                                            ...prev,
                                            required_skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                                        }))}
                                        className="w-full border border-neutral-300 rounded px-3 py-2"
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {gig.required_skills && gig.required_skills.length > 0 ? (
                                            gig.required_skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-beacon-purple-light/20 text-beacon-purple"
                                                >
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-neutral-500">No skills specified</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Gig Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg border border-neutral-200 p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Gig ID</h3>
                                <div className="font-mono text-sm text-neutral-900 break-all">
                                    {gig.id}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-neutral-200 p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Posted</h3>
                                <div className="font-medium text-neutral-900">
                                    {gig.created_at ? formatDate(gig.created_at, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-neutral-200 p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Last Updated</h3>
                                <div className="font-medium text-neutral-900">
                                    {gig.updated_at ? formatDate(gig.updated_at, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
                                </div>
                            </div>
                            <div className="bg-white rounded-lg border border-neutral-200 p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Hired Creative</h3>
                                <div className="font-medium text-neutral-900">
                                    {gig.hired_creative_id || 'None'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}