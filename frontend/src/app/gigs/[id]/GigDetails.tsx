'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatDate } from '@/lib/utils'
import type { Gig } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
    const [isApplying, setIsApplying] = useState(false)

    // Mock data for demonstration
    const mockGig: Gig = {
        id: id,
        title: 'Brand Photography for Fashion Startup',
        description: `We're a fast-growing fashion startup looking for a talented photographer to capture our new summer collection. The right candidate will have experience in fashion photography and a keen eye for detail.

Key Responsibilities:
- Photograph our entire summer collection (approximately 50 pieces)
- Work with our creative team to ensure brand consistency
- Provide high-resolution, edited images within 2 weeks
- Assist with styling and lighting setup

Requirements:
- Minimum 3 years of fashion photography experience
- Portfolio demonstrating fashion and lifestyle photography
- Proficiency in Adobe Lightroom and Photoshop
- Ability to work under tight deadlines`,
        budget_min: 1500,
        budget_max: 2500,
        timeline_weeks: 4,
        required_skills: ['Photography', 'Fashion', 'Lighting', 'Photoshop', 'Portrait'],
        category: 'Photography',
        created_at: '2023-06-15T10:30:00Z',
        // Note: In the real implementation, we would fetch the client data separately
        applications_count: 12,
        status: 'active'
    }

    // In a real implementation, this would fetch from the API
    // useEffect(() => {
    //     const fetchGig = async () => {
    //         try {
    //             const response = await fetch(`/api/gigs/${id}`)
    //             if (!response.ok) throw new Error('Failed to load gig')
    //             const data = await response.json()
    //             setGig(data)
    //         } catch (err) {
    //             console.error('Error loading gig:', err)
    //             setError('Failed to load gig. Please try again.')
    //         } finally {
    //             setLoading(false)
    //         }
    //     }

    //     fetchGig()
    // }, [id])

    // For demonstration, we'll use mock data
    useState(() => {
        setTimeout(() => {
            setGig(mockGig)
            setLoading(false)
        }, 500)
    })

    const handleApply = async () => {
        if (!coverLetter.trim()) {
            showNotification('Please write a cover letter explaining why you\'re a good fit for this gig.', 'error')
            return
        }

        setIsApplying(true)
        try {
            // In a real implementation, this would call the API
            // await fetch(`/api/applications`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ gig_id: id, cover_letter: coverLetter })
            // })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            showNotification('Successfully applied to this gig!', 'success')
            setCoverLetter('')
            // Redirect to applications page or stay on page with confirmation
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

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search gigs...">
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
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search gigs...">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Error Loading Gig</h3>
                        <p className="text-neutral-600 mb-6">{error}</p>
                        <Button variant="primary" onClick={() => router.push('/gigs')} className="mt-4">
                            Browse Gigs
                        </Button>
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (!gig) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search gigs...">
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

    return (
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search gigs...">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold">{gig.title}</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                                        {gig.category}
                                    </span>
                                    {/* Client location would be fetched separately in real implementation */}
                                </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {gig.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Budget</h3>
                                <div className="font-semibold">
                                    {gig.budget_min && gig.budget_max
                                        ? `${formatCurrency(gig.budget_min)} - ${formatCurrency(gig.budget_max)}`
                                        : 'Budget not specified'}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Timeline</h3>
                                <div className="font-semibold">
                                    {gig.timeline_weeks
                                        ? `${gig.timeline_weeks} ${gig.timeline_weeks === 1 ? 'week' : 'weeks'}`
                                        : 'Timeline not specified'}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Applications</h3>
                                <div className="font-semibold">
                                    {gig.applications_count || 0}
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-neutral max-w-none mb-8">
                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Description</h2>
                            {gig.description?.split('\n\n').map((paragraph, index) => (
                                <div key={index} className="mb-4 last:mb-0">
                                    {paragraph}
                                </div>
                            ))}
                        </div>

                        {/* Skills Section */}
                        {gig.required_skills && gig.required_skills.length > 0 && (
                            <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
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
                        <div className="bg-neutral-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Apply for this Gig</h3>
                            <div className="mb-4">
                                <label htmlFor="coverLetter" className="block text-sm font-medium text-neutral-900 mb-2">
                                    Cover Letter
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
                                disabled={isApplying}
                                className="w-full md:w-auto"
                            >
                                {isApplying ? 'Applying...' : 'Submit Application'}
                            </Button>
                        </div>
                    </div>

                    {/* Gig Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                                <h3 className="text-sm font-medium text-neutral-500 mb-1">Budget</h3>
                                <div className="font-medium text-neutral-900">
                                    {formatCurrency(gig.budget_min)} - {formatCurrency(gig.budget_max)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </SimplifiedLayout>
    )
}
