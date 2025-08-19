'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CheckCircle, ExternalLink, Star, User } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import type { Creative, Review } from './types'

interface CreativeProfileProps {
    id: string;
}

export function CreativeProfile({ id }: CreativeProfileProps) {
    const [creative, setCreative] = useState<Creative | null>(null)
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()

    // Mock data for demonstration
    const mockCreative: Creative = {
        id: id,
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        bio: 'Passionate fashion photographer with 8+ years of experience. Specializing in editorial and commercial photography with a focus on storytelling through visuals. I believe in capturing the essence of each project and creating images that resonate with the audience. My approach combines technical expertise with creative vision to deliver exceptional results.',
        location: 'New York, NY',
        hourlyRate: 75,
        skills: ['Fashion Photography', 'Portrait', 'Lighting', 'Photoshop', 'Lightroom', 'Commercial Photography', 'Editorial Photography'],
        portfolioLinks: ['https://sarahjohnson.com', 'https://instagram.com/sarahjohnson'],
        profileImageUrl: '',
        isVerified: true,
        rating: 4.9,
        reviewCount: 42,
        totalProjects: 28,
        joinDate: '2020-03-15T00:00:00Z',
        languages: ['English', 'French']
    }

    const mockReviews: Review[] = [
        {
            id: '1',
            clientId: '101',
            clientName: 'Michael Chen',
            clientAvatar: '',
            rating: 5,
            comment: 'Sarah did an amazing job on our fashion editorial shoot. Her attention to detail and ability to capture the perfect moments was impressive. The images exceeded our expectations and helped us achieve our marketing goals.',
            projectId: '201',
            projectName: 'Summer Collection Editorial',
            date: '2023-05-20T00:00:00Z'
        },
        {
            id: '2',
            clientId: '102',
            clientName: 'Emma Rodriguez',
            clientAvatar: '',
            rating: 5,
            comment: 'Working with Sarah was a pleasure. She understood our vision perfectly and delivered stunning results. Her professionalism and creativity made the entire process smooth and enjoyable.',
            projectId: '202',
            projectName: 'Brand Campaign Photography',
            date: '2023-04-15T00:00:00Z'
        },
        {
            id: '3',
            clientId: '103',
            clientName: 'David Kim',
            clientAvatar: '',
            rating: 4,
            comment: 'Great photographer with a keen eye for detail. The images were of high quality and captured exactly what we needed. Communication was clear throughout the project.',
            projectId: '203',
            projectName: 'Product Catalog Shoot',
            date: '2023-03-10T00:00:00Z'
        }
    ]

    // Simulate loading
    setTimeout(() => {
        setCreative(mockCreative)
        setReviews(mockReviews)
        setLoading(false)
    }, 500)

    if (loading) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading profile..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Profile</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={() => {
                                setCreative(mockCreative)
                                setReviews(mockReviews)
                                setLoading(false)
                                setError(null)
                            }}>
                                Try Again
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </SimplifiedLayout>
        )
    }

    if (!creative) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <User className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Creative Not Found</h3>
                        <p className="text-neutral-600">The creative profile you're looking for doesn't exist or has been removed.</p>
                        <Button variant="primary" onClick={() => window.history.back()} className="mt-6">
                            Go Back
                        </Button>
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search creatives...">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-beacon-purple to-beacon-purple-dark p-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                    {creative.profileImageUrl ? (
                                        <Image
                                            src={creative.profileImageUrl}
                                            alt={`${creative.firstName} ${creative.lastName}`}
                                            width={96}
                                            height={96}
                                            className="rounded-full object-cover border-4 border-white/20"
                                        />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl border-4 border-white/20">
                                            {creative.firstName.charAt(0)}{creative.lastName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="flex items-center">
                                                <h1 className="text-2xl font-bold">{creative.firstName} {creative.lastName}</h1>
                                                {creative.isVerified && (
                                                    <CheckCircle className="h-6 w-6 text-green-400 ml-2" />
                                                )}
                                            </div>
                                            <p className="mt-1 text-purple-100">{creative.bio ? creative.bio.split('.')[0] + '.' : 'Creative Professional'}</p>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex space-x-3">
                                            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                                Send Message
                                            </Button>
                                            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                                Hire for Project
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Main Content */}
                                <div className="lg:col-span-2">
                                    {/* About Section */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">About</h2>
                                        <p className="text-neutral-700 whitespace-pre-line">
                                            {creative.bio}
                                        </p>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Skills</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {creative.skills?.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-beacon-purple-light/20 text-beacon-purple"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Portfolio Section */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Portfolio</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {creative.portfolioLinks?.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                                                >
                                                    <ExternalLink className="h-5 w-5 text-beacon-purple mr-2" />
                                                    <span className="text-neutral-700 truncate">{link.replace('https://', '')}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-neutral-900">Reviews</h2>
                                            <div className="flex items-center">
                                                <Star className="h-5 w-5 fill-current text-yellow-400 mr-1" />
                                                <span className="font-medium text-neutral-900">
                                                    {creative.rating} ({creative.reviewCount} reviews)
                                                </span>
                                            </div>
                                        </div>

                                        {reviews.length > 0 ? (
                                            <div className="space-y-6">
                                                {reviews.map((review) => (
                                                    <div key={review.id} className="border-b border-neutral-200 pb-6 last:border-0 last:pb-0">
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0">
                                                                {review.clientAvatar ? (
                                                                    <Image
                                                                        src={review.clientAvatar}
                                                                        alt={review.clientName}
                                                                        width={40}
                                                                        height={40}
                                                                        className="rounded-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium">
                                                                        {review.clientName.charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4 flex-1">
                                                                <div className="flex items-center justify-between">
                                                                    <h3 className="font-medium text-neutral-900">{review.clientName}</h3>
                                                                    <span className="text-sm text-neutral-500">
                                                                        {formatDate(review.date, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`h-4 w-4 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <p className="mt-2 text-neutral-700">
                                                                    {review.comment}
                                                                </p>
                                                                <p className="mt-2 text-sm text-neutral-500">
                                                                    Project: {review.projectName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Star className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-neutral-900 mb-2">No Reviews Yet</h3>
                                                <p className="text-neutral-600">
                                                    This creative hasn't received any reviews yet.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Stats */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Stats</h2>
                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-neutral-600">Projects Completed</span>
                                                <span className="font-medium text-neutral-900">{creative.totalProjects}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-600">Rating</span>
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                                                    <span className="font-medium text-neutral-900">
                                                        {creative.rating} ({creative.reviewCount} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-600">Member Since</span>
                                                <span className="font-medium text-neutral-900">
                                                    {formatDate(creative.joinDate, { month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rate */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Rate</h2>
                                        <div className="text-center">
                                            {creative.hourlyRate ? (
                                                <>
                                                    <p className="text-3xl font-bold text-neutral-900">
                                                        {formatCurrency(creative.hourlyRate)}
                                                    </p>
                                                    <p className="text-neutral-600 mt-1">per hour</p>
                                                </>
                                            ) : (
                                                <p className="text-neutral-600">Rate not specified</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    {creative.languages && creative.languages.length > 0 && (
                                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Languages</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {creative.languages.map((language, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800"
                                                    >
                                                        {language}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact</h2>
                                        <div className="space-y-3">
                                            <Button variant="primary" className="w-full">
                                                Send Message
                                            </Button>
                                            <Button variant="outline" className="w-full">
                                                Hire for a Project
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
