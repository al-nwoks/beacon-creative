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
 * - named feature APIs: usersAPI, projectsAPI, authAPI
 *
 * This file keeps implementations minimal and dependency-free so it's easy to test
 * and run in either server or client contexts.
 */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '') || ''

type FetchInit = RequestInit & { server?: boolean }

async function handleResponse(res: Response) {
  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const text = await res.text()
  const data = text && isJson ? JSON.parse(text) : text

  if (!res.ok) {
    const err = new Error(
      (data && (data as any).error) ||
        (data && (data as any).message) ||
        `Request failed with status ${res.status}`
    ) as any
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

/**
 * serverFetch - for Next.js server components / server contexts
 */
export async function serverFetch(path: string, init: FetchInit = {}) {
  const url =
    typeof path === 'string' && (path.startsWith('http') || (path.startsWith('/') && API_BASE === ''))
      ? path
      : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`

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
  const url =
    typeof input === 'string' && !input.startsWith('http')
      ? `${API_BASE}${input.startsWith('/') ? input : `/${input}`}`
      : (input as string)

  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init && (init as any).headers ? (init as any).headers : {}),
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
    const qs = buildQuery(params)
    return clientFetcher(`${path}${qs}`, { method: 'GET' }) as Promise<any>
  },
  async post(path: string, body?: unknown) {
    return clientFetcher(path, { method: 'POST', body: JSON.stringify(body) }) as Promise<any>
  },
  async put(path: string, body?: unknown) {
    return clientFetcher(path, { method: 'PUT', body: JSON.stringify(body) }) as Promise<any>
  },
  async del(path: string) {
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
    // expected to return user object (or throw)
    return clientFetcher('/users/me', { method: 'GET' })
  },
  async getUserById(id: string) {
    return clientFetcher(`/users/${id}`, { method: 'GET' })
  },
  // add more user-related helpers here
}

export const projectsAPI = {
  async getProjects(params?: Record<string, any>) {
    const qs = buildQuery(params)
    return clientFetcher(`/projects${qs}`, { method: 'GET' })
  },
  async getProject(id: string) {
    return clientFetcher(`/projects/${id}`, { method: 'GET' })
  },
  async createProject(payload: any) {
    return clientFetcher('/projects', { method: 'POST', body: JSON.stringify(payload) })
  },
  // add update/delete as needed
}

export const authAPI = {
  async login(email: string, password: string) {
    return clientFetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },
  async logout() {
    return clientFetcher('/auth/logout', { method: 'POST' })
  },
  async register(payload: any) {
    return clientFetcher('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
  },
}