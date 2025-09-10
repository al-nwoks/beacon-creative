import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Browse Gigs | B3ACON Creative Connect',
    description: 'Find and apply to gigs that match your skills.',
}

export default function GigsPage() {
    // Mock data for gigs
    const gigs = [
        {
            id: '1',
            title: 'Brand Photography for Fashion Startup',
            description: 'We need high-quality product photography for our new fashion line. Looking for someone with experience in fashion photography and lighting.',
            budget: '$1,500 - $2,500',
            timeline: '4-6 weeks',
            posted: '2 days ago',
            skills: ['Photography', 'Fashion', 'Lighting', 'Photoshop'],
            category: 'Photography'
        },
        {
            id: '2',
            title: 'UI/UX Design for Mobile App',
            description: 'Design a complete user interface for our new fitness tracking mobile application. Experience with health and fitness apps preferred.',
            budget: '$3,000 - $5,000',
            timeline: '6-8 weeks',
            posted: '1 week ago',
            skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping'],
            category: 'Design'
        },
        {
            id: '3',
            title: 'Content Writing for Tech Blog',
            description: 'Looking for a technical writer to create engaging content for our technology blog. Must have experience with AI, cloud computing, and software development.',
            budget: '$500 - $1,000',
            timeline: '2-3 weeks',
            posted: '3 days ago',
            skills: ['Technical Writing', 'SEO', 'Content Strategy', 'Tech'],
            category: 'Writing'
        }
    ]

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search gigs...">
                <main className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Browse Gigs</h1>
                        <p className="text-neutral-600">Find and apply to gigs that match your skills and interests.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gigs.map((gig) => (
                            <div key={gig.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-2">{gig.title}</h2>
                                <p className="text-neutral-600 mb-4 line-clamp-3">{gig.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {gig.skills.slice(0, 3).map((skill, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                            {skill}
                                        </span>
                                    ))}
                                    {gig.skills.length > 3 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                            +{gig.skills.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mb-4 text-sm text-neutral-600">
                                    <span>{gig.budget}</span>
                                    <span>{gig.timeline}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-500">Posted {gig.posted}</span>
                                    <Button variant="outline" size="sm">View Details</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}