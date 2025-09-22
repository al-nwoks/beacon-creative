'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useDebounce } from '@/hooks/useDebounce'
import { clientFetcher } from '@/lib/api'
import type { MessageWithSender } from '@/types/api'
import { useEffect, useState } from 'react'

interface MessageSearchProps {
    currentUser?: {
        id: number | string
        first_name?: string
        last_name?: string
        contacts?: Array<{ id: number; name: string }>
    }
    onSearchResults: (results: MessageWithSender[]) => void
}

export function MessageSearch({ currentUser, onSearchResults }: MessageSearchProps) {
    const [query, setQuery] = useState('')
    const [senderId, setSenderId] = useState<number | null>(null)
    const [recipientId, setRecipientId] = useState<number | null>(null)
    const [startDate, setStartDate] = useState<string | null>(null)
    const [endDate, setEndDate] = useState<string | null>(null)
    const [hasFiles, setHasFiles] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const debouncedQuery = useDebounce(query, 500)

    const searchMessages = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams()
            if (debouncedQuery) params.append('query', debouncedQuery)
            if (senderId) params.append('sender_id', senderId.toString())
            if (recipientId) params.append('recipient_id', recipientId.toString())
            if (startDate) params.append('start_date', startDate)
            if (endDate) params.append('end_date', endDate)
            if (hasFiles !== null) params.append('has_files', hasFiles.toString())

            const results = await clientFetcher(`/api/messages/search?${params.toString()}`)
            onSearchResults(results)
        } catch (err) {
            console.error('Search failed:', err)
            setError('Failed to search messages')
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearFilters = () => {
        setQuery('')
        setSenderId(null)
        setRecipientId(null)
        setStartDate(null)
        setEndDate(null)
        setHasFiles(null)
    }

    useEffect(() => {
        if (debouncedQuery || senderId || recipientId || startDate || endDate || hasFiles !== null) {
            searchMessages()
        }
    }, [debouncedQuery, senderId, recipientId, startDate, endDate, hasFiles])

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search messages..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                />
                <Button onClick={handleClearFilters} variant="outline">
                    Clear
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">From</label>
                    <select
                        value={senderId?.toString() || ''}
                        onChange={(e) => setSenderId(e.target.value ? parseInt(e.target.value) : null)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    >
                        <option value="">All senders</option>
                        {currentUser?.contacts?.map(c => (
                            <option key={c.id} value={c.id.toString()}>
                                {c.name || `${currentUser?.first_name} ${currentUser?.last_name}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <select
                        value={recipientId?.toString() || ''}
                        onChange={(e) => setRecipientId(e.target.value ? parseInt(e.target.value) : null)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    >
                        <option value="">All recipients</option>
                        {currentUser?.contacts?.map(c => (
                            <option key={c.id} value={c.id.toString()}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Attachment</label>
                    <select
                        value={hasFiles === null ? '' : hasFiles.toString()}
                        onChange={(e) => setHasFiles(e.target.value === '' ? null : e.target.value === 'true')}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    >
                        <option value="">Any</option>
                        <option value="true">Has files</option>
                        <option value="false">No files</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">From date</label>
                    <Input
                        type="date"
                        value={startDate || ''}
                        onChange={(e) => setStartDate(e.target.value || null)}
                        max={endDate || undefined}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">To date</label>
                    <Input
                        type="date"
                        value={endDate || ''}
                        onChange={(e) => setEndDate(e.target.value || null)}
                        min={startDate || undefined}
                    />
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center py-4">
                    <LoadingSpinner />
                </div>
            )}

            {error && (
                <div className="text-red-500 text-center py-2">
                    {error}
                </div>
            )}
        </div>
    )
}