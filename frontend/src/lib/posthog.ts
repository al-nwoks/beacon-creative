import { PostHog } from 'posthog-node'

// Server-side PostHog client for tracking events from API routes
let posthogClient: PostHog | null = null

export function getPostHogClient(): PostHog | null {
  // Only initialize if we have the required environment variables
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!posthogKey) {
    console.warn('[PostHog Server] PostHog key is not available. Server-side tracking disabled.')
    return null
  }

  // Return existing client if already initialized
  if (posthogClient) {
    return posthogClient
  }

  try {
    posthogClient = new PostHog(posthogKey, {
      host: posthogHost,
      flushAt: 1,
      flushInterval: 0,
    })
    console.log('[PostHog Server] Successfully initialized')
    return posthogClient
  } catch (error) {
    console.error('[PostHog Server] Failed to initialize:', error)
    return null
  }
}

// Helper function to safely track events
export function trackServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, any>
) {
  const client = getPostHogClient()
  if (!client) return

  try {
    client.capture({
      distinctId,
      event,
      properties: {
        ...properties,
        $lib: 'posthog-node',
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('[PostHog Server] Failed to track event:', error)
  }
}

// Graceful shutdown
export function shutdownPostHog() {
  if (posthogClient) {
    posthogClient.shutdown()
    posthogClient = null
  }
}

// Legacy export for backward compatibility
export default function PostHogClient() {
  return getPostHogClient()
}