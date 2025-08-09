import ProtectedRoute from '@/components/auth/ProtectedRoute'
import type { Metadata } from 'next'
import { CreativeProfile } from './CreativeProfile'

export const metadata: Metadata = {
    title: 'Creative Profile | B3ACON Creative Connect',
    description: 'View creative professional profile.',
}

export default function CreativeProfilePage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neutral-50">
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl font-bold text-neutral-900">Creative Profile</h1>
                        <p className="text-neutral-600 mt-1">View creative professional profile.</p>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <CreativeProfile id="1" />
                </main>
            </div>
        </ProtectedRoute>
    )
}