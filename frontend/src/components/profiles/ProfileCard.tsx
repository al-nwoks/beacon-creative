'use client'

import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { MapPin, Star } from 'lucide-react'
import Image from 'next/image'

interface ProfileCardProps {
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
    onContact?: (id: string) => void
    onViewProfile?: (id: string) => void
    className?: string
}

export default function ProfileCard({
    id,
    firstName,
    lastName,
    email,
    bio,
    location,
    hourlyRate,
    skills = [],
    profileImageUrl,
    isVerified,
    rating,
    reviewCount,
    onContact,
    onViewProfile,
    className = ''
}: ProfileCardProps) {
    const fullName = `${firstName} ${lastName}`
    const initials = `${firstName[0]}${lastName[0]}`

    const handleContact = () => {
        if (onContact) {
            onContact(id)
        }
    }

    const handleViewProfile = () => {
        if (onViewProfile) {
            onViewProfile(id)
        }
    }

    return (
        <div className={`bg-white rounded-xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
            <div className="flex items-start mb-4">
                {profileImageUrl ? (
                    <Image
                        src={profileImageUrl}
                        alt={fullName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover mr-4"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-beacon-purple flex items-center justify-center text-white font-semibold mr-4">
                        {initials}
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex items-center">
                        <h3 className="font-semibold text-neutral-900">{fullName}</h3>
                        {isVerified && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current ml-1" />
                        )}
                    </div>
                    {location && (
                        <div className="flex items-center text-sm text-neutral-600 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{location}</span>
                        </div>
                    )}
                </div>
            </div>

            {bio && (
                <p className="text-neutral-700 text-sm mb-4 line-clamp-2">
                    {bio}
                </p>
            )}

            {hourlyRate && (
                <div className="mb-4">
                    <span className="text-lg font-semibold text-neutral-900">
                        {formatCurrency(hourlyRate)}
                    </span>
                    <span className="text-neutral-600 text-sm ml-1">/hr</span>
                </div>
            )}

            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {skills.slice(0, 3).map((skill, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                    {skills.length > 3 && (
                        <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                            +{skills.length - 3}
                        </span>
                    )}
                </div>
            )}

            {rating && reviewCount && (
                <div className="flex items-center mb-4">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-neutral-600 ml-2">
                        {rating} ({reviewCount})
                    </span>
                </div>
            )}

            <div className="flex space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleContact}
                >
                    Contact
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={handleViewProfile}
                >
                    View Profile
                </Button>
            </div>
        </div>
    )
}