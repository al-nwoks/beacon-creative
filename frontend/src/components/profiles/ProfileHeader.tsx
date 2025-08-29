'use client'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import RatingDisplay from '@/components/ui/RatingDisplay'
import StatCard from '@/components/ui/StatCard'
import { cn } from '@/lib/utils'
import { MapPin, Settings, Share } from 'lucide-react'

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
    className
}: ProfileHeaderProps) {
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
                    <Avatar
                        src={profileImage}
                        alt={name}
                        size="xl"
                        fallback={name.charAt(0)}
                    />
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
        </div>
    )
}