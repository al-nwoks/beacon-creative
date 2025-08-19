import ProtectedRoute from '@/components/auth/ProtectedRoute'
import SimplifiedLayout from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'
import { CreativeProfile } from './CreativeProfile'

export const metadata: Metadata = {
    title: 'Creative Profile | B3ACON Creative Connect',
    description: 'View creative professional profile.',
}

export default function CreativeProfilePage() {
    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <header>
                    <h1 className="text-2xl font-bold text-neutral-900">Creative Profile</h1>
                    <p className="text-neutral-600 mt-1">View creative professional profile.</p>
                </header>

                <main>
                    <CreativeProfile id="1" />
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}