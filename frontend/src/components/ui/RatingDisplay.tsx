'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface RatingDisplayProps {
    rating: number
    showValue?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
}

export default function RatingDisplay({
    rating,
    showValue = true,
    size = 'md',
    className
}: RatingDisplayProps) {
    const starSize = sizeClasses[size]

    return (
        <div className={cn('flex items-center', className)}>
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            starSize,
                            i < Math.floor(rating)
                                ? 'fill-current text-yellow-400'
                                : 'text-gray-300'
                        )}
                    />
                ))}
            </div>
            {showValue && (
                <span className="ml-2 text-sm font-medium text-gray-700">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    )
}