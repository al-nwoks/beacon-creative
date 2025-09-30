'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { useNotification } from '@/components/ui/NotificationProvider'
import { clientFetcher } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Gig } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface GigDetailsProps {
    id: string
}

export function GigDetails({ id }: GigDetailsProps) {
    const router = useRouter()
    const { showNotification } = useNotification()
    const [gig, setGig] = useState<Gig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [coverLetter, setCoverLetter] = useState('')
    const [proposedBudget, setProposedBudget] = useState('')
    const [proposedTimeline, setProposedTimeline] = useState('')
    const [isApplying, setIsApplying] = useState(false)

    useEffect(() => {
        const fetchGig = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await clientFetcher(`/api/gigs/${id}`)
                setGig(data)
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

    const handleApply = async () => {
        if (!coverLetter.trim()) {
            showNotification('Please write a cover letter explaining why you\'re a good fit for this gig.', 'error')
            return
        }

        setIsApplying(true)
        try {
            const applicationData = {
                gig_id: id,
                cover_letter: coverLetter.trim(),
                proposed_budget: proposedBudget ? parseFloat(proposedBudget) : null,
                proposed_timeline_weeks: proposedTimeline ? parseInt(proposedTimeline) : null
            }

            await clientFetcher('/api/applications', {
                method: 'POST',
                body: JSON.stringify(applicationData)
            })

            showNotification('Successfully applied to this gig!', 'success')
            setCoverLetter('')
            setProposedBudget('')
            setProposedTimeline('')

            // Optionally redirect to applications page
            setTimeout(() => {
                router.push('/applications')
            }, 2000)
        } catch (err) {
            console.error('Error applying to gig:', err)
            showNotification(
                'Failed to apply to this gig. Please try again.',
                'error'
            )
        } finally {
            setIsApplying(false)
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
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search gigs...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beacon-purple"></div>
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search gigs...">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Error Loading Gig</h3>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <div className="space-x-4">
                            <Button variant="primary" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                            <Button variant="outline" onClick={() => router.push('/gigs')}>
                                Browse Gigs
                            </Button>
                        </div>
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (!gig) {
        return (
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search gigs...">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Gig Not Found</h3>
                        <p className="text-neutral-600">The gig you're looking for doesn't exist or has been removed.</p>
                        <Button variant="primary" onClick={() => router.push('/gigs')} className="mt-6">
                            Browse Gigs
                        </Button>
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    const canApply = gig.status === 'active'

    return (
        <SimplifiedLayout showSearch={true} searchPlaceholder="Search gigs...">
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
                        Back to Gigs
                    </button>

                    {/* Main Gig Details */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-neutral-900 mb-3">{gig.title}</h1>
                                <div className="flex items-center gap-3">
                                    {gig.category && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-beacon-purple-light/20 text-beacon-purple">
                                            {gig.category}
                                        </span>
                                    )}
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(gig.status || 'active')}`}>
                                        {gig.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Key Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Budget</h3>
                                <div className="text-lg font-semibold text-neutral-900">
                                    {gig.budget_min && gig.budget_max
                                        ? `${formatCurrency(gig.budget_min)} - ${formatCurrency(gig.budget_max)}`
                                        : 'Budget not specified'}
                                </div>
                            </div>
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Timeline</h3>
                                <div className="text-lg font-semibold text-neutral-900">
                                    {gig.timeline_weeks
                                        ? `${gig.timeline_weeks} ${gig.timeline_weeks === 1 ? 'week' : 'weeks'}`
                                        : 'Timeline not specified'}
                                </div>
                            </div>
                            <div className="bg-neutral-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Applications</h3>
                                <div className="text-lg font-semibold text-neutral-900">
                                    {gig.applications_count || 0}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Description</h2>
                            <div className="prose prose-neutral max-w-none">
                                {gig.description?.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4 text-neutral-700 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Required Skills */}
                        {gig.required_skills && gig.required_skills.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Required Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {gig.required_skills.map((skill, index) => (
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

                        {/* Application Form */}
                        {canApply && (
                            <div className="bg-neutral-50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Apply for this Gig</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="proposedBudget" className="block text-sm font-medium text-neutral-900 mb-2">
                                            Proposed Budget (USD) <span className="text-neutral-500">(optional)</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="proposedBudget"
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter your proposed budget"
                                            value={proposedBudget}
                                            onChange={(e) => setProposedBudget(e.target.value)}
                                            className="block w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-beacon-purple focus:ring-2 focus:ring-beacon-purple/20"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="proposedTimeline" className="block text-sm font-medium text-neutral-900 mb-2">
                                            Proposed Timeline (weeks) <span className="text-neutral-500">(optional)</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="proposedTimeline"
                                            min="1"
                                            placeholder="Enter timeline in weeks"
                                            value={proposedTimeline}
                                            onChange={(e) => setProposedTimeline(e.target.value)}
                                            className="block w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-beacon-purple focus:ring-2 focus:ring-beacon-purple/20"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="coverLetter" className="block text-sm font-medium text-neutral-900 mb-2">
                                        Cover Letter <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="coverLetter"
                                        rows={6}
                                        className="block w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-900 placeholder-neutral-500 focus:border-beacon-purple focus:ring-2 focus:ring-beacon-purple/20"
                                        placeholder="Introduce yourself and explain why you're a great fit for this gig..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    />
                                </div>

                                <Button
                                    variant="primary"
                                    onClick={handleApply}
                                    disabled={isApplying || !coverLetter.trim()}
                                    className="w-full md:w-auto"
                                >
                                    {isApplying ? 'Submitting Application...' : 'Submit Application'}
                                </Button>
                            </div>
                        )}

                        {!canApply && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-yellow-800">
                                    This gig is currently {gig.status} and not accepting new applications.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Gig Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg border border-neutral-200 p-4">
                            <h3 className="text-sm font-medium text-neutral-500 mb-1">Posted</h3>
                            <div className="font-medium text-neutral-900">
                                {gig.created_at ? formatDate(gig.created_at, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-neutral-200 p-4">
                            <h3 className="text-sm font-medium text-neutral-500 mb-1">Applications</h3>
                            <div className="font-medium text-neutral-900">
                                {gig.applications_count || 0}
                            </div>
                        </div>
                        {gig.budget_min && gig.budget_max && (
                            <div className="bg-white rounded-lg border border-neutral-200 p-4">
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Budget Range</h3>
                                <div className="font-medium text-neutral-900">
                                    {formatCurrency(gig.budget_min)} - {formatCurrency(gig.budget_max)}
                                </div>
                            </div>
                        )}
                        <div className="bg-white rounded-lg border border-neutral-200 p-4">
                            <h3 className="text-sm font-medium text-neutral-500 mb-1">Status</h3>
                            <div className="font-medium text-neutral-900 capitalize">
                                {gig.status || 'Active'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SimplifiedLayout>
    )
}
