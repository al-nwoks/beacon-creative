'use client'

import { Dialog } from '@/components/headless/Dialog'
import { useUsers } from '@/hooks/apiHooks'
import { clientFetcher } from '@/lib/api'
import type { Message } from '@/types/api'
import { useState } from 'react'

interface ForwardMessageDialogProps {
    message: Message
    onClose: () => void
    onForward: () => void
}

export function ForwardMessageDialog({
    message,
    onClose,
    onForward
}: ForwardMessageDialogProps) {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [isSending, setIsSending] = useState(false)
    const { data: users = [] } = useUsers()

    const handleForward = async () => {
        if (!selectedUserId) return

        setIsSending(true)
        try {
            await clientFetcher(`/api/messages/${message.id}/forward`, {
                method: 'POST',
                body: JSON.stringify({ recipient_id: selectedUserId })
            })
            onForward()
            onClose()
        } catch (error) {
            console.error('Failed to forward message:', error)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <Dialog isOpen={true} onClose={onClose}>
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-lg font-medium mb-4">Forward Message</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select recipient
                    </label>
                    <select
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={selectedUserId || ''}
                        onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    >
                        <option value="">Select a user</option>
                        {users
                            .filter(user => user.id !== message.sender_id)
                            .map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name} ({user.email})
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleForward}
                        disabled={!selectedUserId || isSending}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${!selectedUserId || isSending
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-beacon-purple hover:bg-purple-700'
                            }`}
                    >
                        {isSending ? 'Sending...' : 'Forward'}
                    </button>
                </div>
            </div>
        </Dialog>
    )
}