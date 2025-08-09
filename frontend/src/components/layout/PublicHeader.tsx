'use client'

import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function PublicHeader() {
    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-beacon-purple">
                        B3ACON
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
                        <Button variant="primary" size="sm">
                            Sign up
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}