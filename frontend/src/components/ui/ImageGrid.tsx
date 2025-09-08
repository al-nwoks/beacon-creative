'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageGridProps {
    images: Array<{
        id: string
        src: string
        alt: string
    }>
    columns?: 2 | 3 | 4
    aspectRatio?: 'square' | 'video' | 'auto'
    className?: string
    onImageClick?: (imageId: string) => void
}

const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
}

const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
}

export default function ImageGrid({
    images,
    columns = 3,
    aspectRatio = 'square',
    className,
    onImageClick
}: ImageGridProps) {
    const columnClass = columnClasses[columns]
    const aspectClass = aspectRatioClasses[aspectRatio]

    return (
        <div className={cn(
            'grid gap-4',
            columnClass,
            className
        )}>
            {images.map((image) => (
                <div
                    key={image.id}
                    className={cn(
                        'relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity',
                        aspectClass
                    )}
                    onClick={() => onImageClick?.(image.id)}
                >
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        unoptimized={image.src.startsWith('data:image/')}
                    />
                </div>
            ))}
        </div>
    )
}