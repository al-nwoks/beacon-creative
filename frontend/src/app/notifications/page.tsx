import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Notifications | B3ACON Creative Connect',
    description: 'Your notifications and alerts.',
}

import { serverFetch } from '@/lib/api'
import type { Notification } from '@/types/api'

export default async function NotificationsPage() {
    let notifications: Notification[] = []
    try {
        const resp = await serverFetch('/notifications?limit=50')
        if (Array.isArray(resp)) notifications = resp as Notification[]
    } catch (e) {
        notifications = []
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout userType="creative" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Notifications</h2>
                        {notifications.length === 0 ? (
                            <p className="text-neutral-600">No notifications at this time.</p>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((n) => (
                                    <div key={n.id} className="px-4 py-3 flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-neutral-900">{n.title ?? 'Notification'}</p>
                                            <p className="text-xs text-neutral-500">{n.created_at ? new Date(n.created_at).toLocaleString() : ''}</p>
                                            {n.body && <p className="text-sm text-neutral-700 mt-1">{n.body}</p>}
                                        </div>
                                        <div className="ml-4 text-right">
                                            <span className={`text-sm ${n.read ? 'text-neutral-500' : 'text-beacon-purple'}`}>{n.read ? 'Read' : 'Unread'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}