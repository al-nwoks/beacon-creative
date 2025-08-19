'use client'

import { B3aconLogo } from '@/components/icons/B3aconLogo'
import Link from 'next/link'

export default function PublicHeader() {
    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-beacon-purple">
                        <B3aconLogo className="h-8 w-auto" />
                    </Link>
                </div>
                <nav className="hidden md:flex items-center space-x-6" aria-label="Main">
                    <Link href="/creatives" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                        For Creatives
                    </Link>
                    <Link href="/projects" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                        For Clients
                    </Link>
                    <Link href="/how-it-works" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                        How It Works
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <Link href="/login" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium hidden sm:block">
                        Log in
                    </Link>
                    <Link href="/register">
                        <a className="inline-flex items-center justify-center px-3 py-1.5 bg-beacon-purple text-white rounded text-sm">Sign up</a>
                    </Link>
                </div>
            </div>
        </header>
    )
}