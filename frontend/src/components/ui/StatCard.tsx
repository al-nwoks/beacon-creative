'use client'

import { cn } from '@/lib/utils'

interface StatCardProps {
    value: string | number
    label: string
    className?: string
}

export default function StatCard({ value, label, className }: StatCardProps) {
    return (
        <div className={cn('text-center', className)}>
            <div className="text-2xl font-bold text-gray-900">
                {value}
            </div>
            <div className="text-sm text-gray-600 mt-1">
                {label}
            </div>
        </div>
    )
}