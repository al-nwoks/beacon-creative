import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { serverFetch } from '@/lib/api'
import type { Application } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'My Applications | B3ACON Creative Connect',
    description: 'View and manage your project applications.',
}

export default async function ApplicationsPage() {
    let applications: Application[] = []

    try {
        // Fetch user's applications
        const applicationsResp = await serverFetch('/applications/me')
        if (Array.isArray(applicationsResp)) {
            applications = applicationsResp as Application[]
        }
    } catch (err) {
        console.error('Failed to fetch applications', err)
    }

    return (
        <ProtectedRoute requiredRole="creative">
            <SimplifiedLayout userType="creative" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">My Applications</h1>

                    {applications.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 divide-y divide-neutral-200">
                            {applications.map((application) => (
                                <div key={application.id} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-neutral-900">
                                                {typeof application.project === 'object' && application.project !== null
                                                    ? (application.project as any).title || 'Untitled Project'
                                                    : 'Project'}
                                            </h2>
                                            <p className="text-neutral-600">
                                                Applied on {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Unknown date'}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {application.status || 'Pending'}
                                        </span>
                                    </div>

                                    {application.cover_letter && (
                                        <div className="mb-4">
                                            <h3 className="text-sm font-medium text-neutral-700 mb-1">Cover Letter</h3>
                                            <p className="text-neutral-600">{application.cover_letter}</p>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-neutral-500">
                                            {application.proposed_budget && (
                                                <span className="mr-4">Proposed Budget: ${application.proposed_budget}</span>
                                            )}
                                            {application.proposed_timeline_weeks && (
                                                <span>Timeline: {application.proposed_timeline_weeks} weeks</span>
                                            )}
                                        </div>
                                        <button className="text-beacon-purple hover:underline text-sm font-medium">
                                            View Project Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No applications yet</h2>
                            <p className="text-neutral-600 mb-6">Your project applications will appear here once you apply to projects.</p>
                            <a href="/projects" className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                                Browse Projects
                            </a>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}