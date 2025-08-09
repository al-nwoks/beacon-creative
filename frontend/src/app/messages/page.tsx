import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Messages | B3ACON Creative Connect',
    description: 'Your messages and conversations.',
}

export default function MessagesPage() {
    // Mock conversations for initial UI
    const conversations = [
        { id: '1', name: 'Sarah Johnson', preview: 'Thanks — I loved your proposal on the project!', time: '2h', unread: true },
        { id: '2', name: 'Michael Chen', preview: 'Can you share previous work samples for e-commerce?', time: '4h', unread: false },
        { id: '3', name: 'Client Support', preview: 'Your payment was successful.', time: '1d', unread: false },
    ]

    return (
        <ProtectedRoute>
            <SimplifiedLayout userType="creative" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Conversation list */}
                        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                            <div className="px-4 py-4 border-b border-neutral-100">
                                <h2 className="text-lg font-semibold text-neutral-900">Conversations</h2>
                                <p className="text-xs text-neutral-500">Recent chats and message threads</p>
                            </div>
                            <div className="divide-y">
                                {conversations.map((c) => (
                                    <a key={c.id} href={`/messages/${c.id}`} className={`block px-4 py-3 hover:bg-neutral-50 ${c.unread ? 'bg-neutral-50' : ''}`}>
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-full bg-neutral-200 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-neutral-900 truncate">{c.name}</p>
                                                    <p className="text-xs text-neutral-500">{c.time}</p>
                                                </div>
                                                <p className="text-xs text-neutral-600 truncate">{c.preview}</p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Active conversation / placeholder */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-neutral-900">Select a conversation</h3>
                                    <p className="text-sm text-neutral-600">Choose a thread from the left to view messages and reply.</p>
                                </div>
                                <div>
                                    <a href="/messages/new" className="inline-block bg-beacon-purple text-white px-3 py-2 rounded-md text-sm hover:bg-purple-700">New Message</a>
                                </div>
                            </div>
                            <div className="border border-dashed border-neutral-100 rounded-md p-8 text-center text-neutral-500">
                                No conversation selected. Pick a thread or start a new message.
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}