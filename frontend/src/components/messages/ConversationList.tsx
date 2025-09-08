import type { MessageSummary } from '@/types/api'
import Link from 'next/link'

interface ConversationListProps {
    conversations: MessageSummary[]
    currentUserId?: number
    isLoading?: boolean
    error?: string | null
}

export function ConversationList({ conversations, currentUserId, isLoading, error }: ConversationListProps) {
    if (isLoading) {
        return (
            <div className="divide-y divide-neutral-200">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-6">
                        <div className="rounded-full bg-neutral-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                            <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">Unable to load conversations</h3>
                <p className="mt-2 text-sm text-neutral-500">{error}</p>
                <p className="mt-4 text-sm text-neutral-500">Please refresh the page to try again</p>
            </div>
        )
    }

    if (conversations.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">No conversations yet</h3>
                <p className="mt-2 text-sm text-neutral-500">Your messages will appear here once you start a conversation.</p>
                <p className="mt-4 text-sm text-neutral-500">Visit the <Link href="/find-work" className="text-beacon-purple hover:underline">find work</Link> page to start a conversation.</p>
            </div>
        )
    }

    return (
        <div className="divide-y divide-neutral-200">
            {conversations.map((conversation) => (
                <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="block p-6 hover:bg-neutral-50 transition-colors"
                >
                    <div className="flex items-center space-x-4">
                        <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-neutral-900 truncate">
                                    {conversation.name}
                                </h3>
                                {conversation.time && (
                                    <span className="text-sm text-neutral-500 whitespace-nowrap">
                                        {conversation.time}
                                    </span>
                                )}
                            </div>
                            {conversation.preview && (
                                <p className="text-neutral-600 truncate mt-1">
                                    {conversation.preview}
                                </p>
                            )}
                        </div>
                        {conversation.unread && (
                            <div className="w-3 h-3 bg-beacon-purple rounded-full flex-shrink-0"></div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    )
}