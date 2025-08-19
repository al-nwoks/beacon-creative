import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Browse Creatives | B3ACON Creative Connect',
    description: 'Find and connect with talented creatives.',
}

import CreativeCard from '@/components/dashboard/CreativeCard'

export default function CreativesPage() {
    // Mock data for creatives (now aligned with CreativeCard props)
    const creatives = [
        {
            id: '1',
            first_name: 'Alex',
            last_name: 'Johnson',
            creative_type: 'Graphic Designer',
            bio: 'Experienced brand designer focusing on identity systems and logos.',
            skills: ['Branding', 'Logo Design', 'Illustration'],
            hourly_rate: 45,
            profile_image_url: undefined,
            location: 'New York, NY',
            portfolio_links: ['https://alexjohnson.design'],
            is_verified: true,
            featured: false,
        },
        {
            id: '2',
            first_name: 'Maria',
            last_name: 'Garcia',
            creative_type: 'UI/UX Designer',
            bio: 'User-centered designer with a passion for research-driven interfaces.',
            skills: ['Figma', 'Prototyping', 'User Research'],
            hourly_rate: 65,
            profile_image_url: undefined,
            location: 'San Francisco, CA',
            portfolio_links: ['https://mariagarcia.design'],
            is_verified: true,
            featured: false,
        },
        {
            id: '3',
            first_name: 'David',
            last_name: 'Kim',
            creative_type: 'Frontend Developer',
            bio: 'Front-end engineer focused on performant React applications and accessible UI.',
            skills: ['React', 'TypeScript', 'Next.js'],
            hourly_rate: 75,
            profile_image_url: undefined,
            location: 'Austin, TX',
            portfolio_links: ['https://davidkim.dev'],
            is_verified: false,
            featured: false,
        },
        {
            id: '4',
            first_name: 'Sarah',
            last_name: 'Williams',
            creative_type: 'Content Writer',
            bio: 'Copywriter specializing in brand storytelling, blogs, and SEO content.',
            skills: ['Copywriting', 'SEO', 'Blog Posts'],
            hourly_rate: 35,
            profile_image_url: undefined,
            location: 'Chicago, IL',
            portfolio_links: ['https://sarahwrites.com'],
            is_verified: false,
            featured: false,
        },
        {
            id: '5',
            first_name: 'James',
            last_name: 'Brown',
            creative_type: 'Video Editor',
            bio: 'Editor and motion designer experienced in short-form and long-form video content.',
            skills: ['Premiere Pro', 'After Effects', 'Motion Graphics'],
            hourly_rate: 55,
            profile_image_url: undefined,
            location: 'Los Angeles, CA',
            portfolio_links: ['https://jamesbrownvids.com'],
            is_verified: true,
            featured: false,
        },
        {
            id: '6',
            first_name: 'Emma',
            last_name: 'Davis',
            creative_type: 'Photographer',
            bio: 'Fashion and lifestyle photographer available for editorials and commercial work.',
            skills: ['Portrait', 'Product', 'Event Photography'],
            hourly_rate: 85,
            profile_image_url: undefined,
            location: 'Los Angeles, CA',
            portfolio_links: ['https://emmadavis.photos'],
            is_verified: true,
            featured: true,
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
                            <CreativeCard
                                key={String(creative.id)}
                                id={String(creative.id)}
                                first_name={creative.first_name}
                                last_name={creative.last_name}
                                bio={creative.bio}
                                location={creative.location}
                                hourly_rate={creative.hourly_rate}
                                skills={creative.skills ?? []}
                                portfolio_links={creative.portfolio_links ?? []}
                                profile_image_url={creative.profile_image_url}
                                is_verified={creative.is_verified ?? false}
                                featured={creative.featured ?? false}
                                creative_type={creative.creative_type}
                            />
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