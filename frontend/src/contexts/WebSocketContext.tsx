'use client'

import { useNotification } from '@/components/ui/NotificationProvider'
import type { Message } from '@/types/api'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface WebSocketContextType {
    socket: Socket | null
    isConnected: boolean
    sendMessage: (message: Omit<Message, 'id' | 'created_at' | 'sender' | 'recipient'>) => void
    joinConversation: (conversationId: string) => void
    leaveConversation: (conversationId: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const { showNotification } = useNotification()
    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
            timeout: 20000,
        })

        newSocket.on('connect', () => {
            console.log('WebSocket connected')
            setIsConnected(true)
            reconnectAttempts.current = 0
        })

        newSocket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason)
            setIsConnected(false)

            // Handle manual disconnection
            if (reason === 'io client disconnect') {
                return
            }

            // Attempt to reconnect
            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current++
                console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)
            }
        })

        newSocket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error)
            showNotification('Connection error. Please check your network.', 'error')
        })

        newSocket.on('new_message', (message: Message) => {
            console.log('New message received:', message)
            // Dispatch a custom event so components can listen for new messages
            window.dispatchEvent(new CustomEvent('new_message', { detail: message }))
        })

        newSocket.on('message_delivered', (messageId: string) => {
            console.log('Message delivered:', messageId)
            window.dispatchEvent(new CustomEvent('message_delivered', { detail: messageId }))
        })

        newSocket.on('user_typing', (data: { userId: number; conversationId: string }) => {
            console.log('User typing:', data)
            window.dispatchEvent(new CustomEvent('user_typing', { detail: data }))
        })

        newSocket.on('user_stopped_typing', (data: { userId: number; conversationId: string }) => {
            console.log('User stopped typing:', data)
            window.dispatchEvent(new CustomEvent('user_stopped_typing', { detail: data }))
        })

        setSocket(newSocket)

        // Cleanup function
        return () => {
            newSocket.close()
        }
    }, [showNotification])

    const sendMessage = (message: Omit<Message, 'id' | 'created_at' | 'sender' | 'recipient'>) => {
        if (socket && isConnected) {
            socket.emit('send_message', message)
        } else {
            console.warn('Cannot send message: WebSocket not connected')
            showNotification('Message not sent. Please check your connection.', 'error')
        }
    }

    const joinConversation = (conversationId: string) => {
        if (socket && isConnected) {
            socket.emit('join_conversation', conversationId)
        }
    }

    const leaveConversation = (conversationId: string) => {
        if (socket && isConnected) {
            socket.emit('leave_conversation', conversationId)
        }
    }

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                isConnected,
                sendMessage,
                joinConversation,
                leaveConversation,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    )
}

export function useWebSocket() {
    const context = useContext(WebSocketContext)
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider')
    }
    return context
}