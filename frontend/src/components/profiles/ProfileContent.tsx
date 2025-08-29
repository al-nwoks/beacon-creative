'use client'

import ImageGrid from '@/components/ui/ImageGrid'
import TabNavigation from '@/components/ui/TabNavigation'
import { useState } from 'react'

interface ProfileContentProps {
    portfolioImages: Array<{
        id: string
        src: string
        alt: string
    }>
    onImageClick?: (imageId: string) => void
}

const tabs = [
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'tools', label: 'Tools 🔧' }
]

export default function ProfileContent({
    portfolioImages,
    onImageClick
}: ProfileContentProps) {
    const [activeTab, setActiveTab] = useState('portfolio')

    const renderTabContent = () => {
        switch (activeTab) {
            case 'portfolio':
                return (
                    <div className="p-6">
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
        </div>
    )
}