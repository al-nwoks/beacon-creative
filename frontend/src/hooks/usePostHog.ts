'use client'

import { usePostHog } from 'posthog-js/react'

/**
 * Hook to capture custom events
 * @returns Function to capture events
 */
export function useCaptureEvent() {
  const posthog = usePostHog()
  
  return (eventName: string, properties?: Record<string, unknown>) => {
    posthog?.capture(eventName, properties)
  }
}

/**
 * Hook to identify a user
 * @returns Function to identify users
 */
export function useIdentifyUser() {
  const posthog = usePostHog()
  
  return (distinctId: string, properties?: Record<string, unknown>) => {
    posthog?.identify(distinctId, properties)
  }
}

/**
 * Hook to set user properties
 * @returns Function to set user properties
 */
export function useSetUserProperties() {
  const posthog = usePostHog()
  
  return (properties: Record<string, unknown>) => {
    posthog?.people?.set(properties)
  }
}

// Re-export the official usePostHog hook for convenience
export { usePostHog }
