'use client'

import { Notification } from '@/components/ui/Notification'
import { AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'
import React, { createContext, useCallback, useState } from 'react'

interface Notification {
    id: string
    title?: string
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
    duration?: number
}

interface NotificationContextType {
    showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning', title?: string, duration?: number) => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const showNotification = useCallback((
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'info',
        title?: string,
        duration: number = 5000
    ) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification: Notification = {
            id,
            title,
            message,
            type,
            duration
        }

        setNotifications(prev => [...prev, newNotification])

        // Auto remove notification after duration
        setTimeout(() => {
            setNotifications(prev => prev.filter(notification => notification.id !== id))
        }, duration)
    }, [])

    const dismissNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, [])

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50">
                <div className="flex flex-col space-y-4 w-full max-w-md">
                    <AnimatePresence>
                        {notifications.map((notification) => (
                            <Notification
                                key={notification.id}
                                id={notification.id}
                                title={notification.title}
                                message={notification.message}
                                type={notification.type}
                                duration={notification.duration}
                                onDismiss={dismissNotification}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    const context = React.useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}