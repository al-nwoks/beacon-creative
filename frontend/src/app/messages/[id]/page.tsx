'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { MessageBubble } from '@/components/messages/MessageBubble'
import { MessageInput } from '@/components/messages/MessageInput'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { useNotification } from '@/components/ui/NotificationProvider'
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
    const { messages: realTimeMessages, isTyping, typingUserId, isConnected, sendRealTimeMessage, sendTypingIndicator } = useRealTimeMessages(id || '')
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [otherUser, setOtherUser] = useState<User | null>(null)
    const { showNotification } = useNotification()
    const messagesEndRef = useRef<HTMLDivElement>(null)

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

    // Fetch messages between users and initialize real-time messaging
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true)
                if (!id) {
                    throw new Error('Conversation ID is required')
                }
                const data = await clientFetcher(`/api/messages/between/${id}`, { method: 'GET' })
                setMessages(data)

                // Set other user info from the first message
                if (data.length > 0) {
                    const firstMessage = data[0]
                    setOtherUser(firstMessage.sender?.id === parseInt(id) ? firstMessage.sender : firstMessage.recipient)
                }
            } catch (error) {
                console.error('Failed to fetch messages', error)
                showNotification('Failed to load messages', 'error')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchMessages()
        }
    }, [id, showNotification, clientFetcher])

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
            // Send message through WebSocket for real-time delivery
            if (!id) {
                throw new Error('Conversation ID is required')
            }
            sendRealTimeMessage(content, parseInt(id))
            showNotification('Message sent successfully', 'success')
        } catch (error) {
            console.error('Failed to send message', error)
            showNotification('Failed to send message. Please try again.', 'error')
            throw error
        }
    }

    // Handle typing indicator
    const handleTyping = (isTyping: boolean) => {
        if (id) {
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
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                            onTyping={handleTyping}
                            placeholder="Type a message..."
                            disabled={!isConnected}
                        />
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}