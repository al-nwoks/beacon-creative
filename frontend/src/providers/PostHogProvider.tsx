'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if we're in the browser and PostHog key is available
    if (typeof window === 'undefined') return

    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

    if (!posthogKey) {
      console.warn('[PostHog] PostHog key is not available. PostHog will not be initialized.')
      return
    }

    // Check if PostHog is already initialized
    if (posthog.__loaded) {
      console.log('[PostHog] Already initialized')
      return
    }

    try {
      posthog.init(posthogKey, {
        api_host: posthogHost,
        person_profiles: 'identified_only',
        capture_pageview: true, // Enable automatic pageview capture
        capture_pageleave: true, // Enable automatic pageleave capture
        loaded: (posthog) => {
          console.log('[PostHog] Successfully initialized')
          if (process.env.NODE_ENV === 'development') {
            posthog.debug() // Enable debug mode in development
          }
        },
        // Additional configuration for better performance
        disable_session_recording: false,
        disable_surveys: false,
        autocapture: true,
        cross_subdomain_cookie: false,
        secure_cookie: process.env.NODE_ENV === 'production',
      })
    } catch (error) {
      console.error('[PostHog] Failed to initialize:', error)
    }
  }, [])

  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}