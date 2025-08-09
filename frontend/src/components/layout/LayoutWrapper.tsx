'use client'

'use client'

import PublicFooter from '@/components/layout/PublicFooter'
import PublicHeader from '@/components/layout/PublicHeader'
import { usePathname } from 'next/navigation'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = pathname === '/login' || pathname === '/register'

    if (isAuthPage) {
        return <>{children}</>
    }

    return (
        <>
            <PublicHeader />
            {children}
            <PublicFooter />
        </>
    )
}