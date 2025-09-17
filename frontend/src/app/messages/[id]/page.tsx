'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { MessageBubble } from '@/components/messages/MessageBubble'
import { MessageInput } from '@/components/messages/MessageInput'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { useNotification } from '@/components/ui/NotificationProvider'
import { useMessagingAnalytics } from '@/hooks/usePostHog'
import { useRealTimeMessages } from '@/hooks/useRealTimeMessages'
import { clientFetcher } from '@/lib/api'
import type { Message, User } from '@/types/api'
import { useEffect, useRef, useState } from 'react'

export default function ConversationPage(props: any) {
    // Some Next.js setups (depending on PageProps generic) expect different typing for params.
    // Accept a loose props object to avoid the build-time PageProps constraint mismatch,
    // then safely read params.
    const params = props?.params ?? {}
    const { id } = params as { id?: string }

    // Create proper conversation ID based on user IDs
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [otherUser, setOtherUser] = useState<User | null>(null)
    const [conversationId, setConversationId] = useState<string>('')

    const { messages: realTimeMessages, isTyping, typingUserId, isConnected, sendRealTimeMessage, sendTypingIndicator } = useRealTimeMessages(conversationId)
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMoreMessages, setHasMoreMessages] = useState(true)
    const [page, setPage] = useState(0)
    const { showNotification } = useNotification()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    // PostHog analytics
    const {
        trackMessageSent,
        trackConversationOpened,
        trackFileShared,
        trackWebSocketConnection
    } = useMessagingAnalytics()

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await clientFetcher('/api/users/me', { method: 'GET' })
                setCurrentUser(user)
            } catch (error) {
                console.error('Failed to fetch current user', error)
            }
        }

        fetchCurrentUser()
    }, [])

    // Fetch other user and set up conversation ID
    useEffect(() => {
        const fetchOtherUser = async () => {
            try {
                if (!id) {
                    throw new Error('User ID is required')
                }
                const user = await clientFetcher(`/api/users/${id}`, { method: 'GET' })
                setOtherUser(user)

                // Set up conversation ID based on user IDs
                if (currentUser?.id && id) {
                    const userIds = [currentUser.id, parseInt(id)].sort((a, b) => {
                        const numA = typeof a === 'number' ? a : parseInt(a.toString());
                        const numB = typeof b === 'number' ? b : parseInt(b.toString());
                        return numA - numB;
                    });
                    setConversationId(`${userIds[0]}_${userIds[1]}`)
                }
            } catch (error) {
                console.error('Failed to fetch other user', error)
                showNotification('Failed to load user information', 'error')
            }
        }

        if (id && currentUser?.id) {
            fetchOtherUser()
        }
    }, [id, currentUser, showNotification])

    // Fetch messages function
    const fetchMessages = async (pageNum: number = 0, append: boolean = false) => {
        try {
            if (pageNum === 0) {
                setLoading(true)
            } else {
                setLoadingMore(true)
            }

            if (!id) {
                throw new Error('User ID is required')
            }

            const limit = 50
            const skip = pageNum * limit
            const data = await clientFetcher(`/api/messages/between/${id}?skip=${skip}&limit=${limit}&order=desc`, { method: 'GET' })

            if (append) {
                setMessages(prev => [...data, ...prev])
            } else {
                setMessages(data)
            }

            // Check if there are more messages
            setHasMoreMessages(data.length === limit)

            // Set other user info from the first message if not already set
            if (data.length > 0 && !otherUser) {
                const firstMessage = data[0]
                setOtherUser(firstMessage.sender?.id === parseInt(id) ? firstMessage.sender : firstMessage.recipient)
            }
        } catch (error: any) {
            console.error('Failed to fetch messages', error)

            // Provide specific error messages based on error type
            let errorMessage = 'Failed to load messages'
            if (error?.message?.includes('404')) {
                errorMessage = 'User not found'
            } else if (error?.message?.includes('403')) {
                errorMessage = 'You do not have permission to view this conversation'
            } else if (error?.message?.includes('401')) {
                errorMessage = 'Please log in to view messages'
            } else if (error?.message?.includes('Network')) {
                errorMessage = 'Network error. Please check your connection and try again.'
            }

            showNotification(errorMessage, 'error')
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    // Fetch messages between users and initialize real-time messaging
    useEffect(() => {
        if (id) {
            fetchMessages(0, false)
            setPage(0)
        }
    }, [id, showNotification, otherUser])

    // Load more messages
    const loadMoreMessages = async () => {
        if (loadingMore || !hasMoreMessages) return

        const nextPage = page + 1
        setPage(nextPage)
        await fetchMessages(nextPage, true)
    }

    // Handle scroll to load more messages
    const handleScroll = () => {
        if (!messagesContainerRef.current || loadingMore || !hasMoreMessages) return

        const { scrollTop } = messagesContainerRef.current
        if (scrollTop === 0) {
            loadMoreMessages()
        }
    }

    // Use real-time messages instead of fetched messages
    useEffect(() => {
        if (realTimeMessages.length > 0) {
            setMessages(realTimeMessages)
        }
    }, [realTimeMessages])

    // Scroll to bottom of messages
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Send a new message using real-time messaging
    const handleSendMessage = async (content: string) => {
        try {
            // Validate message content
            if (!content.trim()) {
                showNotification('Message cannot be empty', 'warning')
                return
            }

            if (content.length > 1000) {
                showNotification('Message is too long. Please keep it under 1000 characters.', 'warning')
                return
            }

            if (!id) {
                throw new Error('User ID is required')
            }

            if (!isConnected) {
                showNotification('Not connected to messaging service. Please wait and try again.', 'warning')
                return
            }

            sendRealTimeMessage(content, parseInt(id))

            // Track message sent
            trackMessageSent({
                recipientId: id,
                messageLength: content.length,
                conversationId: conversationId
            })

            showNotification('Message sent', 'success')
        } catch (error: any) {
            console.error('Failed to send message', error)

            let errorMessage = 'Failed to send message. Please try again.'
            if (error?.message?.includes('Network')) {
                errorMessage = 'Network error. Please check your connection.'
            } else if (error?.message?.includes('WebSocket')) {
                errorMessage = 'Connection lost. Reconnecting...'
            }

            showNotification(errorMessage, 'error')
            throw error
        }
    }

    // Send a file message
    const handleSendFile = async (file: File, recipientId: number) => {
        try {
            // Validate file
            if (!file) {
                showNotification('No file selected', 'warning')
                return
            }

            // Check file size (10MB limit)
            const maxSize = 10 * 1024 * 1024 // 10MB
            if (file.size > maxSize) {
                showNotification('File is too large. Maximum size is 10MB.', 'warning')
                return
            }

            // Check file type
            const allowedTypes = ['image/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument']
            const isAllowedType = allowedTypes.some(type => file.type.startsWith(type))
            if (!isAllowedType) {
                showNotification('File type not supported. Please upload images, PDFs, or documents.', 'warning')
                return
            }

            const formData = new FormData()
            formData.append('file', file)
            formData.append('recipient_id', recipientId.toString())

            const response = await clientFetcher('/api/messages/upload-file', {
                method: 'POST',
                body: formData,
            })

            showNotification(`File "${file.name}" sent successfully`, 'success')

            // Refresh messages to show the new file message
            await fetchMessages(0, false)
        } catch (error: any) {
            console.error('Failed to send file', error)

            let errorMessage = 'Failed to send file. Please try again.'
            if (error?.message?.includes('413')) {
                errorMessage = 'File is too large. Please choose a smaller file.'
            } else if (error?.message?.includes('400')) {
                errorMessage = 'Invalid file. Please check the file and try again.'
            } else if (error?.message?.includes('Network')) {
                errorMessage = 'Network error. Please check your connection and try again.'
            }

            showNotification(errorMessage, 'error')
            throw error
        }
    }

    // Handle typing indicator
    const handleTyping = (isTyping: boolean) => {
        if (conversationId) {
            sendTypingIndicator(isTyping)
        }
    }

    if (loading) {
        return (
            <ProtectedRoute>
                <SimplifiedLayout showSearch={false}>
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading conversation..." />
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
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-neutral-900">
                                    {otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Conversation'}
                                </h1>
                                {isConnected ? (
                                    <p className="text-sm text-green-600 mt-1">Online</p>
                                ) : (
                                    <p className="text-sm text-neutral-500 mt-1">Offline - messages will be delivered when online</p>
                                )}
                            </div>
                            <button
                                onClick={() => window.history.back()}
                                className="text-beacon-purple hover:text-beacon-purple-dark flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to messages
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 flex flex-col h-[calc(100vh-200px)]">
                        {/* Messages container */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4"
                            onScroll={handleScroll}
                        >
                            {/* Load more button */}
                            {hasMoreMessages && (
                                <div className="text-center py-2">
                                    <button
                                        onClick={loadMoreMessages}
                                        disabled={loadingMore}
                                        className="text-sm text-beacon-purple hover:text-beacon-purple-dark disabled:opacity-50"
                                    >
                                        {loadingMore ? 'Loading...' : 'Load older messages'}
                                    </button>
                                </div>
                            )}
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="mx-auto h-16 w-16 text-neutral-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-neutral-900">No messages yet</h3>
                                    <p className="mt-2 text-sm text-neutral-500">Start a conversation by sending a message below.</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        currentUserId={currentUser?.id as number}
                                        otherUser={otherUser}
                                    />
                                ))
                            )}
                            {isTyping && typingUserId !== currentUser?.id && otherUser && (
                                <div className="flex items-end space-x-2">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center">
                                        <span className="text-xs font-medium text-neutral-600">
                                            {otherUser.first_name?.charAt(0)}{otherUser.last_name?.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="bg-neutral-100 rounded-2xl rounded-bl-none px-4 py-2">
                                        <div className="flex space-x-1">
                                            <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></div>
                                            <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message input */}
                        <MessageInput
                            onSendMessage={handleSendMessage}
                            onSendFile={handleSendFile}
                            onTyping={handleTyping}
                            placeholder="Type a message..."
                            disabled={!isConnected}
                            recipientId={id ? parseInt(id) : undefined}
                        />
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}