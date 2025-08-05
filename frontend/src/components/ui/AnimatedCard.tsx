'use client'

import { cn } from '@/lib/utils'
import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

export interface AnimatedCardProps extends HTMLMotionProps<'div'> {
    className?: string
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={cn('bg-white rounded-lg border border-neutral-200 shadow-sm transition-all duration-300', className)}
                whileHover={{
                    y: -5,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)

AnimatedCard.displayName = 'AnimatedCard'

export default AnimatedCard