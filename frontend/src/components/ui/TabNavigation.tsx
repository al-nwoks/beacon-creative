'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Tab {
    id: string
    label: string
    count?: number
}

interface TabNavigationProps {
    tabs: Tab[]
    activeTab?: string
    onTabChange?: (tabId: string) => void
    className?: string
}

export default function TabNavigation({
    tabs,
    activeTab,
    onTabChange,
    className
}: TabNavigationProps) {
    const [internalActiveTab, setInternalActiveTab] = useState(activeTab || tabs[0]?.id)

    const currentActiveTab = activeTab || internalActiveTab

    const handleTabClick = (tabId: string) => {
        setInternalActiveTab(tabId)
        onTabChange?.(tabId)
    }

    return (
        <div className={cn('border-b border-gray-200', className)}>
            <nav className="flex space-x-8">
                {tabs.map((tab) => {
                    const isActive = currentActiveTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className={cn(
                                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                                isActive
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            )}
                        >
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}