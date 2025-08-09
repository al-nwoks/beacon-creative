import ProtectedRoute from '@/components/auth/ProtectedRoute'
import type { Metadata } from 'next'
import { ProjectDetails } from './ProjectDetails'

export const metadata: Metadata = {
    title: 'Project Details | B3ACON Creative Connect',
    description: 'View project details.',
}

export default function ProjectDetailsPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-neutral-50">
                <header className="bg-white shadow">
                    <div className="container mx-auto px-4 py-6">
                        <h1 className="text-2xl font-bold text-neutral-900">Project Details</h1>
                        <p className="text-neutral-600 mt-1">View project details.</p>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <ProjectDetails id="1" />
                </main>
            </div>
        </ProtectedRoute>
    )
}