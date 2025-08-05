'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatCurrency } from '@/lib/utils'
import { MapPin, Search, Star, User } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface Creative {
    id: string
    firstName: string
    lastName: string
    email: string
    bio?: string
    location?: string
    hourlyRate?: number
    skills?: string[]
    portfolioLinks?: string[]
    profileImageUrl?: string
    isVerified: boolean
    rating?: number
    reviewCount?: number
    totalProjects?: number
}

export default function CreativesPage() {
    const [creatives, setCreatives] = useState<Creative[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()
    const [searchQuery, setSearchQuery] = useState('')
    const [filterSkill, setFilterSkill] = useState('all')
    const [filterLocation, setFilterLocation] = useState('all')

    // Mock data for demonstration
    const mockCreatives: Creative[] = [
        {
            id: '1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@example.com',
            bio: 'Passionate fashion photographer with 8+ years of experience. Specializing in editorial and commercial photography with a focus on storytelling through visuals.',
            location: 'New York, NY',
            hourlyRate: 75,
            skills: ['Fashion Photography', 'Portrait', 'Lighting', 'Photoshop', 'Lightroom'],
            portfolioLinks: ['https://sarahjohnson.com'],
            profileImageUrl: '',
            isVerified: true,
            rating: 4.9,
            reviewCount: 42,
            totalProjects: 28
        },
        {
            id: '2',
            firstName: 'Michael',
            lastName: 'Chen',
            email: 'michael.chen@example.com',
            bio: 'Creative director and brand identity specialist with expertise in developing compelling visual identities for tech startups and established brands.',
            location: 'San Francisco, CA',
            hourlyRate: 85,
            skills: ['Brand Identity', 'Logo Design', 'Typography', 'UI/UX Design', 'Illustration'],
            portfolioLinks: ['https://michaelchen.design'],
            profileImageUrl: '',
            isVerified: true,
            rating: 4.8,
            reviewCount: 36,
            totalProjects: 22
        },
        {
            id: '3',
            firstName: 'Emma',
            lastName: 'Rodriguez',
            email: 'emma.rodriguez@example.com',
            bio: 'Professional copywriter specializing in SaaS and tech marketing. Creating compelling content that drives engagement and conversions.',
            location: 'Austin, TX',
            hourlyRate: 65,
            skills: ['Copywriting', 'SaaS', 'Tech Marketing', 'Content Strategy', 'SEO'],
            portfolioLinks: ['https://emmarodriguez.com'],
            profileImageUrl: '',
            isVerified: true,
            rating: 4.7,
            reviewCount: 29,
            totalProjects: 18
        },
        {
            id: '4',
            firstName: 'David',
            lastName: 'Kim',
            email: 'david.kim@example.com',
            bio: 'Motion graphics artist and video editor with expertise in creating engaging animated content for brands and digital platforms.',
            location: 'Los Angeles, CA',
            hourlyRate: 70,
            skills: ['Motion Graphics', 'Video Editing', 'Animation', 'After Effects', 'Premiere Pro'],
            portfolioLinks: ['https://davidkim.video'],
            profileImageUrl: '',
            isVerified: false,
            rating: 4.6,
            reviewCount: 24,
            totalProjects: 15
        },
        {
            id: '5',
            firstName: 'Lisa',
            lastName: 'Thompson',
            email: 'lisa.thompson@example.com',
            bio: 'Social media content creator and strategist helping brands build authentic connections with their audiences through compelling visual storytelling.',
            location: 'Chicago, IL',
            hourlyRate: 55,
            skills: ['Social Media', 'Content Creation', 'Photography', 'Instagram', 'TikTok'],
            portfolioLinks: ['https://lisathompson.social'],
            profileImageUrl: '',
            isVerified: true,
            rating: 4.8,
            reviewCount: 31,
            totalProjects: 25
        },
        {
            id: '6',
            firstName: 'James',
            lastName: 'Wilson',
            email: 'james.wilson@example.com',
            bio: 'Full-stack developer with expertise in building scalable web applications and e-commerce platforms using modern technologies.',
            location: 'Seattle, WA',
            hourlyRate: 95,
            skills: ['React', 'Node.js', 'JavaScript', 'Python', 'E-commerce'],
            portfolioLinks: ['https://jameswilson.dev'],
            profileImageUrl: '',
            isVerified: true,
            rating: 4.9,
            reviewCount: 38,
            totalProjects: 32
        }
    ]

    // Simulate loading
    setTimeout(() => {
        setCreatives(mockCreatives)
        setLoading(false)
    }, 500)

    const filteredCreatives = creatives.filter(creative => {
        const matchesSearch = creative.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            creative.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            creative.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            creative.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesSkill = filterSkill === 'all' || creative.skills?.includes(filterSkill)
        const matchesLocation = filterLocation === 'all' || creative.location?.includes(filterLocation)

        return matchesSearch && matchesSkill && matchesLocation
    })

    // Get all unique skills for filter dropdown
    const allSkills = Array.from(new Set(creatives.flatMap(creative => creative.skills || []))).sort()

    // Get all unique locations for filter dropdown
    const allLocations = Array.from(new Set(creatives.map(creative => creative.location || ''))).filter(Boolean).sort()

    if (loading) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search creatives...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading creatives..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search creatives...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Creatives</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={() => {
                                setCreatives(mockCreatives)
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
        <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search creatives...">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Find Creative Talent</h1>
                    <p className="text-neutral-600 mt-2">
                        Discover and connect with top creative professionals
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search creatives by name, skills, or bio..."
                                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={filterSkill}
                                onChange={(e) => setFilterSkill(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            >
                                <option value="all">All Skills</option>
                                {allSkills.map((skill) => (
                                    <option key={skill} value={skill}>
                                        {skill}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={filterLocation}
                                onChange={(e) => setFilterLocation(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            >
                                <option value="all">All Locations</option>
                                {allLocations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <ErrorBoundary>
                    {filteredCreatives.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCreatives.map((creative) => (
                                <div key={creative.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {creative.profileImageUrl ? (
                                                    <Image
                                                        src={creative.profileImageUrl}
                                                        alt={`${creative.firstName} ${creative.lastName}`}
                                                        width={64}
                                                        height={64}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-full bg-beacon-purple flex items-center justify-center text-white font-bold text-xl">
                                                        {creative.firstName.charAt(0)}{creative.lastName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center">
                                                    <h3 className="text-lg font-semibold text-neutral-900">
                                                        {creative.firstName} {creative.lastName}
                                                    </h3>
                                                    {creative.isVerified && (
                                                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                {creative.location && (
                                                    <div className="flex items-center mt-1 text-sm text-neutral-600">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        <span>{creative.location}</span>
                                                    </div>
                                                )}
                                                {creative.hourlyRate && (
                                                    <p className="mt-1 text-sm font-medium text-neutral-900">
                                                        {formatCurrency(creative.hourlyRate)}/hr
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {creative.bio && (
                                            <p className="mt-4 text-neutral-700 text-sm line-clamp-3">
                                                {creative.bio}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-1 mt-4">
                                            {creative.skills?.slice(0, 3).map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-beacon-purple-light/20 text-beacon-purple"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {creative.skills && creative.skills.length > 3 && (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                    +{creative.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-6">
                                            <div className="flex items-center">
                                                {creative.rating && (
                                                    <div className="flex items-center">
                                                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                                                        <span className="ml-1 text-sm font-medium text-neutral-900">
                                                            {creative.rating}
                                                        </span>
                                                        <span className="ml-1 text-sm text-neutral-600">
                                                            ({creative.reviewCount})
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button variant="primary" size="sm">
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <User className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Creatives Found</h3>
                            <p className="text-neutral-600 mb-6">
                                {searchQuery || filterSkill !== 'all' || filterLocation !== 'all'
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'There are currently no creatives matching your criteria.'}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-3">
                                <Button variant="primary" onClick={() => {
                                    setSearchQuery('')
                                    setFilterSkill('all')
                                    setFilterLocation('all')
                                }}>
                                    Clear Filters
                                </Button>
                                <Button variant="outline">
                                    Post a Project
                                </Button>
                            </div>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </SimplifiedLayout>
    )
}