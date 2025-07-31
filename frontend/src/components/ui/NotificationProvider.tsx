'use client'

import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { Notification } from './Notification'

type NotificationType = 'success' | 'error'

interface NotificationContextType {
    showNotification: (message: string, type: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<{
        message: string
        type: NotificationType
    } | null>(null)

    const showNotification = useCallback((message: string, type: NotificationType) => {
        setNotification({ message, type })
    }, [])

    const handleClose = useCallback(() => {
        setNotification(null)
    }, [])

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={handleClose}
                />
            )}
        </NotificationContext.Provider>
    )
}

export function useNotification() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}