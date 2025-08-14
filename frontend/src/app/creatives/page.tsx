import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Browse Creatives | B3ACON Creative Connect',
    description: 'Find and connect with talented creatives.',
}

export default function CreativesPage() {
    // Mock data for creatives
    const creatives = [
        {
            id: 1,
            name: 'Alex Johnson',
            role: 'Graphic Designer',
            skills: ['Branding', 'Logo Design', 'Illustration'],
            rating: 4.8,
            projects: 24,
            hourlyRate: 45,
        },
        {
            id: 2,
            name: 'Maria Garcia',
            role: 'UI/UX Designer',
            skills: ['Figma', 'Prototyping', 'User Research'],
            rating: 4.9,
            projects: 32,
            hourlyRate: 65,
        },
        {
            id: 3,
            name: 'David Kim',
            role: 'Frontend Developer',
            skills: ['React', 'TypeScript', 'Next.js'],
            rating: 4.7,
            projects: 18,
            hourlyRate: 75,
        },
        {
            id: 4,
            name: 'Sarah Williams',
            role: 'Content Writer',
            skills: ['Copywriting', 'SEO', 'Blog Posts'],
            rating: 4.9,
            projects: 42,
            hourlyRate: 35,
        },
        {
            id: 5,
            name: 'James Brown',
            role: 'Video Editor',
            skills: ['Premiere Pro', 'After Effects', 'Motion Graphics'],
            rating: 4.6,
            projects: 15,
            hourlyRate: 55,
        },
        {
            id: 6,
            name: 'Emma Davis',
            role: 'Photographer',
            skills: ['Portrait', 'Product', 'Event Photography'],
            rating: 4.8,
            projects: 28,
            hourlyRate: 85,
        },
    ]

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search creatives...">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Browse Creatives</h1>
                        <div className="flex space-x-4">
                            <select className="rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple">
                                <option>All Roles</option>
                                <option>Designers</option>
                                <option>Developers</option>
                                <option>Writers</option>
                            </select>
                            <select className="rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple">
                                <option>Sort by: Rating</option>
                                <option>Sort by: Projects</option>
                                <option>Sort by: Hourly Rate</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {creatives.map((creative) => (
                            <div key={creative.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16 flex-shrink-0" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-neutral-900">{creative.name}</h2>
                                        <p className="text-neutral-600">{creative.role}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {creative.skills.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                {skill}
                                            </span>
                                        ))}
                                        {creative.skills.length > 3 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                +{creative.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-4 h-4 ${i < Math.floor(creative.rating) ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-neutral-600">{creative.rating}</span>
                                    </div>
                                    <span className="text-sm text-neutral-600">{creative.projects} projects</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-neutral-900">${creative.hourlyRate}/hr</span>
                                    <Button variant="outline" size="sm">View Profile</Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <Button variant="outline">Previous</Button>
                            <Button variant="outline" className="bg-beacon-purple text-white">1</Button>
                            <Button variant="outline">2</Button>
                            <Button variant="outline">3</Button>
                            <Button variant="outline">Next</Button>
                        </nav>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}