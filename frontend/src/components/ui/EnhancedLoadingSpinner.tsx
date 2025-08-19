'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface EnhancedLoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    message?: string
    fullScreen?: boolean
}

export function EnhancedLoadingSpinner({
    size = 'md',
    className = '',
    message,
    fullScreen = false
}: EnhancedLoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    }

    const containerClasses = cn(
        'flex flex-col items-center justify-center',
        fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : '',
        className
    )

    return (
        <div className={containerClasses}>
            <motion.div
                className={cn(
                    sizeClasses[size],
                    'rounded-full border-4 border-beacon-purple border-t-transparent'
                )}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            {message && (
                <motion.p
                    className="mt-4 text-neutral-600 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {message}
                </motion.p>
            )}
        </div>
    )
}