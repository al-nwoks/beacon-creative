'use client'

/**
 * LayoutWrapper
 *
 * Simplified behavior: the global Shell component is the single source of truth
 * for rendering public/internal header and footer chrome. This removes the
 * fallback rendering of PublicHeader/PublicFooter which caused duplicate headers
 * on public pages during hydration (both Shell and LayoutWrapper rendering chrome).
 *
 * If you have isolated environments where Shell isn't rendered (storybook, tests),
 * add explicit wrappers there instead of relying on LayoutWrapper fallback.
 */

import { usePathname } from 'next/navigation'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = pathname === '/login' || pathname === '/register'
    // Detect internal dashboard routes
    const isInternalDashboard = pathname?.startsWith('/dashboard') ||
        pathname?.startsWith('/creative-dashboard') ||
        pathname?.startsWith('/client-dashboard') ||
        pathname?.startsWith('/admin')

    // For auth and internal pages we still render children directly.
    // For public pages, do not render header/footer here — Shell handles chrome.
    if (isAuthPage || isInternalDashboard) {
        return <>{children}</>
    }

    return <>{children}</>
}