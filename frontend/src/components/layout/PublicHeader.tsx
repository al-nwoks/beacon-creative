'use client'

import { B3aconLogo } from '@/components/icons/B3aconLogo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function PublicHeader() {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`)
    }

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <B3aconLogo className="h-8 w-auto" />
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link
                            href="/find-work"
                            className={`text-neutral-700 hover:text-beacon-purple transition-colors font-medium ${isActive('/find-work') ? 'text-beacon-purple' : ''}`}
                        >
                            For Creatives
                        </Link>
                        <Link
                            href="/gigs"
                            className={`text-neutral-700 hover:text-beacon-purple transition-colors font-medium ${isActive('/gigs') ? 'text-beacon-purple' : ''}`}
                        >
                            For Clients
                        </Link>
                        <Link
                            href="/how-it-works"
                            className={`text-neutral-700 hover:text-beacon-purple transition-colors font-medium ${isActive('/how-it-works') ? 'text-beacon-purple' : ''}`}
                        >
                            How It Works
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/register"
                            className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}