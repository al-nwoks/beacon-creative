'use client'

import AnimatedCard from '@/components/ui/AnimatedCard'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Clock, DollarSign, MapPin } from 'lucide-react'

interface JobCardProps {
    id: string
    title: string
    company: string
    description: string
    location?: string
    budget_min?: number
    budget_max?: number
    timeline_weeks?: number
    required_skills?: string[]
    deadline?: string
    created_at: string
    onApply?: (jobId: string) => void
    showApplyButton?: boolean
    className?: string
}

export default function JobCard({
    id,
    title,
    company,
    description,
    location,
    budget_min,
    budget_max,
    timeline_weeks,
    required_skills = [],
    deadline,
    created_at,
    onApply,
    showApplyButton = true,
    className = ""
}: JobCardProps) {
    const getBudgetDisplay = () => {
        if (budget_min && budget_max) {
            return `${formatCurrency(budget_min)}-${formatCurrency(budget_max)}`
        } else if (budget_min) {
            return `From ${formatCurrency(budget_min)}`
        } else if (budget_max) {
            return `Up to ${formatCurrency(budget_max)}`
        }
        return 'Budget TBD'
    }

    const getDaysAgo = () => {
        const date = new Date(created_at)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return '1 day ago'
        return `${diffDays} days ago`
    }

    const handleApply = () => {
        if (onApply) {
            onApply(id)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
        >
            <AnimatedCard className={`border border-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col ${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="col-span-1">
                        <motion.h3
                            className="text-lg font-semibold text-gray-900 mb-0.5"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            {title}
                        </motion.h3>
                        <p className="text-gray-600 text-sm">{company}</p>
                    </div>
                </div>

                <p className="text-gray-700 mb-3 line-clamp-2">{description}</p>

                {required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {required_skills.slice(0, 3).map((skill, index) => (
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
                        {required_skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{required_skills.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                        {location && (
                            <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{location}</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{getBudgetDisplay()}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{deadline ? `Deadline: ${deadline}` : `Posted: ${getDaysAgo()}`}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    {showApplyButton && (
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                className="w-full bg-beacon-purple hover:bg-purple-700 text-white"
                                size="lg"
                                onClick={handleApply}
                            >
                                Apply Now
                            </Button>
                        </motion.div>
                    )}
                </div>
            </AnimatedCard>
        </motion.div>
    )
}