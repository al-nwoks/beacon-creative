'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
    src?: string
    alt?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    fallback?: string
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
}

export default function Avatar({
    src,
    alt = 'Avatar',
    size = 'md',
    className,
    fallback
}: AvatarProps) {
    const sizeClass = sizeClasses[size]

    return (
        <div className={cn(
            'relative rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg',
            sizeClass,
            className
        )}>
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {fallback || alt.charAt(0).toUpperCase()}
                </div>
            )}
        </div>
    )
}