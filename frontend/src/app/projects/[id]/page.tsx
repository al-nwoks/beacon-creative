import ProtectedRoute from '@/components/auth/ProtectedRoute'
import SimplifiedLayout from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'
import { ProjectDetails } from './ProjectDetails'

export const metadata: Metadata = {
    title: 'Project Details | B3ACON Creative Connect',
    description: 'View project details.',
}

export default function ProjectDetailsPage(props: any) {
    // Some Next.js setups (depending on PageProps generic) expect different typing for params.
    // Accept a loose props object to avoid the build-time PageProps constraint mismatch,
    // then safely read params.
    const params = props?.params ?? {}
    const { id } = params as { id?: string }

    // ProjectDetails is a client component that handles its own loading.
    // Keeping this page lightweight: pass the id and let the client component fetch/update as needed.
    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <header>
                    <h1 className="text-2xl font-bold text-neutral-900">Project Details</h1>
                    <p className="text-neutral-600 mt-1">View project details.</p>
                </header>

                <main>
                    <ProjectDetails id={id!} />
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}