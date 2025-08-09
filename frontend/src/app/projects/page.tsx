'use client'

import { MainLayout } from '@/components/layout'
import Button from '@/components/ui/Button'
import { Filter, Search } from 'lucide-react'

export default function ProjectsPage() {
    // Mock projects for initial UI
    const projects = [
        { id: '1', title: 'E-commerce Website Design', budget: '$3,000 - $5,000', skills: ['UI/UX', 'Figma'], posted: '3 days ago' },
        { id: '2', title: 'Brand Identity Package', budget: '$2,000 - $3,500', skills: ['Logo Design', 'Illustrator'], posted: '5 days ago' },
        { id: '3', title: 'Mobile App UI Design', budget: '$4,000 - $6,000', skills: ['Mobile Design', 'Prototyping'], posted: '1 week ago' },
    ]

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Projects</h1>
                    <p className="text-neutral-600">Discover projects that match your skills and apply with a compelling proposal.</p>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search projects by title, skill or company..."
                                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50">
                                <Filter className="h-4 w-4 text-neutral-600" />
                                Filters
                            </button>
                            <Button variant="primary">Post a Project</Button>
                        </div>
                    </div>
                </div>

                {/* Projects grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                        <div key={p.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-neutral-900">{p.title}</h2>
                                    <p className="text-sm text-neutral-600 mt-1">{p.skills.join(' • ')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-neutral-900">{p.budget}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{p.posted}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <a href={`/projects/${p.id}`} className="text-sm text-beacon-purple hover:underline">View details</a>
                                <a href={`/projects/${p.id}#apply`} className="inline-block bg-beacon-purple text-white px-3 py-1 rounded-md text-sm">Apply</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    )
}