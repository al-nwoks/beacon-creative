'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { ConversationList, MessageSearch } from '@/components/messages'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { useNotification } from '@/components/ui/NotificationProvider'
import { useWebSocket } from '@/contexts/WebSocketContext'
import { useMessages, useProfile } from '@/hooks/apiHooks'
import { useMessagingAnalytics } from '@/hooks/usePostHog'
import { clientFetcher } from '@/lib/api'
import type { MessageSummary, MessageWithSender, User } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { mutate } from 'swr'

export default function MessagesPage() {
    const router = useRouter()
    const { showNotification } = useNotification()
    const { isConnected } = useWebSocket()
    const { trackConversationOpened } = useMessagingAnalytics()

    // State management
    const [conversations, setConversations] = useState<MessageSummary[]>([])
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchMode, setSearchMode] = useState(false)
    const [searchResults, setSearchResults] = useState<MessageWithSender[]>([])

    // SWR hooks for real-time updates
    const { data: liveConversations, error: conversationsError, mutate: mutateConversations } = useMessages()
    const { data: liveCurrentUser, error: userError } = useProfile()

    // Update state when SWR data changes
    useEffect(() => {
        if (liveConversations) {
            setConversations(liveConversations)
        }
    }, [liveConversations])

    useEffect(() => {
        if (liveCurrentUser) {
            setCurrentUser(liveCurrentUser)
        }
    }, [liveCurrentUser])

    useEffect(() => {
        if (conversationsError || userError) {
            setError('Failed to load messages')
        }
    }, [conversationsError, userError])

    // WebSocket event listeners for real-time updates
    useEffect(() => {
        const handleNewMessage = (event: CustomEvent) => {
            // Refresh conversations when a new message arrives
            mutateConversations()
        }

        window.addEventListener('new_message', handleNewMessage as EventListener)

        return () => {
            window.removeEventListener('new_message', handleNewMessage as EventListener)
        }
    }, [mutateConversations])

    // Manual refresh function
    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await mutateConversations()
            showNotification('Messages refreshed', 'success')
        } catch (error) {
            console.error('Failed to refresh messages', error)
            showNotification('Failed to refresh messages', 'error')
        } finally {
            setIsRefreshing(false)
        }
    }

    // Handle conversation click
    const handleConversationClick = (conversation: MessageSummary) => {
        if (conversation.user) {
            trackConversationOpened({
                otherUserId: conversation.user.id.toString()
            })
            router.push(`/messages/${conversation.user.id}`)
        }
    }

    // Handle starting new conversation
    const handleStartNewConversation = () => {
        // This could open a modal to select a user or navigate to a user selection page
        showNotification('Feature coming soon: Start new conversation', 'info')
    }

    // Handle deleting conversation
    const handleDeleteConversation = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this entire conversation? This action cannot be undone.')) {
            return
        }

        try {
            await clientFetcher(`/api/messages/conversation/${userId}`, {
                method: 'DELETE'
            })

            // Refresh conversations list
            await mutateConversations()
            showNotification('Conversation deleted', 'success')
        } catch (error) {
            console.error('Failed to delete conversation', error)
            showNotification('Failed to delete conversation', 'error')
        }
    }

    if (!currentUser && !liveCurrentUser) {
        return (
            <ProtectedRoute>
                <SimplifiedLayout showSearch={false}>
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading user information..." />
                    </div>
                </SimplifiedLayout>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-neutral-900">Messages</h1>
                                <div className="flex items-center space-x-4 mt-2">
                                    <p className="text-neutral-600">
                                        View and manage your conversations
                                    </p>
                                    {isConnected ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                                            Online
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5"></div>
                                            Offline
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setSearchMode(!searchMode)}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${searchMode
                                        ? 'bg-beacon-purple text-white border-beacon-purple'
                                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {searchMode ? 'Hide Search' : 'Search Messages'}
                                </button>
                                <button
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 inline mr-2 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                                <button
                                    onClick={handleStartNewConversation}
                                    className="px-4 py-2 bg-beacon-purple text-white rounded-lg hover:bg-beacon-purple-dark transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Message
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    {searchMode && (
                        <div className="mb-8">
                            {currentUser && <MessageSearch
                                currentUser={{
                                    id: currentUser.id,
                                    first_name: currentUser.first_name || undefined,
                                    last_name: currentUser.last_name || undefined,
                                    contacts: [] // Add contacts if available
                                }}
                                onSearchResults={(results) => {
                                    setSearchResults(results)
                                    if (searchMode) {
                                        mutate('/api/messages/conversations?limit=50', results, { revalidate: false })
                                    }
                                }}
                            />}
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-red-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-red-800">{error}</p>
                                <button
                                    onClick={handleRefresh}
                                    className="ml-auto text-red-600 hover:text-red-800 underline"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Conversations List */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        <div className="px-6 py-4 border-b border-neutral-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-neutral-900">Conversations</h2>
                                    <p className="text-sm text-neutral-500 mt-1">
                                        {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                {!isConnected && (
                                    <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                                        Messages will sync when online
                                    </div>
                                )}
                            </div>
                        </div>

                        <ConversationList
                            conversations={conversations}
                            currentUserId={currentUser?.id as number}
                            error={error}
                            isLoading={!conversations && !error}
                        />
                    </div>

                    {/* Empty State */}
                    {conversations.length === 0 && !error && (
                        <div className="text-center py-12">
                            <div className="mx-auto h-16 w-16 text-neutral-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-neutral-900">No conversations yet</h3>
                            <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
                                Start connecting with other users by applying to gigs or posting your own projects.
                                Your conversations will appear here.
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={() => router.push('/gigs')}
                                    className="inline-flex items-center px-4 py-2 bg-beacon-purple text-white rounded-lg hover:bg-beacon-purple-dark transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Browse Gigs
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}