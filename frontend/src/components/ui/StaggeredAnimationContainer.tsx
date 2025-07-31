'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggeredAnimationContainerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
}

export function StaggeredAnimationContainer({
    children,
    className = '',
    staggerDelay = 0.1
}: StaggeredAnimationContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}