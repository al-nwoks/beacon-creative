'use client'

import { B3aconLogo } from '@/components/icons/B3aconLogo'
import Link from 'next/link'

/**
 * LoginHeader
 *
 * Minimal header used for auth pages (login / register).
 * Keeps branding and a subtle back link if needed.
 */
export default function LoginHeader() {
    return (
        <header className="bg-white border-b border-neutral-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Link href="/" className="inline-flex items-center">
                        <B3aconLogo className="h-8 w-auto" />
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-neutral-600 hover:text-neutral-800 text-sm">
                        Back to home
                    </Link>
                </div>
            </div>
        </header>
    )
}