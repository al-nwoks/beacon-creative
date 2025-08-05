'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatDate } from '@/lib/utils'
import { Paperclip, Send, User } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Message {
    id: string
    senderId: string
    senderName: string
    content: string
    timestamp: string
    read: boolean
    projectId?: string
    projectName?: string
}

interface Conversation {
    id: string
    participantId: string
    participantName: string
    participantAvatar?: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
    projectId?: string
    projectName?: string
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const loadConversations = useCallback(async () => {
        try {
            setLoading(true)
            // Mock data for demonstration
            const mockConversations: Conversation[] = [
                {
                    id: '1',
                    participantId: '101',
                    participantName: 'Sarah Johnson',
                    lastMessage: 'Thanks for your interest in the fashion editorial project. I\'d love to discuss the details further.',
                    lastMessageTime: '2023-06-15T14:30:00Z',
                    unreadCount: 2,
                    projectId: '201',
                    projectName: 'Fashion Editorial Photography'
                },
                {
                    id: '2',
                    participantId: '102',
                    participantName: 'Michael Chen',
                    lastMessage: 'I\'ve reviewed your brand identity project and I\'m excited to work with you on this.',
                    lastMessageTime: '2023-06-14T09:15:00Z',
                    unreadCount: 0,
                    projectId: '202',
                    projectName: 'Brand Identity Design'
                },
                {
                    id: '3',
                    participantId: '103',
                    participantName: 'Emma Rodriguez',
                    lastMessage: 'The website copy is ready for your review. I\'ve attached the document for your feedback.',
                    lastMessageTime: '2023-06-12T16:45:00Z',
                    unreadCount: 1,
                    projectId: '203',
                    projectName: 'Website Copywriting'
                },
                {
                    id: '4',
                    participantId: '104',
                    participantName: 'David Kim',
                    lastMessage: 'Just checking in on the product video project. How are we looking for the deadline?',
                    lastMessageTime: '2023-06-10T11:20:00Z',
                    unreadCount: 0,
                    projectId: '204',
                    projectName: 'Product Video Animation'
                }
            ]

            setConversations(mockConversations)
            if (mockConversations.length > 0) {
                const firstConversation = mockConversations[0];
                if (firstConversation) {
                    setSelectedConversation(firstConversation)
                }
            }
        } catch (err) {
            console.error('Error loading conversations:', err)
            setError('Failed to load conversations. Please try again.')
            showNotification('Failed to load conversations', 'error')
        } finally {
            setLoading(false)
        }
    }, [showNotification])

    const loadMessages = useCallback(async (conversationId: string) => {
        try {
            // Mock data for demonstration
            const mockMessages: Message[] = [
                {
                    id: '1',
                    senderId: '101',
                    senderName: 'Sarah Johnson',
                    content: 'Hi there! I\'m interested in your fashion editorial photography project. Could you tell me more about the specific requirements?',
                    timestamp: '2023-06-15T10:30:00Z',
                    read: true,
                    projectId: '201',
                    projectName: 'Fashion Editorial Photography'
                },
                {
                    id: '2',
                    senderId: 'current-user',
                    senderName: 'You',
                    content: 'Thanks for your interest! The project involves shooting a summer collection with 10+ outfit changes across multiple locations. We\'re looking for someone with experience in high-fashion photography.',
                    timestamp: '2023-06-15T11:15:00Z',
                    read: true,
                    projectId: '201',
                    projectName: 'Fashion Editorial Photography'
                },
                {
                    id: '3',
                    senderId: '101',
                    senderName: 'Sarah Johnson',
                    content: 'That sounds exciting! I have extensive experience with fashion editorials and would love to work on this project. When would you like to schedule the shoot?',
                    timestamp: '2023-06-15T12:45:00Z',
                    read: true,
                    projectId: '201',
                    projectName: 'Fashion Editorial Photography'
                },
                {
                    id: '4',
                    senderId: 'current-user',
                    senderName: 'You',
                    content: 'We\'re hoping to start in early July. Would that work for your schedule?',
                    timestamp: '2023-06-15T13:20:00Z',
                    read: true,
                    projectId: '201',
                    projectName: 'Fashion Editorial Photography'
                },
                {
                    id: '5',
                    senderId: '101',
                    senderName: 'Sarah Johnson',
                    content: 'Thanks for your interest in the fashion editorial project. I\'d love to discuss the details further.',
                    timestamp: '2023-06-15T14:30:00Z',
                    read: false,
                    projectId: '201',
                    projectName: 'Fashion Editorial Photography'
                }
            ]

            setMessages(mockMessages)
        } catch (err) {
            console.error('Error loading messages:', err)
            setError('Failed to load messages. Please try again.')
            showNotification('Failed to load messages', 'error')
        }
    }, [showNotification])

    useEffect(() => {
        loadConversations()
    }, [loadConversations])

    useEffect(() => {
        if (selectedConversation) {
            loadMessages(selectedConversation.id)
        }
    }, [selectedConversation, loadMessages])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return

        try {
            setSending(true)

            // Add new message to the list
            const newMessageObj: Message = {
                id: Date.now().toString(),
                senderId: 'current-user',
                senderName: 'You',
                content: newMessage,
                timestamp: new Date().toISOString(),
                read: true
            }

            setMessages([...messages, newMessageObj])
            setNewMessage('')

            // Update conversation last message
            setConversations(prev => prev.map(conv =>
                conv.id === selectedConversation.id
                    ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString(), unreadCount: 0 }
                    : conv
            ))

            // In a real implementation, this would call the API
            // await messagesAPI.sendMessage({
            //     recipientId: selectedConversation.participantId,
            //     content: newMessage,
            //     projectId: selectedConversation.projectId
            // })

            showNotification('Message sent successfully!', 'success')
        } catch (err) {
            console.error('Error sending message:', err)
            showNotification('Failed to send message. Please try again.', 'error')
        } finally {
            setSending(false)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search messages...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading messages..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search messages...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Messages</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={loadConversations}>
                                Try Again
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search messages...">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                    {/* Messages Header */}
                    <div className="border-b border-neutral-200 p-4">
                        <h1 className="text-xl font-bold text-neutral-900">Messages</h1>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Conversations List */}
                        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-neutral-200 flex flex-col">
                            <div className="p-4 border-b border-neutral-200">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {conversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`p-4 border-b border-neutral-100 cursor-pointer hover:bg-neutral-50 ${selectedConversation?.id === conversation.id ? 'bg-neutral-50' : ''
                                            }`}
                                        onClick={() => setSelectedConversation(conversation)}
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {conversation.participantAvatar ? (
                                                    <Image
                                                        src={conversation.participantAvatar}
                                                        alt={conversation.participantName}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded-full bg-beacon-purple flex items-center justify-center">
                                                        <User className="h-6 w-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3 flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium text-neutral-900 truncate">
                                                        {conversation.participantName}
                                                    </h3>
                                                    <p className="text-xs text-neutral-500">
                                                        {formatDate(conversation.lastMessageTime, { month: 'short', day: 'numeric' })}
                                                    </p>
                                                </div>
                                                {conversation.projectName && (
                                                    <p className="text-xs text-beacon-purple truncate">
                                                        {conversation.projectName}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-sm text-neutral-600 truncate">
                                                        {conversation.lastMessage}
                                                    </p>
                                                    {conversation.unreadCount > 0 && (
                                                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-beacon-purple rounded-full">
                                                            {conversation.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 flex flex-col">
                            {selectedConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="border-b border-neutral-200 p-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                {selectedConversation.participantAvatar ? (
                                                    <Image
                                                        src={selectedConversation.participantAvatar}
                                                        alt={selectedConversation.participantName}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-beacon-purple flex items-center justify-center">
                                                        <User className="h-5 w-5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-neutral-900">
                                                    {selectedConversation.participantName}
                                                </h3>
                                                {selectedConversation.projectName && (
                                                    <p className="text-xs text-beacon-purple">
                                                        {selectedConversation.projectName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <div className="space-y-4">
                                            {messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div
                                                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${message.senderId === 'current-user'
                                                            ? 'bg-beacon-purple text-white'
                                                            : 'bg-neutral-100 text-neutral-900'
                                                            }`}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${message.senderId === 'current-user' ? 'text-beacon-purple-light' : 'text-neutral-500'
                                                                }`}
                                                        >
                                                            {formatDate(message.timestamp, { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </div>

                                    {/* Message Input */}
                                    <div className="border-t border-neutral-200 p-4">
                                        <div className="flex items-end">
                                            <div className="flex-1">
                                                <textarea
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyDown={handleKeyPress}
                                                    rows={1}
                                                    className="block w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple resize-none"
                                                    placeholder="Type your message..."
                                                />
                                            </div>
                                            <div className="ml-2 flex space-x-2">
                                                <button className="p-2 text-neutral-500 hover:text-neutral-700 rounded-full hover:bg-neutral-100">
                                                    <Paperclip className="h-5 w-5" />
                                                </button>
                                                <Button
                                                    variant="primary"
                                                    onClick={handleSendMessage}
                                                    disabled={sending || !newMessage.trim()}
                                                    className="h-10"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center p-8">
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100">
                                            <svg className="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="mt-4 text-lg font-medium text-neutral-900">No conversation selected</h3>
                                        <p className="mt-2 text-sm text-neutral-500">
                                            Select a conversation from the list to start messaging.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SimplifiedLayout>
    )
}