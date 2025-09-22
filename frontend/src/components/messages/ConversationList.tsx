'use client'

import type { MessageSummary } from '@/types/api'
import { format, isThisWeek, isToday, isYesterday } from 'date-fns'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

interface ConversationListProps {
    conversations: MessageSummary[]
    currentUserId?: number
    isLoading?: boolean
    error?: string | null
    filter?: 'all' | 'unread' | 'with_files'
    searchQuery?: string
    onLoadMore?: () => void
    hasMore?: boolean
    loadingMore?: boolean
}

function groupConversationsByDate(conversations: MessageSummary[]) {
    const today: MessageSummary[] = []
    const yesterday: MessageSummary[] = []
    const thisWeek: MessageSummary[] = []
    const older: MessageSummary[] = []

    conversations.forEach(conversation => {
        const date = conversation.last_message?.created_at || conversation.updated_at
        if (!date) {
            older.push(conversation)
            return
        }

        const dateObj = new Date(date)
        if (isToday(dateObj)) {
            today.push(conversation)
        } else if (isYesterday(dateObj)) {
            yesterday.push(conversation)
        } else if (isThisWeek(dateObj)) {
            thisWeek.push(conversation)
        } else {
            older.push(conversation)
        }
    })

    return [
        { title: 'Today', conversations: today },
        { title: 'Yesterday', conversations: yesterday },
        { title: 'This Week', conversations: thisWeek },
        { title: 'Older', conversations: older }
    ].filter(group => group.conversations.length > 0)
}

export function ConversationList({
    conversations,
    currentUserId,
    isLoading,
    error,
    filter = 'all',
    searchQuery = '',
    onLoadMore,
    hasMore = false,
    loadingMore = false
}: ConversationListProps) {
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const listElement = listRef.current
        if (!listElement || !onLoadMore || !hasMore) return

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = listElement
            if (scrollHeight - (scrollTop + clientHeight) < 100 && !loadingMore) {
                onLoadMore()
            }
        }

        listElement.addEventListener('scroll', handleScroll)
        return () => listElement.removeEventListener('scroll', handleScroll)
    }, [onLoadMore, hasMore, loadingMore])

    if (isLoading) {
        return (
            <div className="divide-y divide-neutral-200">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-6">
                        <div className="rounded-full bg-neutral-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Unable to load conversations</h3>
                <p className="mt-2 text-sm text-neutral-500">{error}</p>
                <p className="mt-4 text-sm text-neutral-500">Please refresh the page to try again</p>
            </div>
        )
    }

    // Apply filters
    let filteredConversations = conversations
    if (filter === 'unread') {
        filteredConversations = conversations.filter(c => (c.unread_count || 0) > 0)
    } else if (filter === 'with_files') {
        filteredConversations = conversations.filter(c =>
            c.last_message?.content?.includes('"type":"file"') ||
            c.preview?.includes('"type":"file"')
        )
    }

    // Apply search
    if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredConversations = filteredConversations.filter(c => {
            const user = c.user || (c as any)
            const name = (user.first_name && user.last_name)
                ? `${user.first_name} ${user.last_name}`.toLowerCase()
                : user.name?.toLowerCase() || user.email?.toLowerCase() || ''
            return name.includes(query)
        })
    }

    const groupedConversations = groupConversationsByDate(filteredConversations)

    if (filteredConversations.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">No conversations found</h3>
                <p className="mt-2 text-sm text-neutral-500">Try adjusting your filters or search query</p>
            </div>
        )
    }

    return (
        <div className="space-y-6" ref={listRef}>
            {groupedConversations.map((group) => (
                <div key={group.title} className="space-y-2">
                    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-6">
                        {group.title}
                    </h3>
                    <div className="divide-y divide-neutral-200">
                        {group.conversations.map((conversation) => {
                            const otherUser = conversation.user || (conversation as any)
                            const lastMessage = conversation.last_message || (conversation as any)

                            const userName = (otherUser?.first_name && otherUser?.last_name)
                                ? `${otherUser.first_name} ${otherUser.last_name}`
                                : otherUser?.name || otherUser?.email || conversation.name || 'Unknown User'

                            const messagePreview = lastMessage?.content || conversation.preview || 'No messages yet'

                            const timeDisplay = lastMessage?.created_at
                                ? format(new Date(lastMessage.created_at), 'h:mm a')
                                : conversation.time || conversation.updated_at
                                    ? format(new Date(conversation.updated_at!), 'h:mm a')
                                    : undefined

                            const unreadCount = conversation.unread_count || 0
                            const conversationId = otherUser?.id || conversation.id

                            return (
                                <Link
                                    key={conversationId}
                                    href={`/messages/${conversationId}`}
                                    className="block p-6 hover:bg-neutral-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0 flex items-center justify-center">
                                            <span className="text-sm font-medium text-neutral-600">
                                                {otherUser?.first_name?.charAt(0) || ''}{otherUser?.last_name?.charAt(0) || otherUser?.name?.charAt(0) || userName.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-neutral-900 truncate">
                                                    {userName}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    {timeDisplay && (
                                                        <span className="text-sm text-neutral-500 whitespace-nowrap">
                                                            {timeDisplay}
                                                        </span>
                                                    )}
                                                    {unreadCount > 0 && (
                                                        <span className="bg-beacon-purple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`truncate mt-1 ${unreadCount > 0 ? 'text-blue-600' : 'text-neutral-600'}`}>
                                                {messagePreview}
                                            </p>
                                        </div>
                                        {unreadCount > 0 && (
                                            <div className="w-3 h-3 bg-beacon-purple rounded-full flex-shrink-0"></div>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ))}
            {loadingMore && (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beacon-purple"></div>
                </div>
            )}
        </div>
    )
}