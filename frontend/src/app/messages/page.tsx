import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { ConversationList, MessageSearch } from '@/components/messages'
import type { MessageSummary, User } from '@/types/api'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
    title: 'Messages | B3ACON Creative Connect',
    description: 'View your messages and conversations.',
}

export default async function MessagesPage() {
    let conversations: MessageSummary[] = []
    let currentUser: User | null = null
    let error: string | null = null

    try {
        // Fetch current user and conversations
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            // Fetch current user
            const userResp = await fetch(`${apiBase}/users/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (userResp.ok) {
                currentUser = await userResp.json()
            }

            // Fetch conversations
            const conversationsResp = await fetch(`${apiBase}/messages/conversations`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (conversationsResp.ok) {
                const data = await conversationsResp.json()
                if (Array.isArray(data)) {
                    conversations = data as MessageSummary[]
                }
            } else {
                error = 'Failed to load conversations'
            }
        } else {
            error = 'Not authenticated'
        }
    } catch (err) {
        console.error('Failed to fetch data', err)
        error = 'Failed to fetch data'
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Messages</h1>
                        <p className="text-neutral-600 mt-2">View and manage your conversations</p>
                    </div>

                    {/* Search Section */}
                    <div className="mb-8">
                        <MessageSearch currentUser={currentUser} />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        <div className="px-6 py-4 border-b border-neutral-200">
                            <h2 className="text-lg font-semibold text-neutral-900">Conversations</h2>
                            <p className="text-sm text-neutral-500 mt-1">
                                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <ConversationList
                            conversations={conversations}
                            currentUserId={currentUser?.id as number}
                            error={error}
                        />
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}