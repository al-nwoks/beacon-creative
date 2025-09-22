'use client'

import Button from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useWebSocket } from '@/contexts/WebSocketContext'
import { useNotifications } from '@/hooks/apiHooks'
import { clientFetcher } from '@/lib/api'
import type { Notification, NotificationSetting } from '@/types/api'
import { useEffect, useState } from 'react'
import { NotificationSettingsPanel } from './NotificationSettingsPanel'

function NotificationItem({ notification }: { notification: Notification }) {
    return (
        <div className={`p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${notification.read ? 'opacity-80' : 'bg-white'
            }`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                        {notification.title || 'Notification'}
                    </h3>
                    {notification.body && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {notification.body}
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-end ml-4">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(notification.created_at || '').toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    <span className={`mt-1 text-xs px-2 py-0.5 rounded-full ${notification.read
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-blue-100 text-blue-600'
                        }`}>
                        {notification.read ? 'Read' : 'New'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export const NotificationsClientPage = () => {
    const [page, setPage] = useState(1)
    const [showRead, setShowRead] = useState(true)
    const [showUnread, setShowUnread] = useState(true)
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
    const [isDeletingAll, setIsDeletingAll] = useState(false)
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting | null>(null)
    const [isLoadingSettings, setIsLoadingSettings] = useState(true)
    const [settingsError, setSettingsError] = useState<string | null>(null)
    const { data: notifications, total, pageSize, isLoading, error, mutate } = useNotifications(
        page,
        20,
        showUnread ? (showRead ? undefined : false) : (showRead ? true : undefined)
    )
    const { socket } = useWebSocket()

    // Load notification settings
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await clientFetcher('/api/notification-settings', {
                    method: 'GET'
                })
                setNotificationSettings(data)
            } catch (error) {
                console.error('Error loading notification settings:', error)
                setSettingsError('Failed to load notification settings')
            } finally {
                setIsLoadingSettings(false)
            }
        }
        loadSettings()
    }, [])

    const handleSettingsUpdate = async (updates: Partial<NotificationSetting>) => {
        try {
            const updatedSettings = await clientFetcher('/api/notification-settings', {
                method: 'PUT',
                body: JSON.stringify(updates)
            })
            setNotificationSettings(updatedSettings)
        } catch (error) {
            console.error('Error updating notification settings:', error)
            throw error
        }
    }

    useEffect(() => {
        if (!socket) return

        const handler = () => mutate()
        socket.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data)
                if (data.type === 'notification') {
                    mutate()
                }
            } catch (error) {
                console.error('Error parsing WebSocket message', error)
            }
        })

        return () => {
            socket.removeEventListener('message', handler)
        }
    }, [socket, mutate])

    const handleMarkAllRead = async () => {
        try {
            await clientFetcher('/api/notifications/read-all', { method: 'PUT' })
            mutate()
        } catch (error) {
            console.error('Failed to mark all as read', error)
        }
    }

    const handleDeleteAll = async () => {
        try {
            await clientFetcher('/api/notifications/delete-all', { method: 'DELETE' })
            mutate()
        } catch (error) {
            console.error('Failed to delete all notifications', error)
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            {notificationSettings && (
                <NotificationSettingsPanel
                    settings={notificationSettings}
                    onUpdate={handleSettingsUpdate}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleMarkAllRead}
                        disabled={isMarkingAllRead}
                    >
                        {isMarkingAllRead ? 'Marking...' : 'Mark All Read'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDeleteAll}
                        disabled={isDeletingAll}
                    >
                        {isDeletingAll ? 'Deleting...' : 'Delete All'}
                    </Button>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setShowUnread(!showUnread)}
                    className={`px-3 py-1 text-sm rounded-full border ${showUnread
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                >
                    Unread
                </button>
                <button
                    onClick={() => setShowRead(!showRead)}
                    className={`px-3 py-1 text-sm rounded-full border ${showRead
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                >
                    Read
                </button>
            </div>

            {isLoading && <LoadingSpinner className="mx-auto my-8" />}
            {error && <div className="text-red-500 text-center py-4">Error loading notifications</div>}

            {!isLoading && !error && (
                <div className="bg-white rounded-lg shadow">
                    {notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No notifications found
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                            />
                        ))
                    )}
                </div>
            )}

            {total > pageSize && (
                <div className="flex justify-center mt-8 gap-4">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center text-sm text-gray-600">
                        Page {page} of {Math.ceil(total / pageSize)}
                    </span>
                    <Button
                        variant="outline"
                        disabled={page * pageSize >= total}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    )
}