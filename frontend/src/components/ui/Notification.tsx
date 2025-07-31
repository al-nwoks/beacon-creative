'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, X, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NotificationProps {
    message: string
    type: 'success' | 'error'
    duration?: number
    onClose?: () => void
}

export function Notification({
    message,
    type,
    duration = 3000,
    onClose
}: NotificationProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            if (onClose) onClose()
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onClose])

    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose()
    }

    const icon = type === 'success' ?
        <CheckCircle className="h-6 w-6 text-green-500" /> :
        <XCircle className="h-6 w-6 text-red-500" />

    const bgColor = type === 'success' ?
        'bg-green-50 border-green-200' :
        'bg-red-50 border-red-200'

    const textColor = type === 'success' ?
        'text-green-800' :
        'text-red-800'

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={`fixed top-4 right-4 z-50 flex items-start p-4 rounded-lg border shadow-lg ${bgColor} ${textColor}`}
            >
                <div className="flex-shrink-0 mr-3">
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="ml-4 flex-shrink-0 rounded-md hover:bg-black/10 focus:outline-none"
                >
                    <X className="h-5 w-5" />
                </button>
            </motion.div>
        </AnimatePresence>
    )
}