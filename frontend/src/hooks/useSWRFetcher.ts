/**
 * frontend/src/hooks/useSWRFetcher.ts
 *
 * Small wrapper around swr's fetcher using clientFetcher from lib/api.
 * Intended usage:
 *   import useSWR from 'swr'
 *   import { fetcher } from '@/hooks/useSWRFetcher'
 *   const { data, error } = useSWR('/projects?limit=10', fetcher)
 *
 * Note: Ensure `swr` is added to package.json dependencies and installed in the environment.
 */

import { clientFetcher } from '@/lib/api'

export const fetcher = (url: string) => clientFetcher(url)