'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ProgressBarProps {
    isLoading: boolean
    className?: string
}

export function ProgressBar({ isLoading, className = '' }: ProgressBarProps) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let interval: NodeJS.Timeout

        if (isLoading) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval)
                        return 90
                    }
                    return prev + 10
                })
            }, 200)
        } else {
            setProgress(100)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isLoading])

    return (
        <div className={`w-full h-1 bg-neutral-200 rounded-full overflow-hidden ${className}`}>
            <motion.div
                className="h-full bg-beacon-purple"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onAnimationComplete={() => {
                    if (!isLoading) {
                        setTimeout(() => setProgress(0), 300)
                    }
                }}
            />
        </div>
    )
}