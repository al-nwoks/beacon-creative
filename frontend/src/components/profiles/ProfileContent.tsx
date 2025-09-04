'use client'

import ImageGrid from '@/components/ui/ImageGrid'
import TabNavigation from '@/components/ui/TabNavigation'
import { clientFetcher } from '@/lib/api'
import { logger } from '@/lib/logger'
import { useRef, useState } from 'react'

interface ProfileContentProps {
    portfolioImages: Array<{
        id: string
        src: string
        alt: string
    }>
    onImageClick?: (imageId: string) => void
    onPortfolioUpdate?: (newPortfolioImages: Array<{ id: string, src: string, alt: string }>) => void
}

const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'tools', label: 'Tools 🔧' }
]

export default function ProfileContent({
    portfolioImages,
    onImageClick,
    onPortfolioUpdate
}: ProfileContentProps) {
    const [activeTab, setActiveTab] = useState('portfolio')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleAddImage = () => {
        // Trigger file input click
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        logger.info('Starting portfolio image upload', { fileName: file.name, fileSize: file.size })

        // Reset file input
        event.target.value = ''

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            // Use clientFetcher for the API call
            const response = await clientFetcher('/api/files/upload-portfolio', {
                method: 'POST',
                body: formData as any,
                headers: {
                    // Remove Content-Type to let the browser set it with proper boundary
                }
            })

            logger.info('Portfolio image uploaded successfully')

            // Update the portfolio in the parent component
            if (response.portfolio_images && onPortfolioUpdate) {
                const updatedImages = response.portfolio_images.map((src: string, index: number) => ({
                    id: index.toString(),
                    src,
                    alt: `Portfolio image ${index + 1}`
                }))
                onPortfolioUpdate(updatedImages)
            }
        } catch (err: any) {
            logger.error('Failed to upload portfolio image', {
                error: err.message || err,
                fileName: file.name,
                fileSize: file.size
            })
            console.error('Failed to upload image', err)
            alert('Failed to upload image. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'portfolio':
                return (
                    <div className="p-6">
                        <div className="mb-4">
                            <button
                                onClick={handleAddImage}
                                disabled={isUploading}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {isUploading ? 'Uploading...' : '+ Add Image'}
                            </button>
                        </div>
                        <ImageGrid
                            images={portfolioImages}
                            columns={3}
                            aspectRatio="square"
                            onImageClick={onImageClick}
                        />
                    </div>
                )
            case 'services':
                return (
                    <div className="p-6">
                        <div className="text-center text-gray-500 py-12">
                            Services content coming soon...
                        </div>
                    </div>
                )
            case 'reviews':
                return (
                    <div className="p-6">
                        <div className="text-center text-gray-500 py-12">
                            Reviews content coming soon...
                        </div>
                    </div>
                )
            case 'tools':
                return (
                    <div className="p-6">
                        <div className="text-center text-gray-500 py-12">
                            Tools content coming soon...
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="bg-white">
            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                className="px-6"
            />
            {renderTabContent()}

            {/* Hidden file input for portfolio images */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </div>
    )
}