import { useWebSocket } from '@/contexts/WebSocketContext'
import type { Message } from '@/types/api'
import { useCallback, useEffect, useState } from 'react'

export function useRealTimeMessages(conversationId?: string) {
  const { isConnected, sendMessage, joinConversation, leaveConversation } = useWebSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUserId, setTypingUserId] = useState<number | null>(null)

  // Join conversation when component mounts
  useEffect(() => {
    if (conversationId && isConnected) {
      joinConversation(conversationId)
      
      // Cleanup when component unmounts
      return () => {
        leaveConversation(conversationId)
      }
    }
  }, [conversationId, isConnected, joinConversation, leaveConversation])

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const newMessage = event.detail as Message
      setMessages(prev => [...prev, newMessage])
    }

    window.addEventListener('new_message', handleNewMessage as EventListener)
    
    return () => {
      window.removeEventListener('new_message', handleNewMessage as EventListener)
    }
  }, [])

  // Listen for typing indicators
  useEffect(() => {
    const handleUserTyping = (event: CustomEvent) => {
      const data = event.detail as { userId: number; conversationId: string }
      if (data.conversationId === conversationId && conversationId) {
        setIsTyping(true)
        setTypingUserId(data.userId)
      }
    }

    const handleUserStoppedTyping = (event: CustomEvent) => {
      const data = event.detail as { userId: number; conversationId: string }
      if (data.conversationId === conversationId && conversationId) {
        setIsTyping(false)
        setTypingUserId(null)
      }
    }

    window.addEventListener('user_typing', handleUserTyping as EventListener)
    window.addEventListener('user_stopped_typing', handleUserStoppedTyping as EventListener)
    
    return () => {
      window.removeEventListener('user_typing', handleUserTyping as EventListener)
      window.removeEventListener('user_stopped_typing', handleUserStoppedTyping as EventListener)
    }
  }, [conversationId])

  const sendRealTimeMessage = useCallback((content: string, recipientId: number) => {
    if (!isConnected) {
      throw new Error('Not connected to WebSocket')
    }
    
    const message = {
      type: 'send_message',
      content,
      recipient_id: recipientId
    }
    
    sendMessage(message)
  }, [isConnected, sendMessage])

  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (isConnected && conversationId) {
      if (isTyping) {
        sendMessage({
          type: 'typing',
          conversation_id: conversationId
        })
      } else {
        sendMessage({
          type: 'stop_typing',
          conversation_id: conversationId
        })
      }
    }
  }, [isConnected, conversationId, sendMessage])

  return {
    messages,
    isTyping,
    typingUserId,
    isConnected,
    sendRealTimeMessage,
    sendTypingIndicator,
    setMessages,
  }
}