'use client'

import { DashboardHeader } from '@/components/layout/DashboardHeader'
import React, { useEffect } from 'react'

interface SimplifiedLayoutProps {
    children: React.ReactNode
    userType?: 'creative' | 'client' | 'admin'
    showSearch?: boolean
    searchPlaceholder?: string
}

/**
 * SimplifiedLayout
 *
 * A lightweight layout for internal pages and dashboards that keeps a minimal header
 * (logo + optional small nav) and no heavy public chrome. Use this for pages that
 * should appear "in-app" (dashboard, creatives/projects details, etc).
 */
export function SimplifiedLayout({
    children,
    userType = 'creative',
    showSearch = false,
    searchPlaceholder = 'Search...'
}: SimplifiedLayoutProps) {
    useEffect(() => {
        // Hide the global Shell header/footer for internal pages that use this layout.
        document.body.classList.add('hide-global-shell')
        return () => {
            document.body.classList.remove('hide-global-shell')
        }
    }, [])

    return (
        <div className="min-h-screen bg-neutral-50">
            <DashboardHeader userType={userType} />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}

export default SimplifiedLayout