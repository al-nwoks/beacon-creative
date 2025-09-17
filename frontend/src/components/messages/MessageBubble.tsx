import type { Message, User } from '@/types/api'
import { format } from 'date-fns'

interface MessageBubbleProps {
    message: Message
    currentUserId: number
    otherUser?: User | null
    showStatus?: boolean
}

export function MessageBubble({ message, currentUserId, otherUser, showStatus = true }: MessageBubbleProps) {
    const isCurrentUser = message.sender_id === currentUserId
    const sender = isCurrentUser ? null : (message.sender || otherUser)
    const senderName = sender && sender.first_name && sender.last_name
        ? `${sender.first_name} ${sender.last_name}`
        : sender?.email || 'Unknown'

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
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="flex-shrink-0">
                            {isImage ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fileData.filename}</p>
                            <p className="text-xs opacity-75">
                                {(fileData.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>

                    {isImage && (
                        <div className="mt-2">
                            <img
                                src={`data:${fileData.content_type};base64,${fileData.data}`}
                                alt={fileData.filename}
                                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90"
                                onClick={() => {
                                    // Open image in new tab
                                    const newWindow = window.open()
                                    if (newWindow) {
                                        newWindow.document.write(`<img src="data:${fileData.content_type};base64,${fileData.data}" style="max-width: 100%; height: auto;" />`)
                                    }
                                }}
                            />
                        </div>
                    )}

                    <button
                        onClick={() => {
                            // Download file
                            const link = document.createElement('a')
                            link.href = `data:${fileData.content_type};base64,${fileData.data}`
                            link.download = fileData.filename
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }}
                        className={`text-xs underline hover:no-underline ${isCurrentUser ? 'text-beacon-purple-light' : 'text-beacon-purple'
                            }`}
                    >
                        Download
                    </button>
                </div>
            )
        }

        return <p className="text-sm">{message.content}</p>
    }

    // Message status indicators
    const getMessageStatus = () => {
        if (!isCurrentUser || !showStatus) return null

        // For now, we'll show read status based on is_read field
        // In a real implementation, you'd track delivery status separately
        if (message.is_read) {
            return (
                <div className="flex items-center space-x-1 mt-1">
                    <svg className="w-3 h-3 text-beacon-purple-light" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <svg className="w-3 h-3 text-beacon-purple-light -ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-beacon-purple-light">Read</span>
                </div>
            )
        } else {
            return (
                <div className="flex items-center space-x-1 mt-1">
                    <svg className="w-3 h-3 text-beacon-purple-light" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-beacon-purple-light">Delivered</span>
                </div>
            )
        }
    }

    return (
        <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center mr-2 mt-1">
                    <span className="text-xs font-medium text-neutral-600">
                        {sender?.first_name?.charAt(0)}{sender?.last_name?.charAt(0) || sender?.first_name?.charAt(1) || 'U'}
                    </span>
                </div>
            )}
            <div className="flex flex-col">
                {!isCurrentUser && (
                    <p className="text-xs font-semibold text-neutral-500 mb-1">{senderName}</p>
                )}
                <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${isCurrentUser
                        ? 'bg-beacon-purple text-white rounded-tr-none'
                        : 'bg-neutral-100 text-neutral-900 rounded-tl-none'
                        }`}
                >
                    {renderMessageContent()}
                    <div className={`flex items-center justify-between mt-1 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                        <p
                            className={`text-xs ${isCurrentUser ? 'text-beacon-purple-light' : 'text-neutral-500'
                                }`}
                        >
                            {message.created_at ? format(new Date(message.created_at), 'h:mm a') : ''}
                        </p>
                        {getMessageStatus()}
                    </div>
                </div>
            </div>
        </div>
    )
}