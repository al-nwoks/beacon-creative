'use client'

import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Check, Clock, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

export interface ProfileCardProps {
    id: string
    firstName: string
    lastName: string
    profileImage?: string
    userType: 'creative' | 'client'
    title?: string
    bio?: string
    hourlyRate?: number
    location?: string
    skills?: string[]
    rating?: number
    reviewCount?: number
    isVerified?: boolean
    isAvailable?: boolean
    portfolioLinks?: string[]
}

export default function ProfileCard({
    id,
    firstName,
    lastName,
    profileImage,
    userType,
    title,
    bio,
    hourlyRate,
    location,
    skills = [],
    rating = 0,
    reviewCount = 0,
    isVerified = false,
    isAvailable = true,
    portfolioLinks = [],
}: ProfileCardProps) {
    const fullName = `${firstName} ${lastName}`
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`

    return (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                    {/* Profile Image or Initials */}
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={fullName}
                            className="w-20 h-20 rounded-full object-cover mb-3"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-beacon-blue text-white flex items-center justify-center text-xl font-semibold mb-3">
                            {initials}
                        </div>
                    )}

                    {/* Verification Badge */}
                    {isVerified && (
                        <div className="absolute mt-16 ml-16">
                            <div className="bg-beacon-blue text-white rounded-full p-1">
                                <Check className="h-4 w-4" />
                            </div>
                        </div>
                    )}

                    {/* Name and Title */}
                    <h3 className="text-xl font-semibold text-neutral-900 mb-1">{fullName}</h3>

                    <div className="flex items-center text-sm text-neutral-600 mb-2">
                        {title && <span>{title}</span>}

                        {title && userType === 'creative' && (
                            <>
                                <span className="mx-2">•</span>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                    <span>
                                        {rating.toFixed(1)} ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Bio */}
                    {bio && (
                        <p className="text-center text-neutral-600 mb-4 text-sm">
                            "{bio}"
                        </p>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-wrap justify-center gap-3 mb-4 text-sm">
                    {hourlyRate !== undefined && (
                        <div className="flex items-center text-neutral-700">
                            <span className="font-medium mr-1">💰</span>
                            <span>{formatCurrency(hourlyRate)}/hr</span>
                        </div>
                    )}

                    {location && (
                        <div className="flex items-center text-neutral-700">
                            <MapPin className="h-4 w-4 mr-1 text-neutral-500" />
                            <span>{location}</span>
                        </div>
                    )}

                    {userType === 'creative' && (
                        <div className="flex items-center text-neutral-700">
                            <Clock className="h-4 w-4 mr-1 text-neutral-500" />
                            <span className={isAvailable ? 'text-green-600' : 'text-red-600'}>
                                {isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {skills.slice(0, 4).map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                            >
                                {skill}
                            </span>
                        ))}
                        {skills.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                +{skills.length - 4} more
                            </span>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <Link href={`/profiles/${id}`} className="flex-1">
                        <Button variant="primary" fullWidth={true} size="sm">
                            View Profile
                        </Button>
                    </Link>

                    <Link href={`/messages/new?recipient=${id}`} className="flex-1">
                        <Button variant="secondary" fullWidth={true} size="sm">
                            Message
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}