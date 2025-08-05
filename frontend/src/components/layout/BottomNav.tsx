'use client'

import BottomNavigation from '@/components/navigation/BottomNavigation'
import { motion } from 'framer-motion'

export function BottomNav() {
    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <BottomNavigation />
        </motion.div>
    )
}
