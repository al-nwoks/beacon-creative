'use client'

import { NavigationIcon } from '@/components/icons/NavigationIcons'
import { useMessages } from '@/hooks/apiHooks'
import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function MessageDropdown() {
    const { data: conversations = [], isLoading, error } = useMessages('/api/messages/conversations?limit=5')
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (conversations) {
            const count = conversations.filter(c => c.unread).length
            setUnreadCount(count)
        }
    }, [conversations])

    return (
        <Menu as="div" className="relative">
            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100 relative">
                <NavigationIcon type="messages" className="h-6 w-6 text-neutral-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg py-2 focus:outline-none z-50">
                <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-900">Messages</span>
                    <Link href="/messages" className="text-xs text-beacon-purple hover:underline">View all</Link>
                </div>
                <div className="max-h-72 overflow-y-auto">
                    {isLoading ? (
                        <div className="px-4 py-3 text-center">
                            <p className="text-sm text-neutral-500">Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="px-4 py-3 text-center">
                            <p className="text-sm text-red-500">Failed to load messages</p>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="px-4 py-3 text-center">
                            <p className="text-sm text-neutral-500">No conversations</p>
                        </div>
                    ) : (
                        conversations.map((conversation) => (
                            <Link
                                key={conversation.id}
                                href={`/messages?user=${conversation.id}`}
                                className="block px-4 py-3 hover:bg-neutral-50"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-9 w-9 rounded-full bg-neutral-200 flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-neutral-900">{conversation.name}</p>
                                            <p className="text-xs text-neutral-500">{conversation.time || 'Unknown time'}</p>
                                        </div>
                                        <p className="text-xs text-neutral-600 truncate">{conversation.preview || 'No message preview'}</p>
                                        {conversation.unread && (
                                            <div className="w-2 h-2 bg-beacon-purple rounded-full flex-shrink-0 mt-1"></div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </Menu.Items>
        </Menu>
    )
}