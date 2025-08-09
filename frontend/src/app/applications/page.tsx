import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Applications | B3ACON Creative Connect',
    description: 'Your project applications.',
}

export default function ApplicationsPage() {
    const applications = [
        { id: 'a1', project: 'Website Redesign', status: 'Under Review', applied: '3 days ago', budget: '$3,000' },
        { id: 'a2', project: 'Logo Design', status: 'Accepted', applied: '1 week ago', budget: '$1,200' },
        { id: 'a3', project: 'Mobile App UI', status: 'Rejected', applied: '2 weeks ago', budget: '$4,500' },
    ]

    return (
        <ProtectedRoute>
            <SimplifiedLayout userType="creative" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-neutral-900">Applications</h1>
                        <p className="text-neutral-600 mt-1">Track the status of your project applications and follow up with clients.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Quick Actions</h3>
                            <div className="space-y-3">
                                <Button variant="outline" fullWidth className="justify-start">View Open Projects</Button>
                                <Button variant="outline" fullWidth className="justify-start">Manage Proposals</Button>
                            </div>
                        </aside>

                        <section className="lg:col-span-2 space-y-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-2">My Applications</h2>
                                <div className="divide-y">
                                    {applications.map((app) => (
                                        <div key={app.id} className="px-4 py-4 flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{app.project}</p>
                                                <p className="text-xs text-neutral-500">{app.applied} • {app.budget}</p>
                                            </div>
                                            <div className="ml-4 text-right">
                                                <span className={`text-sm font-medium ${app.status === 'Accepted' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{app.status}</span>
                                                <div className="mt-2">
                                                    <a href={`/applications/${app.id}`} className="text-sm text-beacon-purple hover:underline">View</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 text-center">
                                <p className="text-neutral-600">No additional actions required. Keep your profile and portfolio up to date to improve your chances of getting hired.</p>
                            </div>
                        </section>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}