'use client'

import ProfileContent from '@/components/profiles/ProfileContent'
import ProfileEditModal from '@/components/profiles/ProfileEditModal'
import ProfileHeader from '@/components/profiles/ProfileHeader'
import type { User } from '@/types/api'
import { useEffect, useState } from 'react'

interface ProfileClientWrapperProps {
    initialUser: User
}

export default function ProfileClientWrapper({ initialUser }: ProfileClientWrapperProps) {
    const [user, setUser] = useState<User>(initialUser)
    const [portfolioImages, setPortfolioImages] = useState<Array<{ id: string, src: string, alt: string }>>([])
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

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
        setIsEditModalOpen(true)
    }

    const handleSaveProfile = (updatedUser: User) => {
        setUser(updatedUser)

        // Update portfolio images if they changed
        if (updatedUser.portfolio_images !== user.portfolio_images) {
            const images = updatedUser.portfolio_images?.map((src, index) => ({
                id: index.toString(),
                src,
                alt: `Portfolio image ${index + 1}`
            })) || []
            setPortfolioImages(images)
        }
    }

    const handleConnectInstagram = () => {
        // For now, show an alert that this feature is not implemented
        alert('Instagram connection feature is not implemented yet. This would require integration with Instagram API in a production environment.')
    }

    const handleShare = () => {
        // Create a shareable URL for the profile
        const profileUrl = `${window.location.origin}/creatives/${user.id}`

        // Use the Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: `${user.first_name} ${user.last_name} - B3ACON Creative Profile`,
                text: user.bio || `Check out ${user.first_name}'s profile on B3ACON Creative Connect`,
                url: profileUrl,
            }).catch((error) => {
                console.log('Error sharing:', error)
                // Fallback to copying URL
                copyToClipboard(profileUrl)
            })
        } else {
            // Fallback to copying URL
            copyToClipboard(profileUrl)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Profile URL copied to clipboard!')
        }).catch((err) => {
            console.error('Failed to copy: ', err)
            // Fallback prompt
            prompt('Copy this link to share:', text)
        })
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
                    gigs: user.gigs_count || 0,
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

            <ProfileEditModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProfile}
            />
        </>
    )
}