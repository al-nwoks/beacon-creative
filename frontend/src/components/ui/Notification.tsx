'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CheckCircle, Info, X, XCircle } from 'lucide-react'
import { useEffect } from 'react'

interface NotificationProps {
    id: string
    title?: string
    message: string
    type?: 'success' | 'error' | 'info' | 'warning'
    duration?: number
    onDismiss: (id: string) => void
}

export function Notification({
    id,
    title,
    message,
    type = 'info',
    duration = 5000,
    onDismiss
}: NotificationProps) {
    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    }

    const typeIcons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <XCircle className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
        warning: <Info className="h-5 w-5 text-yellow-500" />,
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(id)
        }, duration)

        return () => clearTimeout(timer)
    }, [id, onDismiss, duration])

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
                'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border',
                typeStyles[type]
            )}
        >
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {typeIcons[type]}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        {title && (
                            <p className="text-sm font-medium">
                                {title}
                            </p>
                        )}
                        <p className="mt-1 text-sm opacity-90">
                            {message}
                        </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={() => onDismiss(id)}
                        >
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}