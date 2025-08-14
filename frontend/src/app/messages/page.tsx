import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { serverFetch } from '@/lib/api'
import type { MessageSummary } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Messages | B3ACON Creative Connect',
    description: 'View your messages and conversations.',
}

export default async function MessagesPage() {
    let conversations: MessageSummary[] = []

    try {
        // Fetch user's conversations
        const conversationsResp = await serverFetch('/messages/conversations')
        if (Array.isArray(conversationsResp)) {
            conversations = conversationsResp as MessageSummary[]
        }
    } catch (err) {
        console.error('Failed to fetch conversations', err)
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Messages</h1>

                    {conversations.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 divide-y divide-neutral-200">
                            {conversations.map((conversation) => (
                                <div key={conversation.id} className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h2 className="text-lg font-semibold text-neutral-900 truncate">{conversation.name}</h2>
                                                <span className="text-sm text-neutral-500 whitespace-nowrap">
                                                    {conversation.time || 'Unknown time'}
                                                </span>
                                            </div>
                                            <p className="text-neutral-600 truncate">{conversation.preview || 'No message preview'}</p>
                                        </div>
                                        {conversation.unread && (
                                            <div className="w-3 h-3 bg-beacon-purple rounded-full flex-shrink-0"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No conversations yet</h2>
                            <p className="text-neutral-600">Your messages will appear here once you start a conversation.</p>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}