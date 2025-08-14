import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Browse Projects | B3ACON Creative Connect',
    description: 'Find and apply to projects that match your skills.',
}

export default function ProjectsPage() {
    // Mock data for projects
    const projects = [
        {
            id: 1,
            title: 'E-commerce Website Redesign',
            description: 'Redesign our e-commerce website to improve user experience and conversion rates. Looking for a talented UI/UX designer with experience in e-commerce platforms.',
            budget: '$3000 - $5000',
            timeline: '4 weeks',
            skills: ['UI/UX Design', 'E-commerce', 'Figma'],
            posted: '2 days ago',
        },
        {
            id: 2,
            title: 'Mobile App Development',
            description: 'Develop a cross-platform mobile app for our fitness tracking service. Experience with React Native or Flutter required.',
            budget: '$8000 - $12000',
            timeline: '12 weeks',
            skills: ['React Native', 'Flutter', 'Mobile Development'],
            posted: '1 week ago',
        },
        {
            id: 3,
            title: 'Brand Identity Package',
            description: 'Create a complete brand identity package including logo, color palette, typography, and brand guidelines for our sustainable products company.',
            budget: '$2000 - $3500',
            timeline: '3 weeks',
            skills: ['Logo Design', 'Brand Identity', 'Illustration'],
            posted: '3 days ago',
        },
        {
            id: 4,
            title: 'Content Marketing Strategy',
            description: 'Develop and implement a content marketing strategy to increase our organic traffic and lead generation. SEO and copywriting experience required.',
            budget: '$1500 - $2500',
            timeline: '6 weeks',
            skills: ['Content Strategy', 'SEO', 'Copywriting'],
            posted: '5 days ago',
        },
        {
            id: 5,
            title: 'Video Production for Product Launch',
            description: 'Create a promotional video for our upcoming product launch. Experience with product videography and editing required.',
            budget: '$4000 - $6000',
            timeline: '5 weeks',
            skills: ['Videography', 'Video Editing', 'Motion Graphics'],
            posted: '1 day ago',
        },
        {
            id: 6,
            title: 'Data Analysis Dashboard',
            description: 'Build a data visualization dashboard to display key business metrics. Experience with data visualization libraries and tools required.',
            budget: '$5000 - $7000',
            timeline: '8 weeks',
            skills: ['Data Visualization', 'Dashboard', 'Analytics'],
            posted: '4 days ago',
        },
    ]

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={true} searchPlaceholder="Search projects...">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Browse Projects</h1>
                        <div className="flex space-x-4">
                            <select className="rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple">
                                <option>All Categories</option>
                                <option>Design</option>
                                <option>Development</option>
                                <option>Marketing</option>
                                <option>Video</option>
                            </select>
                            <select className="rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple">
                                <option>Sort by: Newest</option>
                                <option>Sort by: Budget</option>
                                <option>Sort by: Timeline</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-2">{project.title}</h2>
                                <p className="text-neutral-600 mb-4 line-clamp-3">{project.description}</p>

                                <div className="mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {project.skills.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                {skill}
                                            </span>
                                        ))}
                                        {project.skills.length > 3 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                +{project.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-4 text-sm text-neutral-600">
                                    <span>{project.budget}</span>
                                    <span>{project.timeline}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-500">Posted {project.posted}</span>
                                    <Button variant="outline" size="sm">View Details</Button>
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