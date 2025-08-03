'use client'

import AnimatedCard from '@/components/ui/AnimatedCard'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
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

    const getTimelineDisplay = () => {
        if (!timeline_weeks) return 'Timeline TBD'
        if (timeline_weeks === 1) return '1 week'
        return `${timeline_weeks} weeks`
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
        <AnimatedCard className={`border border-gray-200 p-6 ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-600">{company}</p>
                </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">{description}</p>

            {required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {required_skills.slice(0, 3).map((skill) => (
                        <span
                            key={skill}
                            className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                        >
                            {skill}
                        </span>
                    ))}
                    {required_skills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                            +{required_skills.length - 3} more
                        </span>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
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

            {showApplyButton && (
                <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                    onClick={handleApply}
                >
                    Apply Now
                </Button>
            )}
        </AnimatedCard>
    )
}