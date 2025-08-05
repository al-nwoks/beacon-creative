'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Camera, CheckCircle, MapPin, Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface UserProfile {
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
    joinDate: string
    languages?: string[]
    userType: 'creative' | 'client'
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()

    // Mock data for demonstration
    const mockProfile: UserProfile = {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        bio: 'Passionate fashion photographer with 8+ years of experience. Specializing in editorial and commercial photography with a focus on storytelling through visuals. I believe in capturing the essence of each project and creating images that resonate with the audience.',
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
        languages: ['English', 'French'],
        userType: 'creative'
    }

    // Simulate loading
    setTimeout(() => {
        setProfile(mockProfile)
        setLoading(false)
    }, 500)

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            // In a real implementation, this would call the API
            // await usersAPI.uploadAvatar(file)

            // Update profile with new avatar URL
            if (profile) {
                setProfile({
                    ...profile,
                    profileImageUrl: URL.createObjectURL(file)
                })
            }

            showNotification('Profile picture updated successfully!', 'success')
        } catch (err) {
            console.error('Error uploading avatar:', err)
            showNotification('Failed to update profile picture. Please try again.', 'error')
        }
    }

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search...">
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
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Profile</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={() => {
                                setProfile(mockProfile)
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

    if (!profile) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">Profile Not Found</h3>
                        <p className="text-neutral-600">There was an issue loading your profile.</p>
                        <Button variant="primary" className="mt-6" onClick={() => {
                            setProfile(mockProfile)
                            setLoading(false)
                        }}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search...">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-beacon-purple to-beacon-purple-dark p-6 text-white">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex-shrink-0 relative">
                                    <div className="relative">
                                        {profile.profileImageUrl ? (
                                            <Image
                                                src={profile.profileImageUrl}
                                                alt={`${profile.firstName} ${profile.lastName}`}
                                                width={96}
                                                height={96}
                                                className="rounded-full object-cover border-4 border-white/20"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-3xl border-4 border-white/20">
                                                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                                            </div>
                                        )}
                                        <label className="absolute bottom-0 right-0 bg-beacon-purple rounded-full p-2 cursor-pointer hover:bg-beacon-purple-dark transition-colors">
                                            <Camera className="h-4 w-4 text-white" />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleUploadAvatar}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="flex items-center">
                                                <h1 className="text-2xl font-bold">
                                                    {profile.firstName} {profile.lastName}
                                                </h1>
                                                {profile.isVerified && (
                                                    <CheckCircle className="h-6 w-6 text-green-400 ml-2" />
                                                )}
                                            </div>
                                            {profile.location && (
                                                <div className="flex items-center mt-2 text-purple-100">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    <span>{profile.location}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 md:mt-0">
                                            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                                                Edit Profile
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
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-neutral-900">About</h2>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                        <div className="prose max-w-none">
                                            <p className="text-neutral-700 whitespace-pre-line">
                                                {profile.bio}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-neutral-900">Skills</h2>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills?.map((skill, index) => (
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
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-neutral-900">Portfolio</h2>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((item) => (
                                                <div key={item} className="bg-neutral-100 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                                                    <span className="text-neutral-500">Portfolio Item {item}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {profile.portfolioLinks && profile.portfolioLinks.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="text-sm font-medium text-neutral-700 mb-2">External Links</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.portfolioLinks.map((link, index) => (
                                                        <a
                                                            key={index}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                                                        >
                                                            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                            {link.replace('https://', '').replace('http://', '').split('/')[0]}
                                                        </a>
                                                    ))}
                                                </div>
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
                                                <span className="font-medium text-neutral-900">{profile.totalProjects}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-600">Rating</span>
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 fill-current text-yellow-400 mr-1" />
                                                    <span className="font-medium text-neutral-900">
                                                        {profile.rating} ({profile.reviewCount} reviews)
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-neutral-600">Member Since</span>
                                                <span className="font-medium text-neutral-900">
                                                    {formatDate(profile.joinDate, { month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rate */}
                                    <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-semibold text-neutral-900">Rate</h2>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                        <div className="text-center">
                                            {profile.hourlyRate ? (
                                                <>
                                                    <p className="text-3xl font-bold text-neutral-900">
                                                        {formatCurrency(profile.hourlyRate)}
                                                    </p>
                                                    <p className="text-neutral-600 mt-1">per hour</p>
                                                </>
                                            ) : (
                                                <p className="text-neutral-600">Rate not specified</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Languages */}
                                    {profile.languages && profile.languages.length > 0 && (
                                        <div className="bg-white rounded-lg border border-neutral-200 p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-lg font-semibold text-neutral-900">Languages</h2>
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.languages.map((language, index) => (
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
                                        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Contact Information</h2>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-neutral-600">Email</p>
                                                <p className="font-medium text-neutral-900">{profile.email}</p>
                                            </div>
                                            {profile.location && (
                                                <div>
                                                    <p className="text-sm text-neutral-600">Location</p>
                                                    <p className="font-medium text-neutral-900">{profile.location}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SimplifiedLayout>
    )
}