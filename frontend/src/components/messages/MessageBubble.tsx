import type { Message, User } from '@/types/api'
import { format } from 'date-fns'

interface MessageBubbleProps {
    message: Message
    currentUserId: number
    otherUser?: User | null
}

export function MessageBubble({ message, currentUserId, otherUser }: MessageBubbleProps) {
    const isCurrentUser = message.sender_id === currentUserId
    const sender = isCurrentUser ? null : (message.sender || otherUser)
    const senderName = sender && sender.first_name && sender.last_name
        ? `${sender.first_name} ${sender.last_name}`
        : sender?.email || 'Unknown'

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
                    <p className="text-sm">{message.content}</p>
                    <p
                        className={`text-xs mt-1 ${isCurrentUser ? 'text-beacon-purple-light' : 'text-neutral-500'
                            }`}
                    >
                        {message.created_at ? format(new Date(message.created_at), 'h:mm a') : ''}
                    </p>
                </div>
            </div>
        </div>
    )
}