'use client'

import { useNotification } from '@/components/ui/NotificationProvider'
import { useMessagingAnalytics } from '@/hooks/usePostHog'
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
    const { trackWebSocketConnection } = useMessagingAnalytics()
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
            console.warn('No authentication token available for WebSocket connection')
            isConnecting.current = false
            return
        }

        // Create WebSocket URL with token as query parameter
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const wsUrl = baseUrl.replace('http', 'ws') + `/api/v1/ws/messages?token=${encodeURIComponent(token)}`

        try {
            const newSocket = new WebSocket(wsUrl)

            // Set a connection timeout
            const connectionTimeout = setTimeout(() => {
                if (newSocket.readyState === WebSocket.CONNECTING) {
                    console.warn('WebSocket connection timeout')
                    newSocket.close()
                    isConnecting.current = false

                    // Attempt to reconnect if we haven't exceeded max attempts
                    if (reconnectAttempts.current < maxReconnectAttempts) {
                        reconnectAttempts.current++
                        console.log(`Connection timeout, attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)
                        setTimeout(connectWebSocket, 2000 * reconnectAttempts.current)
                    } else {
                        showNotification('Unable to connect to messaging service. Please refresh the page.', 'error')
                    }
                }
            }, 10000) // 10 second timeout

            newSocket.onopen = () => {
                clearTimeout(connectionTimeout)
                console.log('WebSocket connected successfully')
                setIsConnected(true)
                isConnecting.current = false
                reconnectAttempts.current = 0

                // Track successful connection
                trackWebSocketConnection({ status: 'connected' })

                // Send any queued messages
                while (messageQueue.current.length > 0) {
                    const message = messageQueue.current.shift()
                    try {
                        newSocket.send(JSON.stringify(message))
                    } catch (error) {
                        console.error('Error sending queued message:', error)
                        // Re-queue the message if sending fails
                        messageQueue.current.unshift(message)
                        break
                    }
                }

                showNotification('Connected to messaging service', 'success')
            }

            newSocket.onclose = (event) => {
                clearTimeout(connectionTimeout)
                console.log('WebSocket disconnected:', event.code, event.reason)
                setIsConnected(false)
                isConnecting.current = false
                setSocket(null)

                // Track disconnection
                trackWebSocketConnection({ status: 'disconnected' })

                // Don't attempt to reconnect if the close was intentional (code 1000)
                if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                    reconnectAttempts.current++
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 30000) // Exponential backoff, max 30s
                    console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts}) in ${delay}ms`)

                    // Track reconnection attempt
                    trackWebSocketConnection({
                        status: 'reconnecting',
                        attemptNumber: reconnectAttempts.current
                    })

                    setTimeout(connectWebSocket, delay)
                } else if (reconnectAttempts.current >= maxReconnectAttempts) {
                    // Track connection failure
                    trackWebSocketConnection({ status: 'failed' })
                    showNotification('Lost connection to messaging service. Please refresh the page.', 'error')
                }
            }

            newSocket.onerror = (error) => {
                clearTimeout(connectionTimeout)
                console.error('WebSocket error:', error)
                isConnecting.current = false

                if (reconnectAttempts.current === 0) {
                    showNotification('Connection error. Attempting to reconnect...', 'warning')
                }
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
                            window.dispatchEvent(new CustomEvent('message_sent', { detail: data }))
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