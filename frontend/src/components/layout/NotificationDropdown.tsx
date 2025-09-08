'use client'

import { NavigationIcon } from '@/components/icons/NavigationIcons'
import { useNotifications } from '@/hooks/apiHooks'
import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function NotificationDropdown() {
    const { data: notifications = [], isLoading, error } = useNotifications('/api/notifications?limit=5')
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (notifications) {
            const count = notifications.filter(n => !n.read).length
            setUnreadCount(count)
        }
    }, [notifications])

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100 relative">
                <NavigationIcon type="notifications" className="h-6 w-6 text-neutral-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 focus:outline-none z-50">
                <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900">Notifications</span>
                    <Link href="/notifications" className="text-xs text-beacon-purple hover:underline">View all</Link>
                </div>
                <div className="max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <div className="px-4 py-3 text-center">
                            <p className="text-sm text-neutral-500">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="px-4 py-3 text-center">
                            <p className="text-sm text-red-500">Failed to load notifications</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="px-4 py-3 text-center">
                            <p className="text-sm text-neutral-500">No notifications</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className="px-4 py-3 hover:bg-neutral-50">
                                <p className="text-sm font-medium">{notification.title ?? 'Notification'}</p>
                                <p className="text-xs text-neutral-500">
                                    {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
                                </p>
                                {notification.body && (
                                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{notification.body}</p>
                                )}
                                <div className="mt-1">
                                    <span className={`text-xs ${notification.read ? 'text-neutral-500' : 'text-beacon-purple'}`}>
                                        {notification.read ? 'Read' : 'Unread'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Menu.Items>
        </Menu>
    )
}