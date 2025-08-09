import ProtectedRoute from '@/components/auth/ProtectedRoute'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin Dashboard | B3ACON Creative Connect',
    description: 'Administrator dashboard.',
}

export default function AdminPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <div className="min-h-screen bg-neutral-50">
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
                        <p className="text-neutral-600 mt-1">Administrator dashboard.</p>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Admin Panel</h2>
                        <p className="text-neutral-600">Admin management features would be implemented here.</p>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}