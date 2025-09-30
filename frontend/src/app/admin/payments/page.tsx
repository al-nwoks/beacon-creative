import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'
import AdminPaymentsClient from './AdminPaymentsClient'

export const metadata: Metadata = {
    title: 'Payment Management | B3ACON Admin',
    description: 'Manage platform payments and transactions.',
}

export default async function AdminPaymentsPage() {
    let payments: any[] = []
    let stats = {
        total_payments: 0,
        total_amount: 0,
        pending_payments: 0,
        completed_payments: 0
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

            // Fetch payments data
            const paymentsResp = await fetch(`${apiBase}/admin/payments?limit=50`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (paymentsResp.ok) {
                const paymentsData = await paymentsResp.json()
                if (Array.isArray(paymentsData)) {
                    payments = paymentsData

                    // Calculate stats from the data
                    stats.total_payments = payments.length
                    stats.total_amount = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
                    stats.pending_payments = payments.filter(p => p.status === 'pending' || p.status === 'processing').length
                    stats.completed_payments = payments.filter(p => p.status === 'completed' || p.status === 'released').length
                }
            } else {
                error = 'Failed to fetch payments data'
            }
        } else {
            error = 'Not authenticated'
        }
    } catch (err) {
        console.error('Failed to fetch payments data', err)
        error = 'Failed to fetch payments data'
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <AdminPaymentsClient
                    initialPayments={payments}
                    initialStats={stats}
                    error={error}
                />
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}