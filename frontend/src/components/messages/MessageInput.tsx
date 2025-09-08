'use client'

import { useEffect, useRef, useState } from 'react'

interface MessageInputProps {
    onSendMessage: (content: string) => Promise<void>
    onTyping?: (isTyping: boolean) => void
    disabled?: boolean
    placeholder?: string
}

export function MessageInput({ onSendMessage, onTyping, disabled = false, placeholder = 'Type a message...' }: MessageInputProps) {
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }, [message])

    const handleTyping = () => {
        // Clear any existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // If user just started typing, notify
        if (!isTyping && onTyping) {
            setIsTyping(true)
            onTyping(true)
        }

        // Set timeout to stop typing indicator after 1 second of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping && onTyping) {
                setIsTyping(false)
                onTyping(false)
            }
        }, 1000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim() || isSending) return

        try {
            setIsSending(true)
            await onSendMessage(message.trim())
            setMessage('')

            // Clear typing indicator when message is sent
            if (isTyping && onTyping) {
                setIsTyping(false)
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current)
                }
                onTyping(false)
            }
        } catch (error) {
            console.error('Failed to send message', error)
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e as any)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-end space-x-2 p-4 border-t border-neutral-200">
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value)
                        handleTyping()
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled || isSending}
                    rows={1}
                    className="block w-full rounded-lg border border-neutral-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple resize-none max-h-32"
                />
            </div>
            <button
                type="submit"
                disabled={!message.trim() || disabled || isSending}
                className="flex-shrink-0 h-12 w-12 rounded-full bg-beacon-purple text-white hover:bg-beacon-purple-dark focus:outline-none focus:ring-2 focus:ring-beacon-purple disabled:opacity-50 flex items-center justify-center"
            >
                {isSending ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                )}
            </button>
        </form>
    )
}