import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'
import { NotificationsClientPage } from './NotificationsClientPage'

export const metadata: Metadata = {
    title: 'Notifications | B3ACON Creative Connect',
    description: 'View your notifications.',
}

export default function NotificationsPage() {
    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <NotificationsClientPage />
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}