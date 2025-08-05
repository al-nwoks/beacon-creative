'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ResponsiveContainerProps {
    children: ReactNode
    className?: string
    responsive?: boolean
}

export function ResponsiveContainer({
    children,
    className = '',
    responsive = true
}: ResponsiveContainerProps) {
    return (
        <div className={cn(
            'container mx-auto px-4',
            responsive && 'w-full max-w-7xl',
            className
        )}>
            {children}
        </div>
    )
}