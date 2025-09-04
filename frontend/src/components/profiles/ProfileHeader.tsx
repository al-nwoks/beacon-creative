'use client'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import RatingDisplay from '@/components/ui/RatingDisplay'
import StatCard from '@/components/ui/StatCard'
import { clientFetcher } from '@/lib/api'
import { cn } from '@/lib/utils'
import { MapPin, Settings, Share } from 'lucide-react'
import { useRef, useState } from 'react'

interface ProfileHeaderProps {
    name: string
    title: string
    location: string
    rating: number
    profileImage?: string
    stats: {
        projects: number
        followers: string
        reviews: number
    }
    onEditProfile?: () => void
    onConnectInstagram?: () => void
    onShare?: () => void
    onAvatarUpdate?: (newAvatarUrl: string) => void
    className?: string
}

export default function ProfileHeader({
    name,
    title,
    location,
    rating,
    profileImage,
    stats,
    onEditProfile,
    onConnectInstagram,
    onShare,
    onAvatarUpdate,
    className
}: ProfileHeaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleAvatarChange = () => {
        // Create a temporary file input for avatar
        fileInputRef.current?.click()
    }

    const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Reset file input
        event.target.value = ''

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            // Use clientFetcher for the API call
            const response = await clientFetcher('/api/users/upload-avatar', {
                method: 'POST',
                body: formData as any,
                headers: {
                    // Remove Content-Type to let the browser set it with proper boundary
                }
            })

            // Update the avatar in the parent component
            if (response.profile_image_url && onAvatarUpdate) {
                onAvatarUpdate(response.profile_image_url)
            }
        } catch (err) {
            console.error('Failed to upload avatar', err)
            // Try to extract error message from the error object
            let errorMessage = 'Failed to upload avatar. Please try again.'
            if (err instanceof Error) {
                // If it's an error with a message from our API
                if ((err as any).data?.message) {
                    errorMessage = (err as any).data.message
                } else if ((err as any).data?.detail) {
                    errorMessage = (err as any).data.detail
                } else if ((err as any).data) {
                    // If data is an object, try to stringify it
                    try {
                        errorMessage = JSON.stringify((err as any).data, null, 2)
                    } catch (e) {
                        errorMessage = err.message
                    }
                } else {
                    errorMessage = err.message
                }
            } else if (typeof err === 'object' && err !== null) {
                // Handle case where err is an object but not an Error instance
                try {
                    errorMessage = JSON.stringify(err, null, 2)
                } catch (e) {
                    errorMessage = 'Failed to upload avatar. Please try again.'
                }
            }
            alert(`Avatar upload failed: ${errorMessage}`)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className={cn('relative', className)}>
            {/* Purple gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-t-lg" />

            {/* Top action buttons */}
            <div className="relative flex justify-end p-4 space-x-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={onShare}
                >
                    <Share className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                    <Settings className="h-5 w-5" />
                </Button>
            </div>

            {/* Profile content */}
            <div className="relative px-6 pb-8">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <Avatar
                            src={profileImage}
                            alt={name}
                            size="xl"
                            fallback={name.charAt(0)}
                        />
                        <button
                            onClick={handleAvatarChange}
                            disabled={isUploading}
                            className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1 text-white hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {isUploading ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* BEACON Logo */}
                <div className="text-center mb-4">
                    <div className="text-white font-bold text-lg tracking-wider">
                        B3ACON
                    </div>
                </div>

                {/* Name and title */}
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {name}
                    </h1>
                    <p className="text-purple-100 text-lg">
                        {title}
                    </p>
                </div>

                {/* Location and rating */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="flex items-center text-purple-100">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{location}</span>
                    </div>
                    <div className="text-purple-100">•</div>
                    <RatingDisplay
                        rating={rating}
                        size="sm"
                        className="text-purple-100"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 mb-6">
                    <Button
                        variant="outline"
                        className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                        onClick={onEditProfile}
                    >
                        ✏️ Edit Profile
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={onConnectInstagram}
                    >
                        📷 Connect Instagram
                    </Button>
                </div>

                {/* Stats */}
                <div className="flex justify-center space-x-8">
                    <StatCard
                        value={stats.projects}
                        label="Projects"
                        className="text-white"
                    />
                    <StatCard
                        value={stats.followers}
                        label="Followers"
                        className="text-white"
                    />
                    <StatCard
                        value={stats.reviews}
                        label="Reviews"
                        className="text-white"
                    />
                </div>
            </div>

            {/* Hidden file input for avatar uploads */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarFileChange}
                disabled={isUploading}
            />
        </div>
    )
}