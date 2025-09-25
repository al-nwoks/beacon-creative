/**
 * frontend/src/lib/api.ts
 *
 * Centralized API utilities and lightweight feature APIs used throughout the frontend.
 *
 * Exports:
 * - serverFetch: for server components (SSR/server-side) to fetch data
 * - clientFetcher: a fetcher suitable for SWR and client-side requests
 * - buildQuery: query string helper
 * - default export `api` with simple get/post helpers (client-side)
 * - named feature APIs: usersAPI, gigsAPI, authAPI
 *
 * This file keeps implementations minimal and dependency-free so it's easy to test
 * and run in either server or client contexts.
 */
import { logger } from '@/lib/logger'

// Ensure API_BASE doesn't end with /api/v1 to avoid duplication
const rawApiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '') || ''
const API_BASE = rawApiBase.endsWith('/api/v1') ? rawApiBase.replace('/api/v1', '') : rawApiBase

type FetchInit = RequestInit & { server?: boolean }

async function handleResponse(res: Response) {
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const text = await res.text()
  const data = text && isJson ? JSON.parse(text) : text

  logger.apiResponse('HTTP', res.url, res.status, data)

  if (!res.ok) {
    const err = new Error(
      (data && (data as any).error) ||
        (data && (data as any).message) ||
        `Request failed with status ${res.status}`
    ) as any
    err.status = res.status
    err.data = data
    logger.apiError('HTTP', res.url, err)
    throw err
  }
  return data
}

/**
 * serverFetch - for Next.js server components / server contexts
 */
export async function serverFetch(path: string, init: FetchInit = {}) {
  logger.apiRequest('GET', path, init)
  
  // If the path is a frontend API route (starts with /api/ but not /api/v1/),
  // call the backend API directly instead of making an HTTP request to ourselves
  if (path.startsWith('/api/') && !path.startsWith('/api/v1/')) {
      // For /api/users/me, call the backend directly
      if (path === '/api/users/me') {
          const backendUrl = API_BASE || 'http://backend:8000';
          const url = `${backendUrl}/api/v1/users/me`;
          logger.debug(`Making direct backend call to: ${url}`)
          const res = await fetch(url, {
              cache: 'no-store',
              credentials: 'include',
              ...init,
          } as RequestInit)
          return handleResponse(res)
      }
      
      // For /api/notification-settings/me, call the backend directly
      if (path === '/api/notification-settings/me') {
          const backendUrl = API_BASE || 'http://backend:8000';
          const url = `${backendUrl}/api/v1/notification-settings/`;
          logger.debug(`Making direct backend call to: ${url}`)
          const res = await fetch(url, {
              cache: 'no-store',
              credentials: 'include',
              ...init,
          } as RequestInit)
          return handleResponse(res)
      }
      
      // For other frontend API routes, make a direct fetch to the local server
      // Use the Docker service name for internal communication
      const url = `http://frontend:3000${path}`;
      logger.debug(`Making direct frontend call to: ${url}`)
      const res = await fetch(url, {
          cache: 'no-store',
          credentials: 'include',
          ...init,
      } as RequestInit)
      return handleResponse(res)
  }
  
  // For backend API routes, prepend the API_BASE and add /api/v1 if not present
  const url =
    typeof path === 'string' && (path.startsWith('http') || (path.startsWith('/') && API_BASE === ''))
      ? path
      : `${API_BASE}/api/v1${path.startsWith('/') ? path : `/${path}`}`

  logger.debug(`Making backend API call to: ${url}`)
  const res = await fetch(url, {
    cache: 'no-store',
    credentials: 'include',
    ...init,
  } as RequestInit)

  return handleResponse(res)
}

/**
 * clientFetcher - suitable for SWR and client-side requests
 */
export async function clientFetcher(input: RequestInfo, init: RequestInit = {}) {
  const method = init.method || 'GET'
  logger.apiRequest(method, input.toString(), init.body)
  
  // Check if we're sending FormData (for file uploads)
  const isFormData = init.body instanceof FormData;
  
  // If the input is a frontend API route (starts with /api/ but not /api/v1/), handle it locally
  if (typeof input === 'string' && input.startsWith('/api/') && !input.startsWith('/api/v1/')) {
    // For frontend API routes, make a direct fetch to the local server
    const url = `${window.location.origin}${input}`;
    logger.debug(`Making local frontend API call to: ${url}`)
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        // Only set Content-Type for non-FormData requests
        ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
        // For FormData requests, spread original headers but exclude Content-Type
        ...(isFormData && init && (init as any).headers ?
          Object.fromEntries(
            Object.entries((init as any).headers).filter(
              ([key]) => key.toLowerCase() !== 'content-type'
            )
          ) : {}),
        // For non-FormData requests, spread all original headers
        ...(!isFormData && init && (init as any).headers ? (init as any).headers : {}),
      },
      ...init,
    })
    return handleResponse(res)
  }
  
  const url =
    typeof input === 'string' && !input.startsWith('http')
      ? `${API_BASE}/api/v1${input.startsWith('/') ? input : `/${input}`}`
      : (input as string)

  logger.debug(`Making client API call to: ${url}`)
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      // Only set Content-Type for non-FormData requests
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      // For FormData requests, spread original headers but exclude Content-Type
      ...(isFormData && init && (init as any).headers ?
        Object.fromEntries(
          Object.entries((init as any).headers).filter(
            ([key]) => key.toLowerCase() !== 'content-type'
          )
        ) : {}),
      // For non-FormData requests, spread all original headers
      ...(!isFormData && init && (init as any).headers ? (init as any).headers : {}),
    },
    ...init,
  })

  return handleResponse(res)
}

/**
 * buildQuery helper
 */
export function buildQuery(params?: Record<string, any>) {
  if (!params) return ''
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) =>
      Array.isArray(v)
        ? v.map((x) => `${encodeURIComponent(k)}=${encodeURIComponent(String(x))}`).join('&')
        : `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join('&')
  return q ? `?${q}` : ''
}

/**
 * Lightweight axios-like `api` helper for client code that expects `.get/.post` style.
 * This is intentionally small — consumers can still call clientFetcher directly if they prefer.
 */
const api = {
  async get(path: string, params?: Record<string, any>) {
    logger.apiRequest('GET', path, params)
    const qs = buildQuery(params)
    return clientFetcher(`${path}${qs}`, { method: 'GET' }) as Promise<any>
  },
  async post(path: string, body?: unknown) {
    logger.apiRequest('POST', path, body)
    return clientFetcher(path, { method: 'POST', body: JSON.stringify(body) }) as Promise<any>
  },
  async put(path: string, body?: unknown) {
    logger.apiRequest('PUT', path, body)
    return clientFetcher(path, { method: 'PUT', body: JSON.stringify(body) }) as Promise<any>
  },
  async del(path: string) {
    logger.apiRequest('DELETE', path)
    return clientFetcher(path, { method: 'DELETE' }) as Promise<any>
  },
}

export default api

/**
 * Feature API slices — thin wrappers around `api`/clientFetcher.
 * Add methods as needed by the frontend; keep contracts small and typed where useful.
 */
export const usersAPI = {
  async getCurrentUser() {
    logger.info('Fetching current user')
    // expected to return user object (or throw)
    return clientFetcher('/api/users/me', { method: 'GET' })
  },
  async getUserById(id: string) {
    logger.info(`Fetching user by ID: ${id}`)
    return clientFetcher(`/api/users/${id}`, { method: 'GET' })
  },
  async updateUser(payload: any) {
    logger.info('Updating user', payload)
    return clientFetcher('/api/users/me', { method: 'PUT', body: JSON.stringify(payload) })
  },
  // add more user-related helpers here
}

export const gigsAPI = {
  async getGigs(params?: {
    skip?: number
    limit?: number
    search?: string
    category?: string
    status?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
  }) {
    logger.info('Fetching gigs', params)
    const qs = buildQuery(params)
    return clientFetcher(`/api/gigs${qs}`, { method: 'GET' })
  },
  async getGig(id: string) {
    logger.info(`Fetching gig by ID: ${id}`)
    return clientFetcher(`/api/gigs/${id}`, { method: 'GET' })
  },
  async createGig(payload: any) {
    logger.info('Creating new gig', payload)
    return clientFetcher('/api/gigs', { method: 'POST', body: JSON.stringify(payload) })
  },
  async updateGig(id: string, payload: any) {
    logger.info(`Updating gig ${id}`, payload)
    return clientFetcher(`/api/gigs/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
  },
  async deleteGig(id: string) {
    logger.info(`Deleting gig ${id}`)
    return clientFetcher(`/api/gigs/${id}`, { method: 'DELETE' })
  }
}

export const authAPI = {
  async login(email: string, password: string) {
    logger.info(`Login attempt for user: ${email}`)
    return clientFetcher('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  async logout() {
    logger.info('User logout')
    return clientFetcher('/api/auth/logout', { method: 'POST' })
  },
  async register(payload: any) {
      logger.info('User registration', payload)
      return clientFetcher('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) })
  },
}

export const notificationSettingsAPI = {
  async getNotificationSettings() {
      logger.info('Fetching notification settings')
      return clientFetcher('/api/notification-settings/me', { method: 'GET' })
  },
  async updateNotificationSettings(payload: any) {
      logger.info('Updating notification settings', payload)
      return clientFetcher('/api/notification-settings/me', { method: 'PUT', body: JSON.stringify(payload) })
  },
}

export const passwordAPI = {
  async changePassword(currentPassword: string, newPassword: string) {
      logger.info('Changing user password')
      return clientFetcher('/api/users/change-password', {
          method: 'PUT',
          body: JSON.stringify({ currentPassword, newPassword })
      })
  },
}