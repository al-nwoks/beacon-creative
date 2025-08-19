'use client'

import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface AnimatedComponentProps {
    children: ReactNode
    delay?: number
    className?: string
    variants?: Variants
}

export function AnimatedComponent({
    children,
    delay = 0,
    className = '',
    variants
}: AnimatedComponentProps) {
    const defaultVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants || defaultVariants}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}