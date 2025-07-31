'use client'

import Button from '@/components/ui/Button'
import { formatCurrency, formatDate, truncateString } from '@/lib/utils'
import { Calendar, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'

export interface ProjectCardProps {
    id: string
    title: string
    description: string
    category: string
    budgetMin: number
    budgetMax: number
    timelineWeeks: number
    applicationsCount: number
    skills: string[]
    createdAt: string
    clientId: string
    clientName?: string
    clientAvatar?: string
    status?: 'active' | 'hired' | 'completed' | 'cancelled'
    isApplied?: boolean
}

export default function ProjectCard({
    id,
    title,
    description,
    category,
    budgetMin,
    budgetMax,
    timelineWeeks,
    applicationsCount,
    skills,
    createdAt,
    clientId,
    clientName,
    clientAvatar,
    status = 'active',
    isApplied = false,
}: ProjectCardProps) {
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        hired: 'bg-blue-100 text-blue-800',
        completed: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
                    >
                        {category}
                    </span>

                    {status !== 'active' && (
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    )}
                </div>

                <Link href={`/projects/${id}`} className="block group">
                    <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-beacon-blue transition-colors mb-2">
                        {title}
                    </h3>
                    <p className="text-neutral-600 mb-4">{truncateString(description, 150)}</p>
                </Link>

                <div className="flex flex-wrap gap-2 mb-4">
                    {skills.slice(0, 3).map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800"
                        >
                            {skill}
                        </span>
                    ))}
                    {skills.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                            +{skills.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>
                            {formatCurrency(budgetMin)} - {formatCurrency(budgetMax)}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>{timelineWeeks} {timelineWeeks === 1 ? 'week' : 'weeks'}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-neutral-500" />
                        <span>{applicationsCount} {applicationsCount === 1 ? 'application' : 'applications'}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="text-sm text-neutral-500">
                        Posted {formatDate(createdAt, { month: 'short', day: 'numeric' })}
                    </div>

                    {status === 'active' ? (
                        <Button
                            variant={isApplied ? 'secondary' : 'primary'}
                            size="sm"
                            disabled={isApplied}
                        >
                            {isApplied ? 'Applied' : 'View Details'}
                        </Button>
                    ) : (
                        <Button variant="secondary" size="sm">
                            View Project
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
