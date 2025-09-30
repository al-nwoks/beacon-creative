/**
 * Utility function to get the correct API base URL
 * Handles cases where NEXT_PUBLIC_API_URL may or may not include /api/v1
 */
export function getApiBase(): string {
  const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
  const base = rawBase.replace(/\/+$/, '')
  // If the base already ends with /api/v1, use it as is, otherwise append /api/v1
  return base.endsWith('/api/v1') ? base : `${base}/api/v1`
}