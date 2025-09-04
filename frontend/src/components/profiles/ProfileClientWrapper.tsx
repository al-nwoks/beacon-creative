'use client'

import ProfileContent from '@/components/profiles/ProfileContent'
import ProfileHeader from '@/components/profiles/ProfileHeader'
import type { User } from '@/types/api'
import { useEffect, useState } from 'react'

interface ProfileClientWrapperProps {
    initialUser: User
}

export default function ProfileClientWrapper({ initialUser }: ProfileClientWrapperProps) {
    const [user, setUser] = useState<User>(initialUser)
    const [portfolioImages, setPortfolioImages] = useState<Array<{ id: string, src: string, alt: string }>>([])

    // Format followers count for display
    const formatFollowersCount = (count: number): string => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`
        }
        return count.toString()
    }

    // Convert portfolio images to the format expected by ImageGrid
    useEffect(() => {
        const images = user?.portfolio_images?.map((src, index) => ({
            id: index.toString(),
            src,
            alt: `Portfolio image ${index + 1}`
        })) || []
        setPortfolioImages(images)
    }, [user])

    const handleAvatarUpdate = (newAvatarUrl: string) => {
        setUser(prevUser => ({
            ...prevUser,
            profile_image_url: newAvatarUrl
        }))
    }

    const handlePortfolioUpdate = (newPortfolioImages: Array<{ id: string, src: string, alt: string }>) => {
        setPortfolioImages(newPortfolioImages)
        setUser(prevUser => ({
            ...prevUser,
            portfolio_images: newPortfolioImages.map(img => img.src)
        }))
    }

    const handleEditProfile = () => {
        // TODO: Implement edit profile functionality
        console.log('Edit profile clicked')
    }

    const handleConnectInstagram = () => {
        // TODO: Implement Instagram connection functionality
        console.log('Connect Instagram clicked')
    }

    const handleShare = () => {
        // TODO: Implement share functionality
        console.log('Share clicked')
    }

    return (
        <>
            <ProfileHeader
                name={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Your Name'}
                title={user.creative_type || user.bio?.split('.')[0] || 'Creative Professional'}
                location={user.location || 'Location TBD'}
                rating={user.rating || 0}
                profileImage={user.profile_image_url || undefined}
                stats={{
                    projects: user.projects_count || 0,
                    followers: formatFollowersCount(user.followers_count || 0),
                    reviews: user.reviews_count || 0
                }}
                onEditProfile={handleEditProfile}
                onConnectInstagram={handleConnectInstagram}
                onShare={handleShare}
                onAvatarUpdate={handleAvatarUpdate}
            />

            <ProfileContent
                portfolioImages={portfolioImages}
                onPortfolioUpdate={handlePortfolioUpdate}
            />
        </>
    )
}