'use client'

import { MessageBubble } from '@/components/messages/MessageBubble'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { useSearchMessages } from '@/hooks/apiHooks'
import type { User } from '@/types/api'
import { useEffect, useState } from 'react'

interface MessageSearchProps {
    currentUser: User | null
}

export function MessageSearch({ currentUser }: MessageSearchProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const { data: messages, error, isLoading } = useSearchMessages(debouncedQuery)

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleClearSearch = () => {
        setSearchQuery('')
        setDebouncedQuery('')
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
            <div className="p-4 border-b border-neutral-200">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search messages..."
                        className="block w-full rounded-lg border border-neutral-300 pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            <div className="p-4">
                {isLoading && (
                    <div className="flex justify-center items-center h-32">
                        <EnhancedLoadingSpinner size="md" message="Searching messages..." />
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <div className="mx-auto h-12 w-12 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-neutral-900">Search failed</h3>
                        <p className="mt-2 text-sm text-neutral-500">There was an error searching messages. Please try again.</p>
                        <p className="mt-4 text-sm text-neutral-500">Please refresh the page to try again</p>
                    </div>
                )}

                {debouncedQuery && !isLoading && !error && messages && messages.length === 0 && (
                    <div className="text-center py-8">
                        <div className="mx-auto h-12 w-12 text-neutral-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-neutral-900">No messages found</h3>
                        <p className="mt-2 text-sm text-neutral-500">No messages match your search for "{debouncedQuery}". Try different keywords.</p>
                    </div>
                )}

                {debouncedQuery && !isLoading && !error && messages && messages.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-neutral-500">
                                Found {messages.length} message{messages.length !== 1 ? 's' : ''} matching "{debouncedQuery}"
                            </p>
                            <button
                                onClick={handleClearSearch}
                                className="text-sm text-beacon-purple hover:text-beacon-purple-dark"
                            >
                                Clear search
                            </button>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    currentUserId={currentUser?.id as number}
                                    otherUser={message.sender?.id === currentUser?.id ? undefined : message.sender}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {!debouncedQuery && (
                    <div className="text-center py-8">
                        <div className="mx-auto h-12 w-12 text-neutral-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-neutral-900">Search messages</h3>
                        <p className="mt-2 text-sm text-neutral-500">Enter a keyword to search your messages.</p>
                    </div>
                )}
            </div>
        </div>
    )
}