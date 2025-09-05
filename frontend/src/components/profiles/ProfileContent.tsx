'use client'

import TabNavigation from '@/components/ui/TabNavigation'
import { clientFetcher } from '@/lib/api'
import { logger } from '@/lib/logger'
import { Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'

interface ProfileContentProps {
    portfolioImages: Array<{
        id: string
        src: string
        alt: string
    }>
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
    onPortfolioUpdate
}: ProfileContentProps) {
    const [activeTab, setActiveTab] = useState('portfolio')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [isDeleting, setIsDeleting] = useState<number | null>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const handleAddImage = () => {
        // Trigger file input click
        fileInputRef.current?.click()
    }

    const handleDeleteImage = async (index: number) => {
        if (isDeleting !== null) return // Prevent multiple deletions at once

        if (!confirm('Are you sure you want to delete this image?')) return

        logger.info('Starting portfolio image deletion', { index })
        setIsDeleting(index)
        setDeleteError(null)

        try {
            // Use clientFetcher for the API call
            await clientFetcher(`/api/files/portfolio/${index}`, {
                method: 'DELETE',
            })

            logger.info('Portfolio image deleted successfully', { index })

            // Update the portfolio in the parent component
            if (onPortfolioUpdate) {
                const updatedImages = portfolioImages.filter((_, i) => i !== index)
                onPortfolioUpdate(updatedImages)
            }
        } catch (err: any) {
            logger.error('Failed to delete portfolio image', {
                error: err.message || err,
                index
            })
            console.error('Failed to delete image', err)
            setDeleteError(err.message || 'Failed to delete image. Please try again.')
        } finally {
            setIsDeleting(null)
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Check if we've reached the limit
        if (portfolioImages.length >= 12) {
            setUploadError('You have reached the maximum limit of 12 portfolio images. Please delete some images before adding new ones.');
            event.target.value = '';
            return;
        }

        logger.info('Starting portfolio image upload', { fileName: file.name, fileSize: file.size })

        // Reset file input
        event.target.value = ''

        setIsUploading(true)
        setUploadError(null)

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
            if ('portfolio_images' in response && onPortfolioUpdate) {
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
            setUploadError(err.message || 'Failed to upload image. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'portfolio':
                return (
                    <div className="p-6">
                        <div className="mb-4 flex justify-between items-center">
                            <button
                                onClick={handleAddImage}
                                disabled={isUploading || portfolioImages.length >= 12}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                            >
                                {isUploading ? 'Uploading...' : '+ Add Image'}
                            </button>
                            <div className="text-sm text-gray-500">
                                {portfolioImages.length}/12 images
                            </div>
                        </div>

                        {/* Upload error message */}
                        {uploadError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                                {uploadError}
                            </div>
                        )}

                        {/* Delete error message */}
                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                                {deleteError}
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-4">
                            {portfolioImages.map((image, index) => (
                                <div key={image.id} className="relative group">
                                    <div className="relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity aspect-square">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleDeleteImage(index)}
                                        disabled={isDeleting === index}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100"
                                    >
                                        {isDeleting === index ? (
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
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