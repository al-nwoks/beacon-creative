'use client'

import AnimatedCard from '@/components/ui/AnimatedCard'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { DollarSign, ExternalLink, MapPin, Star } from 'lucide-react'

interface CreativeCardProps {
    id: string
    first_name: string
    last_name: string
    email: string
    bio?: string
    location?: string
    hourly_rate?: number
    skills?: string[]
    portfolio_links?: string[]
    profile_image_url?: string
    is_verified: boolean
    featured?: boolean
    onContact?: (creativeId: string) => void
    onViewProfile?: (creativeId: string) => void
    className?: string
}

export default function CreativeCard({
    id,
    first_name,
    last_name,
    email,
    bio,
    location,
    hourly_rate,
    skills = [],
    portfolio_links = [],
    profile_image_url,
    is_verified,
    featured = false,
    onContact,
    onViewProfile,
    className = ""
}: CreativeCardProps) {
    const fullName = `${first_name} ${last_name}`
    const initials = `${first_name[0]}${last_name[0]}`

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
        <AnimatedCard className={`border border-gray-200 p-6 relative ${className}`}>
            {featured && (
                <span className="absolute top-3 right-3 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                </span>
            )}

            {/* Profile Section */}
            <div className="text-center mb-4">
                {profile_image_url ? (
                    <img
                        src={profile_image_url}
                        alt={fullName}
                        className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-semibold text-lg">
                        {initials}
                    </div>
                )}

                <h3 className="font-semibold text-gray-900 text-lg">{fullName}</h3>

                <div className="flex items-center justify-center mt-1">
                    {is_verified && (
                        <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="text-sm text-gray-600">Verified</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bio */}
            {bio && (
                <p className="text-gray-600 text-sm text-center mb-4 line-clamp-3">
                    {bio}
                </p>
            )}

            {/* Details */}
            <div className="space-y-2 mb-4">
                {location && (
                    <div className="flex items-center justify-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{location}</span>
                    </div>
                )}

                {hourly_rate && (
                    <div className="flex items-center justify-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{formatCurrency(hourly_rate)}/hr</span>
                    </div>
                )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                        {skills.slice(0, 3).map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                        {skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{skills.length - 3}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Portfolio Links */}
            {portfolio_links.length > 0 && (
                <div className="mb-4">
                    <div className="flex justify-center">
                        <a
                            href={portfolio_links[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-600 hover:text-purple-700 text-sm"
                        >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Portfolio
                        </a>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
                <Button
                    variant="default"
                    size="sm"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={handleViewProfile}
                >
                    View Profile
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                    onClick={handleContact}
                >
                    Send Message
                </Button>
            </div>
        </AnimatedCard>
    )
}