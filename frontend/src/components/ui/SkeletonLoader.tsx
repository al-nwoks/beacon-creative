'use client'

import { cn } from '@/lib/utils'
import { HTMLMotionProps, motion } from 'framer-motion'

interface SkeletonLoaderProps extends HTMLMotionProps<'div'> {
    className?: string
}

export function SkeletonLoader({ className, ...props }: SkeletonLoaderProps) {
    return (
        <motion.div
            className={cn('animate-pulse rounded-md bg-neutral-200', className)}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
            {...props}
        />
    )
}