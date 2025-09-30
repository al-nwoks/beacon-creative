'use client'

import LoginHeader from '@/components/layout/LoginHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface ShellProps {
    children: React.ReactNode
}

export function Shell({ children }: ShellProps) {
    const pathname = usePathname()

    // Check if we should hide the global shell
    const shouldHideGlobalShell = typeof window !== 'undefined' &&
        document.body.classList.contains('hide-global-shell')

    // Determine which layout to use based on the current path
    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')
    const isPublicPage = !pathname?.startsWith('/(dashboard)') &&
        !pathname?.startsWith('/client') &&
        !pathname?.startsWith('/creative') &&
        !pathname?.startsWith('/admin') &&
        !isAuthPage

    // Effect to handle body class changes
    useEffect(() => {
        // Clean up function
        return () => {
            document.body.classList.remove('hide-global-shell')
        }
    }, [])

    // Don't render global chrome if explicitly hidden
    if (shouldHideGlobalShell) {
        return <>{children}</>
    }

    // Render appropriate layout
    if (isAuthPage) {
        return (
            <>
                <LoginHeader />
                <main>{children}</main>
            </>
        )
    }

    if (isPublicPage) {
        return (
            <>
                <PublicHeader />
                <main>{children}</main>
                <PublicFooter />
            </>
        )
    }

    // Internal pages use their own headers (DashboardHeader, etc.)
    return <>{children}</>
}