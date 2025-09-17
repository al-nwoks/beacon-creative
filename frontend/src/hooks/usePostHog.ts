'use client'

import { usePostHog } from 'posthog-js/react'
import { useCallback } from 'react'

export function useMessagingAnalytics() {
  const posthog = usePostHog()

  const trackMessageSent = useCallback((data: {
    recipientId: string
    messageLength: number
    hasAttachment?: boolean
    attachmentType?: string
    conversationId?: string
  }) => {
    posthog?.capture('message_sent', {
      recipient_id: data.recipientId,
      message_length: data.messageLength,
      has_attachment: data.hasAttachment || false,
      attachment_type: data.attachmentType,
      conversation_id: data.conversationId,
    })
  }, [posthog])

  const trackMessageReceived = useCallback((data: {
    senderId: string
    messageLength: number
    hasAttachment?: boolean
    conversationId?: string
  }) => {
    posthog?.capture('message_received', {
      sender_id: data.senderId,
      message_length: data.messageLength,
      has_attachment: data.hasAttachment || false,
      conversation_id: data.conversationId,
    })
  }, [posthog])

  const trackConversationOpened = useCallback((data: {
    otherUserId: string
    messageCount?: number
    unreadCount?: number
  }) => {
    posthog?.capture('conversation_opened', {
      other_user_id: data.otherUserId,
      message_count: data.messageCount,
      unread_count: data.unreadCount,
    })
  }, [posthog])

  const trackFileShared = useCallback((data: {
    recipientId: string
    fileType: string
    fileSize: number
    fileName: string
  }) => {
    posthog?.capture('file_shared', {
      recipient_id: data.recipientId,
      file_type: data.fileType,
      file_size: data.fileSize,
      file_name: data.fileName,
    })
  }, [posthog])

  const trackConversationDeleted = useCallback((data: {
    otherUserId: string
    messageCount?: number
  }) => {
    posthog?.capture('conversation_deleted', {
      other_user_id: data.otherUserId,
      message_count: data.messageCount,
    })
  }, [posthog])

  const trackMessageDeleted = useCallback((data: {
    messageId: string
    recipientId: string
  }) => {
    posthog?.capture('message_deleted', {
      message_id: data.messageId,
      recipient_id: data.recipientId,
    })
  }, [posthog])

  const trackTypingStarted = useCallback((data: {
    conversationId: string
    otherUserId: string
  }) => {
    posthog?.capture('typing_started', {
      conversation_id: data.conversationId,
      other_user_id: data.otherUserId,
    })
  }, [posthog])

  const trackMessageSearch = useCallback((data: {
    query: string
    resultsCount: number
  }) => {
    posthog?.capture('message_search', {
      search_query: data.query,
      results_count: data.resultsCount,
    })
  }, [posthog])

  const trackWebSocketConnection = useCallback((data: {
    status: 'connected' | 'disconnected' | 'reconnecting' | 'failed'
    attemptNumber?: number
  }) => {
    posthog?.capture('websocket_connection', {
      connection_status: data.status,
      attempt_number: data.attemptNumber,
    })
  }, [posthog])

  return {
    trackMessageSent,
    trackMessageReceived,
    trackConversationOpened,
    trackFileShared,
    trackConversationDeleted,
    trackMessageDeleted,
    trackTypingStarted,
    trackMessageSearch,
    trackWebSocketConnection,
  }
}

export function useGeneralAnalytics() {
  const posthog = usePostHog()

  const trackPageView = useCallback((pageName: string, properties?: Record<string, any>) => {
    posthog?.capture('$pageview', {
      page_name: pageName,
      ...properties,
    })
  }, [posthog])

  const trackUserAction = useCallback((action: string, properties?: Record<string, any>) => {
    posthog?.capture('user_action', {
      action,
      ...properties,
    })
  }, [posthog])

  const trackError = useCallback((error: string, context?: Record<string, any>) => {
    posthog?.capture('error_occurred', {
      error_message: error,
      error_context: context,
    })
  }, [posthog])

  const identifyUser = useCallback((userId: string, properties?: Record<string, any>) => {
    posthog?.identify(userId, properties)
  }, [posthog])

  return {
    trackPageView,
    trackUserAction,
    trackError,
    identifyUser,
  }
}

// Legacy export for backward compatibility
export function useCaptureEvent() {
  const posthog = usePostHog()

  const captureEvent = useCallback((event: string, properties?: Record<string, any>) => {
    posthog?.capture(event, properties)
  }, [posthog])

  return captureEvent
}
