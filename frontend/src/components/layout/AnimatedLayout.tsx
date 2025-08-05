'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

interface AnimatedLayoutProps {
    children: ReactNode
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
    const pathname = usePathname()
    const previousPathname = useRef<string | null>(null)

    // Determine animation direction based on pathname changes
    const getAnimationDirection = () => {
        if (previousPathname.current === null || pathname === null) return 0

        // Simple logic for determining direction
        // In a real app, you might want more sophisticated logic
        const previousSegments = previousPathname.current.split('/').filter(Boolean)
        const currentSegments = pathname.split('/').filter(Boolean)

        if (currentSegments.length > previousSegments.length) return 1
        if (currentSegments.length < previousSegments.length) return -1
        return 0
    }

    useEffect(() => {
        previousPathname.current = pathname
    }, [pathname])

    const direction = getAnimationDirection()
    const x = direction * 300 // Horizontal offset for slide animation

    return (
        <motion.div
            key={pathname}
            initial={{ opacity: 0, x: x }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -x }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    )
}