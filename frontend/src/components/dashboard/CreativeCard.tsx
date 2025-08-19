'use client'

import AnimatedCard from '@/components/ui/AnimatedCard'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'
import { DollarSign, ExternalLink, MapPin, Star } from 'lucide-react'
import Image from 'next/image'

interface CreativeCardProps {
    id: string
    first_name: string
    last_name: string
    email?: string // Made optional since it's not being used
    bio?: string
    location?: string
    hourly_rate?: number
    skills?: string[]
    portfolio_links?: string[]
    profile_image_url?: string
    is_verified: boolean
    featured?: boolean
    creative_type?: string
    onContact?: (creativeId: string) => void
    onViewProfile?: (creativeId: string) => void
    className?: string
}

export default function CreativeCard({
    id,
    first_name,
    last_name,
    bio,
    location,
    hourly_rate,
    skills = [],
    portfolio_links = [],
    profile_image_url,
    is_verified,
    featured = false,
    creative_type,
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
        >
            <AnimatedCard className={`border border-gray-200 p-4 relative rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col ${className}`}>
                {featured && (
                    <motion.span
                        className="absolute top-2 right-2 bg-beacon-purple text-white text-xs px-2 py-1 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                        Featured
                    </motion.span>
                )}

                {/* Profile Section */}
                <div className="text-center mb-3">
                    {profile_image_url ? (
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Image
                                src={profile_image_url}
                                alt={fullName}
                                width={64}
                                height={64}
                                className="rounded-full mx-auto mb-2 object-cover"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            className="w-16 h-16 bg-beacon-purple rounded-full mx-auto mb-2 flex items-center justify-center text-white font-semibold text-lg"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {initials}
                        </motion.div>
                    )}

                    <motion.h3
                        className="font-semibold text-gray-900 text-lg mb-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {fullName}
                    </motion.h3>

                    {/* creative_type display */}
                    {bio == null && creative_type && (
                        <p className="text-sm text-neutral-600 mb-1 text-center">{creative_type}</p>
                    )}

                    <div className="flex items-center justify-center mt-0.5">
                        {is_verified && (
                            <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 fill-current mr-0.5" />
                                <span className="text-sm text-gray-600">Verified</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio */}
                {bio && (
                    <p className="text-gray-600 text-sm text-center mb-3 line-clamp-3">
                        {bio}
                    </p>
                )}

                {/* Details */}
                <div className="space-y-1 mb-3">
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
                    <div className="mb-3">
                        <div className="flex flex-wrap gap-1 justify-center">
                            {skills.slice(0, 3).map((skill, index) => (
                                <motion.span
                                    key={skill}
                                    className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: index * 0.1 }}
                                >
                                    {skill}
                                </motion.span>
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
                    <div className="mb-3">
                        <div className="flex justify-center">
                            <motion.a
                                href={portfolio_links[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-beacon-purple hover:text-purple-700 text-sm"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Portfolio
                            </motion.a>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 mt-auto">
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-beacon-purple hover:bg-beacon-purple-dark text-white rounded-lg py-2 shadow-sm"
                        onClick={handleViewProfile}
                    >
                        View Profile
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-beacon-purple text-beacon-purple hover:bg-purple-50 rounded-lg py-2"
                        onClick={handleContact}
                    >
                        Send Message
                    </Button>
                </div>
            </AnimatedCard>
        </motion.div>
    )
}