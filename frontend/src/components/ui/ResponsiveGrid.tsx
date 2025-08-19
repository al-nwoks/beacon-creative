'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ResponsiveGridProps {
    children: ReactNode
    className?: string
    cols?: {
        xs?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
        xxl?: number
    }
    gap?: string
}

export function ResponsiveGrid({
    children,
    className = '',
    cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 },
    gap = 'gap-6'
}: ResponsiveGridProps) {
    const getGridClasses = () => {
        const classes: string[] = []

        // Base classes for grid
        classes.push('grid')

        // Add responsive grid classes
        if (cols.xs === 1) classes.push('grid-cols-1')
        if (cols.xs === 2) classes.push('grid-cols-2')
        if (cols.xs === 3) classes.push('grid-cols-3')
        if (cols.xs === 4) classes.push('grid-cols-4')
        if (cols.xs === 5) classes.push('grid-cols-5')
        if (cols.xs === 6) classes.push('grid-cols-6')

        if (cols.sm === 1) classes.push('sm:grid-cols-1')
        if (cols.sm === 2) classes.push('sm:grid-cols-2')
        if (cols.sm === 3) classes.push('sm:grid-cols-3')
        if (cols.sm === 4) classes.push('sm:grid-cols-4')
        if (cols.sm === 5) classes.push('sm:grid-cols-5')
        if (cols.sm === 6) classes.push('sm:grid-cols-6')

        if (cols.md === 1) classes.push('md:grid-cols-1')
        if (cols.md === 2) classes.push('md:grid-cols-2')
        if (cols.md === 3) classes.push('md:grid-cols-3')
        if (cols.md === 4) classes.push('md:grid-cols-4')
        if (cols.md === 5) classes.push('md:grid-cols-5')
        if (cols.md === 6) classes.push('md:grid-cols-6')

        if (cols.lg === 1) classes.push('lg:grid-cols-1')
        if (cols.lg === 2) classes.push('lg:grid-cols-2')
        if (cols.lg === 3) classes.push('lg:grid-cols-3')
        if (cols.lg === 4) classes.push('lg:grid-cols-4')
        if (cols.lg === 5) classes.push('lg:grid-cols-5')
        if (cols.lg === 6) classes.push('lg:grid-cols-6')

        if (cols.xl === 1) classes.push('xl:grid-cols-1')
        if (cols.xl === 2) classes.push('xl:grid-cols-2')
        if (cols.xl === 3) classes.push('xl:grid-cols-3')
        if (cols.xl === 4) classes.push('xl:grid-cols-4')
        if (cols.xl === 5) classes.push('xl:grid-cols-5')
        if (cols.xl === 6) classes.push('xl:grid-cols-6')

        if (cols.xxl === 1) classes.push('2xl:grid-cols-1')
        if (cols.xxl === 2) classes.push('2xl:grid-cols-2')
        if (cols.xxl === 3) classes.push('2xl:grid-cols-3')
        if (cols.xxl === 4) classes.push('2xl:grid-cols-4')
        if (cols.xxl === 5) classes.push('2xl:grid-cols-5')
        if (cols.xxl === 6) classes.push('2xl:grid-cols-6')

        return classes.join(' ')
    }

    return (
        <div className={cn(
            getGridClasses(),
            gap,
            className
        )}>
            {children}
        </div>
    )
}