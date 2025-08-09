import ProtectedRoute from '@/components/auth/ProtectedRoute'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Settings | B3ACON Creative Connect',
    description: 'Manage your account settings.',
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neutral-50">
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
                        <p className="text-neutral-600 mt-1">Manage your account settings.</p>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Account Settings</h2>
                        <p className="text-neutral-600">Account settings management features would be implemented here.</p>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}