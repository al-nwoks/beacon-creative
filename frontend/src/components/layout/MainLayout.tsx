'use client'

import PublicFooter from '@/components/layout/PublicFooter'
import PublicHeader from '@/components/layout/PublicHeader'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BottomNav } from './BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    // Detect whether the global shell is present to avoid rendering duplicate chrome.
    const [hasGlobalShell, setHasGlobalShell] = useState<boolean>(false)
    useEffect(() => {
        setHasGlobalShell(!!document.querySelector('[data-global-shell]'))
    }, [])

    // If a global shell exists, don't render any header or footer to avoid duplicates.
    // Otherwise, render the public header/footer.
    const shouldRenderChrome = !hasGlobalShell

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {shouldRenderChrome && (
                <motion.header
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <PublicHeader />
                </motion.header>
            )}

            <motion.main
                className="flex-grow pb-16 md:pb-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.main>

            {shouldRenderChrome && (
                <motion.footer
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <PublicFooter />
                </motion.footer>
            )}

            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <BottomNav />
            </motion.div>
        </div>
    )
}
