'use client'

import { motion } from 'framer-motion'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { Header } from './Header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <Header />
            </motion.header>

            <motion.main
                className="flex-grow pb-16 md:pb-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.main>

            <motion.footer
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <Footer />
            </motion.footer>

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
