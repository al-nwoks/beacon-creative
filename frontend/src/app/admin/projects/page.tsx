import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Gig } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Manage Gigs | B3ACON Admin',
    description: 'View and manage platform gigs.',
}

export default async function AdminProjectsPage() {
    // Fetch real data from the API
    let gigs: Gig[] = []

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            const gigsResp = await fetch(`${apiBase}/admin/gigs`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (gigsResp.ok) {
                const gigsData = await gigsResp.json()
                if (Array.isArray(gigsData)) {
                    gigs = gigsData as Gig[]
                }
            }
        }
    } catch (err) {
        console.error('Failed to fetch gigs', err)
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search gigs...">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Manage Gigs</h1>
                        <button className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                            Add New Gig
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        <div className="divide-y divide-neutral-200">
                            {gigs.map((gig) => (
                                <div key={gig.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-neutral-900">{gig.title}</h2>
                                            <p className="text-neutral-600 line-clamp-2">{gig.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-sm text-neutral-500">
                                                {gig.budget_min && gig.budget_max
                                                    ? `$${gig.budget_min} - $${gig.budget_max}`
                                                    : 'Budget not specified'}
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${gig.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                gig.status === 'hired' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {gig.status || 'active'}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button className="text-beacon-purple hover:underline text-sm font-medium">
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:underline text-sm font-medium">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-3 text-sm text-neutral-500">
                                        <span className="mr-4">
                                            Posted {gig.created_at ? new Date(gig.created_at).toLocaleDateString() : 'Unknown date'}
                                        </span>
                                        <span>
                                            Timeline: {gig.timeline_weeks || 'N/A'} weeks
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 rounded-md bg-beacon-purple text-white text-sm font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                2
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                3
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Next
                            </button>
                        </nav>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}