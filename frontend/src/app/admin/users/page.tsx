import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { User } from '@/types/api'
import type { Metadata } from 'next'
import AdminUsersClient from './AdminUsersClient'

export const metadata: Metadata = {
    title: 'Manage Users | B3ACON Admin',
    description: 'View and manage platform users.',
}

export default async function AdminUsersPage() {
    // Fetch real data from the API
    let users: User[] = []
    let error: string | null = null

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            const usersResp = await fetch(`${apiBase}/admin/users`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (usersResp.ok) {
                const usersData = await usersResp.json()
                if (Array.isArray(usersData)) {
                    users = usersData as User[]
                }
            } else {
                error = 'Failed to fetch users'
            }
        } else {
            error = 'Not authenticated'
        }
    } catch (err) {
        console.error('Failed to fetch users', err)
        error = 'Failed to fetch users'
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <AdminUsersClient initialUsers={users} error={error} />
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}