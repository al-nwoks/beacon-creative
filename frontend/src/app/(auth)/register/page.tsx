import RegisterForm from '@/components/forms/RegisterForm';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Create Account | B3ACON Creative Connect',
    description: 'Join B3ACON to connect with creative professionals and clients. Create your account today.',
}

import type { PageProps } from '@/types/common';

export default async function RegisterPage({
    searchParams,
}: PageProps) {
    // Get the user type from the URL query parameter
    const params = await searchParams;
    const userType = params && typeof params.type === 'string'
        ? (params.type === 'client' ? 'client' : 'creative')
        : undefined

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/" className="text-2xl font-bold text-beacon-blue">
                        B3ACON
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <RegisterForm defaultUserType={userType} />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-sm text-neutral-500">
                <div className="container mx-auto px-4">
                    <p>&copy; {new Date().getFullYear()} B3ACON Creative Connect. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <Link href="/terms" className="hover:text-beacon-blue">Terms</Link>
                        <Link href="/privacy" className="hover:text-beacon-blue">Privacy</Link>
                        <Link href="/help" className="hover:text-beacon-blue">Help</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}