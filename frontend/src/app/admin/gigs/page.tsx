import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'
import AdminGigsClient from './AdminGigsClient'

export const metadata: Metadata = {
    title: 'Gig Management | B3ACON Admin',
    description: 'Manage platform gigs and projects.',
}

export default async function AdminGigsPage() {
    let gigs: any[] = []
    let stats = {
        total_gigs: 0,
        active_gigs: 0,
        completed_gigs: 0,
        pending_gigs: 0
    }
    let error: string | null = null

    try {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            // Fetch gigs data
            const gigsResp = await fetch(`${apiBase}/admin/gigs?limit=50`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (gigsResp.ok) {
                const gigsData = await gigsResp.json()
                if (Array.isArray(gigsData)) {
                    gigs = gigsData

                    // Calculate stats from the data
                    stats.total_gigs = gigs.length
                    stats.active_gigs = gigs.filter(g => g.status === 'active' || g.status === 'open').length
                    stats.completed_gigs = gigs.filter(g => g.status === 'completed').length
                    stats.pending_gigs = gigs.filter(g => g.status === 'pending' || g.status === 'draft').length
                }
            } else {
                error = 'Failed to fetch gigs data'
            }
        } else {
            error = 'Not authenticated'
        }
    } catch (err) {
        console.error('Failed to fetch gigs data', err)
        error = 'Failed to fetch gigs data'
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <AdminGigsClient
                    initialGigs={gigs}
                    initialStats={stats}
                    error={error}
                />
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}