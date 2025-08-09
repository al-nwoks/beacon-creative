'use client'

import RegisterForm from '@/components/forms/RegisterForm'

interface RegisterPageClientProps {
    defaultUserType?: 'creative' | 'client'
}

export default function RegisterPageClient({ defaultUserType }: RegisterPageClientProps) {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50">
            <main className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md">
                    <RegisterForm defaultUserType={defaultUserType} />
                </div>
            </main>
        </div>
    )
}