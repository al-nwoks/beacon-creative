'use client'

import LoginForm from '@/components/forms/LoginForm'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface LoginPageClientProps {
    redirectUrl: string | null
}

export default function LoginPageClient({ redirectUrl }: LoginPageClientProps) {
    const searchParams = useSearchParams()
    const redirect = redirectUrl || searchParams?.get('redirect') || null

    useEffect(() => {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) return
            if (redirect) {
                window.location.replace(redirect)
            }
        } catch {
            // ignore storage access issues
        }
    }, [redirect])

    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <LoginForm redirectUrl={redirect || undefined} />
                </div>
            </main>
        </div>
    )
}