'use client'

import AnimatedCard from '@/components/ui/AnimatedCard'
import Button from '@/components/ui/Button'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
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
    isLoading?: boolean
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
    isLoading = false
}: ProjectCardProps) {
    const statusColors = {
        active: 'bg-green-100 text-green-800',
        hired: 'bg-blue-100 text-blue-800',
        completed: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden h-full flex flex-col">
                <div className="p-6 flex-grow">
                    <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                        <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
                        {status !== 'active' && (
                            <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
                        )}
                    </div>
                    <div className="h-6 w-3/4 bg-neutral-200 rounded animate-pulse mb-2" />
                    <div className="h-16 w-full bg-neutral-200 rounded animate-pulse mb-4" />
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="h-6 w-16 bg-neutral-200 rounded-full animate-pulse" />
                        <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
                        <div className="h-6 w-16 bg-neutral-200 rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-4">
                        <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-4 w-28 bg-neutral-200 rounded animate-pulse" />
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <div className="flex flex-wrap items-center justify-between pt-4 border-t border-neutral-100 gap-2">
                        <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
                        <div className="h-8 w-24 bg-neutral-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ErrorBoundary>
            <AnimatedCard className="rounded-lg shadow-sm border border-neutral-200 overflow-hidden h-full flex flex-col">
                <div className="p-6 flex-grow">
                    <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
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
                </div>

                <div className="px-6 pb-6">
                    <div className="flex flex-wrap items-center justify-between pt-4 border-t border-neutral-100 gap-2">
                        <div className="text-sm text-neutral-500">
                            Posted {formatDate(createdAt, { month: 'short', day: 'numeric' })}
                        </div>

                        {status === 'active' ? (
                            <Button
                                variant={isApplied ? 'secondary' : 'primary'}
                                size="sm"
                                disabled={isApplied}
                                className="whitespace-nowrap"
                            >
                                {isApplied ? 'Applied' : 'View Details'}
                            </Button>
                        ) : (
                            <Button variant="secondary" size="sm" className="whitespace-nowrap">
                                View Project
                            </Button>
                        )}
                    </div>
                </div>
            </AnimatedCard>
        </ErrorBoundary>
    )
}