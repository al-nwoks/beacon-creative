/**
 * frontend/src/hooks/apiHooks.ts
 *
 * Client-side SWR hooks for live updates and mutations.
 * Uses the centralized clientFetcher from '@/lib/api' (via fetcher wrapper).
 *
 * Hooks provided:
 * - useProjects
 * - useProject (client-side details / for optimistic updates)
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
import type { Application, DashboardSummary, MessageSummary, Notification, Payment, Project, User } from '@/types/api'
import useSWR, { mutate } from 'swr'

export function useProjects(query = '/projects?limit=24') {
  const { data, error } = useSWR<Project[]>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useProject(id?: string) {
  const key = id ? `/projects/${id}` : null
  const { data, error } = useSWR<Project | null>(key, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => key && mutate(key),
  }
}

export function useMessages(query = '/messages/conversations?limit=50') {
  const { data, error } = useSWR<MessageSummary[]>(query, fetcher, { refreshInterval: 15000 })
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useApplications(query = '/applications/me') {
  const { data, error } = useSWR<Application[]>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function usePayments(query = '/payments/me') {
  const { data, error } = useSWR<Payment[]>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useNotifications(query = '/notifications?limit=50') {
  const { data, error } = useSWR<Notification[]>(query, fetcher, { refreshInterval: 20000 })
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useProfile(query = '/users/me') {
  const { data, error } = useSWR<User>(query, fetcher)
  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: () => mutate(query),
  }
}

export function useDashboardSummary(query = '/dashboard/summary') {
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
export async function applyToProject(projectId: string, payload: { coverLetter: string }) {
  const res = await clientFetcher(`/projects/${projectId}/apply`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  // After applying, refresh relevant caches
  mutate('/applications/me')
  mutate('/projects')
  mutate('/dashboard/summary')
  return res
}

export async function markNotificationRead(notificationId: string) {
  const res = await clientFetcher(`/notifications/${notificationId}/read`, { method: 'POST' })
  mutate('/notifications?limit=50')
  return res
}