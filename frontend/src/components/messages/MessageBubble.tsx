'use client'

import { clientFetcher } from '@/lib/api'
import type { Message, User } from '@/types/api'
import { format } from 'date-fns'
import { useState } from 'react'
import { ForwardMessageDialog } from './ForwardMessageDialog'

interface MessageBubbleProps {
    message: Message
    currentUserId: number
    otherUser?: User | null
    showStatus?: boolean
    mutate?: () => void
}

export function MessageBubble({
    message,
    currentUserId,
    otherUser,
    showStatus = true,
    mutate = () => { }
}: MessageBubbleProps) {
    const [showForwardDialog, setShowForwardDialog] = useState(false)
    const isCurrentUser = message.sender_id === currentUserId
    const sender = isCurrentUser ? null : (message.sender || otherUser)
    const senderName = sender && sender.first_name && sender.last_name
        ? `${sender.first_name} ${sender.last_name}`
        : sender?.email || 'Unknown'

    const handleTogglePin = async () => {
        try {
            await clientFetcher(`/api/messages/${message.id}/pin`, {
                method: 'PUT'
            })
            mutate()
        } catch (error) {
            console.error('Failed to toggle pin', error)
        }
    }

    const handleToggleFavorite = async () => {
        try {
            await clientFetcher(`/api/messages/${message.id}/favorite`, {
                method: 'PUT'
            })
            mutate()
        } catch (error) {
            console.error('Failed to toggle favorite', error)
        }
    }

    const handleReaction = async (emoji: string) => {
        try {
            await clientFetcher(`/api/messages/${message.id}/reactions?emoji=${encodeURIComponent(emoji)}`, {
                method: 'POST'
            })
            mutate()
        } catch (error) {
            console.error('Failed to update reaction:', error)
        }
    }

    // Check if message contains file data
    const isFileMessage = () => {
        try {
            const parsed = JSON.parse(message.content)
            return parsed.file && parsed.file.type === 'file'
        } catch {
            return false
        }
    }

    const getFileData = () => {
        try {
            const parsed = JSON.parse(message.content)
            return parsed.file
        } catch {
            return null
        }
    }

    const renderMessageContent = () => {
        if (isFileMessage()) {
            const fileData = getFileData()
            if (!fileData) return <p className="text-sm">{message.content}</p>

            const isImage = fileData.content_type?.startsWith('image/')

            return (
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-white bg-opacity-10 rounded-lg">
                        <div className="flex-shrink-0">
                            {isImage ? (
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fileData.filename}</p>
                            <p className="text-xs opacity-75">
                                {fileData.size > 1024 * 1024
                                    ? `${(fileData.size / (1024 * 1024)).toFixed(1)} MB`
                                    : `${(fileData.size / 1024).toFixed(1)} KB`
                                }
                            </p>
                        </div>
                    </div>

                    {isImage && (
                        <div className="mt-2">
                            <img
                                src={`data:${fileData.content_type};base64,${fileData.data}`}
                                alt={fileData.filename}
                                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                            />
                        </div>
                    )}
                </div>
            )
        }

        return <p className="text-sm">{message.content}</p>
    }

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
            {!isCurrentUser && (
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3 mt-1">
                    <span className="text-sm font-medium text-white">
                        {sender?.first_name?.charAt(0)}{sender?.last_name?.charAt(0) || sender?.first_name?.charAt(1) || 'U'}
                    </span>
                </div>
            )}
            <div className="flex flex-col">
                {!isCurrentUser && (
                    <p className="text-xs font-semibold text-neutral-500 mb-1">{senderName}</p>
                )}
                <div
                    className={`relative max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 transition-all duration-200 ${isCurrentUser
                        ? 'bg-gradient-to-r from-beacon-purple to-purple-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white text-neutral-900 rounded-tl-none shadow-sm border border-neutral-200'
                        } ${message.is_pinned ? 'ring-2 ring-yellow-400' : ''}`}
                >
                    <div className="absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setShowForwardDialog(true)}
                            className="p-1 rounded-full bg-white/20 hover:bg-white/30"
                            title="Forward message"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </button>
                        {isCurrentUser && (
                            <button
                                onClick={handleTogglePin}
                                className={`p-1 rounded-full ${message.is_pinned
                                    ? 'bg-yellow-400 text-yellow-800'
                                    : 'bg-white/20 hover:bg-white/30'}`}
                                title={message.is_pinned ? "Unpin message" : "Pin message"}
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5a2 2 0 012-2h1a1 1 0 010 2H7v7h1a1 1 0 110 2H7a2 2 0 01-2-2V5zm8 0a2 2 0 012-2h1a1 1 0 110 2h-1v7h1a1 1 0 110 2h-1a2 2 0 01-2-2V5z" />
                                </svg>
                            </button>
                        )}
                        {!isCurrentUser && (
                            <button
                                onClick={handleToggleFavorite}
                                className={`p-1 rounded-full ${message.is_favorite
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-white/20 hover:bg-white/30'}`}
                                title={message.is_favorite ? "Remove favorite" : "Add favorite"}
                            >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {message.forwarded_from && (
                        <div className="text-xs text-gray-500 mb-1 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Forwarded from {message.forwarded_from.sender?.name || 'Unknown'}
                        </div>
                    )}
                    {renderMessageContent()}

                    {/* Reactions */}
                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(message.reactions).map(([emoji, userIds]) => (
                                <button
                                    key={emoji}
                                    onClick={() => handleReaction(emoji)}
                                    className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${userIds.includes(currentUserId)
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    <span>{emoji}</span>
                                    <span>{userIds.length}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Reaction Picker */}
                    <div className="mt-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {['👍', '❤️', '😂', '😮', '😢', '🔥'].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => handleReaction(emoji)}
                                className="text-sm p-1 hover:bg-gray-200 rounded"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>

                    <div className={`flex items-center justify-between mt-1 space-x-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        <p className={`text-xs ${isCurrentUser ? 'text-beacon-purple-light' : 'text-neutral-500'}`}>
                            {message.created_at ? format(new Date(message.created_at), 'h:mm a') : ''}
                        </p>
                    </div>
                </div>
            </div>

            {showForwardDialog && (
                <ForwardMessageDialog
                    message={message}
                    onClose={() => setShowForwardDialog(false)}
                    onForward={mutate}
                />
            )}
        </div>
    )
}