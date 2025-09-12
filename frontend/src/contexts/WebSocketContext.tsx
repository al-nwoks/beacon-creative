'use client'

import { useNotification } from '@/components/ui/NotificationProvider'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface WebSocketContextType {
    socket: WebSocket | null
    isConnected: boolean
    sendMessage: (message: any) => void
    joinConversation: (conversationId: string) => void
    leaveConversation: (conversationId: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const { showNotification } = useNotification()
    const reconnectAttempts = useRef(0)
    const maxReconnectAttempts = 5
    const messageQueue = useRef<any[]>([])
    const isConnecting = useRef(false)

    // Get authentication token
    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            // Try to get from localStorage first
            const token = localStorage.getItem('access_token')
            if (token) return token

            // Try to get from cookies
            const cookies = document.cookie.split(';')
            for (const cookie of cookies) {
                const [name, value] = cookie.trim().split('=')
                if (name === 'access_token') {
                    return value
                }
            }
        }
        return null
    }

    const connectWebSocket = () => {
        if (isConnecting.current) return

        isConnecting.current = true
        const token = getAuthToken()
        if (!token) {
            console.warn('No authentication token available')
            isConnecting.current = false
            return
        }

        // Create WebSocket URL with token as query parameter
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const wsUrl = baseUrl.replace('http', 'ws') + `/api/v1/ws/messages?token=${token}`

        try {
            const newSocket = new WebSocket(wsUrl)

            newSocket.onopen = () => {
                console.log('WebSocket connected')
                setIsConnected(true)
                isConnecting.current = false
                reconnectAttempts.current = 0

                // Send any queued messages
                while (messageQueue.current.length > 0) {
                    const message = messageQueue.current.shift()
                    newSocket.send(JSON.stringify(message))
                }
            }

            newSocket.onclose = (event) => {
                console.log('WebSocket disconnected:', event.reason)
                setIsConnected(false)
                isConnecting.current = false
                setSocket(null)

                // Attempt to reconnect
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++
                    console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)
                    setTimeout(connectWebSocket, 1000 * reconnectAttempts.current)
                }
            }

            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error)
                showNotification('Connection error. Please check your network.', 'error')
            }

            newSocket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    console.log('WebSocket message received:', data)

                    switch (data.type) {
                        case 'new_message':
                            window.dispatchEvent(new CustomEvent('new_message', { detail: data.message }))
                            break
                        case 'message_sent':
                            // Message sent confirmation
                            break
                        case 'joined_conversation':
                            // Successfully joined conversation
                            break
                        case 'left_conversation':
                            // Successfully left conversation
                            break
                        case 'user_typing':
                            window.dispatchEvent(new CustomEvent('user_typing', { detail: data }))
                            break
                        case 'user_stopped_typing':
                            window.dispatchEvent(new CustomEvent('user_stopped_typing', { detail: data }))
                            break
                        case 'error':
                            console.error('WebSocket error:', data.message)
                            showNotification(data.message, 'error')
                            break
                        default:
                            console.warn('Unknown message type:', data.type)
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error)
                }
            }

            setSocket(newSocket)
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error)
            isConnecting.current = false
            showNotification('Failed to connect to messaging service.', 'error')
        }
    }

    useEffect(() => {
        connectWebSocket()

        // Cleanup function
        return () => {
            if (socket) {
                socket.close()
            }
        }
    }, [])

    const sendMessage = (message: any) => {
        if (socket && isConnected) {
            socket.send(JSON.stringify(message))
        } else {
            console.warn('Cannot send message: WebSocket not connected')
            messageQueue.current.push(message)
            showNotification('Message queued. Will be sent when connected.', 'warning')
        }
    }

    const joinConversation = (conversationId: string) => {
        sendMessage({
            type: 'join_conversation',
            conversation_id: conversationId
        })
    }

    const leaveConversation = (conversationId: string) => {
        sendMessage({
            type: 'leave_conversation',
            conversation_id: conversationId
        })
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