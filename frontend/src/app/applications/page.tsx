import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Application } from '@/types/api'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'My Applications | B3ACON Creative Connect',
    description: 'View and manage your gig applications.',
}

export default function ApplicationsPage() {
    // Mock data for applications
    const applications: Application[] = [
        {
            id: '1',
            gig: {
                id: '101',
                title: 'Brand Photography for Fashion Startup',
                description: 'High-quality product photography for fashion line',
                budget_min: 1500,
                budget_max: 2500,
                timeline_weeks: 4,
                required_skills: ['Photography', 'Fashion', 'Lighting'],
                created_at: '2023-06-15T10:30:00Z',
                status: 'active'
            },
            status: 'pending',
            applied_at: '2023-06-20T14:30:00Z',
            cover_letter: 'I have extensive experience in fashion photography and would love to work on this gig.',
            proposed_budget: 2000,
            proposed_timeline_weeks: 3
        },
        {
            id: '2',
            gig: {
                id: '102',
                title: 'UI/UX Design for Mobile App',
                description: 'Design a complete user interface for fitness tracking app',
                budget_min: 3000,
                budget_max: 5000,
                timeline_weeks: 6,
                required_skills: ['UI/UX Design', 'Figma', 'Mobile Design'],
                created_at: '2023-06-10T09:15:00Z',
                status: 'active'
            },
            status: 'accepted',
            applied_at: '2023-06-12T11:45:00Z',
            cover_letter: 'My portfolio includes several successful mobile app designs. I\'m confident I can deliver exceptional results for your gig.',
            proposed_budget: 4500,
            proposed_timeline_weeks: 5
        },
        {
            id: '3',
            gig: {
                id: '103',
                title: 'Content Writing for Tech Blog',
                description: 'Technical writing for technology blog',
                budget_min: 500,
                budget_max: 1000,
                timeline_weeks: 2,
                required_skills: ['Technical Writing', 'SEO', 'Tech'],
                created_at: '2023-06-05T16:20:00Z',
                status: 'completed'
            },
            status: 'rejected',
            applied_at: '2023-06-07T09:30:00Z',
            cover_letter: 'I specialize in technical content and have written for several tech publications.',
            proposed_budget: 750,
            proposed_timeline_weeks: 2
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-100 text-green-800'
            case 'rejected':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-yellow-100 text-yellow-800'
        }
    }

    return (
        <ProtectedRoute requiredRole="creative">
            <SimplifiedLayout userType="creative">
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Applications</h1>
                        <p className="text-neutral-600">View and manage your gig applications.</p>
                    </div>

                    {applications.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                            <div className="divide-y divide-neutral-200">
                                {applications.map((application: any) => (
                                    <div key={application.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                                                    {typeof application.gig === 'object' && application.gig !== null
                                                        ? (application.gig as any).title || 'Untitled Gig'
                                                        : 'Gig'}
                                                </h2>
                                                <p className="text-neutral-600 mb-3">
                                                    {application.cover_letter}
                                                </p>
                                                <div className="flex items-center text-sm text-neutral-500">
                                                    <span>Applied {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Unknown date'}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>
                                                        Proposed: ${application.proposed_budget} in {application.proposed_timeline_weeks} weeks
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                                {application.status}
                                            </span>
                                        </div>
                                        <div className="mt-4">
                                            <Link href={`/gigs/${typeof application.gig === 'object' && application.gig !== null ? application.gig.id : ''}`} className="text-beacon-purple hover:underline text-sm font-medium">
                                                View Gig Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No applications yet</h2>
                            <p className="text-neutral-600 mb-6">Your gig applications will appear here once you apply to gigs.</p>
                            <a href="/gigs" className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                                Browse Gigs
                            </a>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}