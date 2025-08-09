import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Client Dashboard | B3ACON Creative Connect',
    description: 'Manage your projects and find creative talent.',
}

import { cookies } from 'next/headers'

export default async function ClientDashboardPage() {
    // Read auth token from HttpOnly cookie on the server
    const token = (await cookies()).get('access_token')?.value

    // Example server-side fetch for dashboard data
    // Use internal Docker DNS and forward the bearer token. Ensure NEXT_PUBLIC_API_URL contains backend origin.
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000').replace(/\/+$/, '')
    const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

    // Fetch minimal "me" data to decide conditional UI; no-store for freshness
    const meResp = await fetch(`${apiBase}/users/me`, {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store',
    })

    // If not authorized on server, render a lightweight fallback (client ProtectedRoute or link to login)
    const isAuthed = meResp.ok
    const me = isAuthed ? await meResp.json() : null

    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-2">My Projects</h2>
                            <p className="text-neutral-600 mb-4">View and manage your active projects.</p>
                            <a href="/projects" className="inline-block bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                                View Projects
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Post a Project</h2>
                            <p className="text-neutral-600 mb-4">Create a new project and find the perfect creative talent.</p>
                            <a href="/projects/create" className="inline-block bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                                Create Project
                            </a>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-2">Messages</h2>
                            <p className="text-neutral-600 mb-4">Communicate with creatives about your projects.</p>
                            <a href="/messages" className="inline-block bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                                View Messages
                            </a>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}