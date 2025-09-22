/**
 * frontend/src/hooks/apiHooks.ts
 *
 * Client-side SWR hooks for live updates and mutations.
 * Uses the centralized clientFetcher from '@/lib/api' (via fetcher wrapper).
 *
 * Hooks provided:
 * - useGigs
 * - useGig (client-side details / for optimistic updates)
 * - useMessages
 * - useApplications
 * - usePayments
 * - useNotifications
 * - useProfile
 * - useDashboardSummary
 *
 * Each hook returns the standard SWR tuple: { data, error, isLoading, mutate }
 *
 * Note: Ensure `swr` is installed in the frontend project.
 */

import { fetcher } from '@/hooks/useSWRFetcher'
import { clientFetcher } from '@/lib/api'
import type { Application, DashboardSummary, Gig, MessageSummary, MessageWithSender, NotificationList, Payment, User } from '@/types/api'
import useSWR, { mutate } from 'swr'

export function useGigs(query = '/api/gigs?limit=24') {
  const { data, error } = useSWR<Gig[]>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useGig(id?: string) {
  const key = id ? `/api/gigs/${id}` : null
  const { data, error } = useSWR<Gig | null>(key, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => key && mutate(key),
  }
}

export function useMessages(query = '/api/messages/conversations?limit=50') {
  const { data, error } = useSWR<MessageSummary[]>(query, fetcher, { refreshInterval: 15000 })
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useMessagesBetweenUsers(
    userId?: string | number,
    skip: number = 0,
    limit: number = 50,
    order: 'asc' | 'desc' = 'desc'
) {
    const key = userId ? `/api/messages/between/${userId}?skip=${skip}&limit=${limit}&order=${order}` : null
    const { data, error, mutate } = useSWR<MessageWithSender[]>(key, fetcher, {
        refreshInterval: 5000,
        revalidateOnFocus: false
    })
    
    return {
        data,
        error,
        isLoading: !error && !data,
        mutate,
        hasMore: data ? data.length >= limit : false
    }
}

export function useApplications(query = '/api/applications/me') {
  const { data, error } = useSWR<Application[]>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function usePayments(query = '/api/payments/me') {
  const { data, error } = useSWR<Payment[]>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useNotifications(page: number = 1, limit: number = 50, read?: boolean) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(read !== undefined && { read: read.toString() })
  })
  const query = `/api/notifications?${params.toString()}`
  const { data, error, mutate: swrMutate } = useSWR<NotificationList>(query, fetcher, { refreshInterval: 20000 })
  return {
    data: data?.items || [],
    total: data?.total || 0,
    page: data?.page || 1,
    pageSize: data?.pageSize || limit,
    error,
    isLoading: !error && !data,
    mutate: swrMutate,
  }
}

export function useProfile(query = '/api/users/me') {
  const { data, error } = useSWR<User>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useDashboardSummary(query = '/api/dashboard/summary') {
  const { data, error } = useSWR<DashboardSummary>(query, fetcher, { refreshInterval: 30000 })
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

/**
 * Helper mutation functions for common actions
 */
export async function applyToGig(gigId: string, payload: { coverLetter: string }) {
  const res = await clientFetcher(`/api/gigs/${gigId}/apply`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  // After applying, refresh relevant caches
  mutate('/api/applications/me')
  mutate('/api/gigs')
  mutate('/api/dashboard/summary')
  return res
}

export async function markNotificationRead(notificationId: string) {
  const res = await clientFetcher(`/api/notifications/${notificationId}/read`, { method: 'PUT' })
  // Revalidate notifications cache
  mutate(() => true, undefined, { revalidate: true })
  return res
}

export async function sendMessage(recipientId: string | number, content: string) {
  const res = await clientFetcher('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ recipient_id: recipientId, content }),
  })
  // Refresh conversations list
  mutate('/api/messages/conversations?limit=50')
  return res
}

export function useUsers(query = '/api/users') {
  const { data, error } = useSWR<User[]>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useSearchMessages(query: string, skip: number = 0, limit: number = 50) {
  const key = query && query.trim() ? `/api/messages/search?query=${encodeURIComponent(query.trim())}&skip=${skip}&limit=${limit}` : null
  const { data, error } = useSWR<MessageWithSender[]>(key, fetcher, { refreshInterval: 0 })
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => key && mutate(key),
  }
}