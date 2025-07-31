'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
    color?: 'purple' | 'blue' | 'neutral'
}

export function LoadingSpinner({
    className = '',
    size = 'md',
    color = 'purple'
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    const colorClasses = {
        purple: 'border-beacon-purple border-t-beacon-purple-light',
        blue: 'border-beacon-blue border-t-beacon-blue-light',
        neutral: 'border-neutral-400 border-t-neutral-200'
    }

    return (
        <motion.div
            className={cn(
                'rounded-full border-2 border-solid border-r-transparent animate-spin',
                sizeClasses[size],
                colorClasses[color],
                className
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        />
    )
}