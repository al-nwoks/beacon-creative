'use client'

import Button from '@/components/ui/Button'
import { Award, BookOpen, Lightbulb, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export default function CreativeResources() {
    const resourceCategories = [
        {
            icon: <BookOpen className="h-8 w-8" />,
            title: 'Learning & Development',
            description: 'Courses, tutorials, and educational resources to advance your creative skills',
            resources: [
                'Online courses and workshops',
                'Skill assessments and certifications',
                'Industry best practices guides',
                'Software tutorials'
            ]
        },
        {
            icon: <TrendingUp className="h-8 w-8" />,
            title: 'Career Growth',
            description: 'Tools and guidance for advancing your creative career',
            resources: [
                'Portfolio building tips',
                'Pricing and negotiation guides',
                'Client management strategies',
                'Business development resources'
            ]
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: 'Community & Networking',
            description: 'Connect with fellow creatives and build professional relationships',
            resources: [
                'Industry events and meetups',
                'Professional networking groups',
                'Mentorship programs',
                'Collaboration opportunities'
            ]
        },
        {
            icon: <Lightbulb className="h-8 w-8" />,
            title: 'Inspiration & Trends',
            description: 'Stay current with creative trends and find inspiration for your work',
            resources: [
                'Industry trend reports',
                'Creative showcase galleries',
                'Success story case studies',
                'Innovation spotlights'
            ]
        }
    ]

    const featuredResources = [
        {
            title: 'Building a Standout Creative Portfolio',
            type: 'Guide',
            duration: '15 min read',
            description: 'Learn how to showcase your best work and attract high-value clients.'
        },
        {
            title: 'Pricing Your Creative Services',
            type: 'Video',
            duration: '22 min',
            description: 'Expert advice on setting rates that reflect your value and expertise.'
        },
        {
            title: 'Client Communication Best Practices',
            type: 'Webinar',
            duration: '1 hour',
            description: 'Master the art of clear, professional communication with clients.'
        },
        {
            title: '2023 Creative Industry Trends Report',
            type: 'Report',
            duration: '32 pages',
            description: 'Comprehensive analysis of emerging trends across creative disciplines.'
        }
    ]

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-beacon-purple">
                            B3ACON
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                            Log in
                        </Link>
                        <Link href="/register">
                            <Button variant="primary" size="sm">
                                Sign up
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Creative Resources</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Tools, guides, and inspiration to help you grow your creative career
                    </p>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Resource Categories</h2>
                        <p className="text-xl text-neutral-700">
                            Explore our comprehensive collection of resources designed for creative professionals
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {resourceCategories.map((category, index) => (
                            <div key={index} className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mb-6">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-neutral-900">{category.title}</h3>
                                <p className="text-neutral-700 mb-6">
                                    {category.description}
                                </p>
                                <ul className="space-y-2">
                                    {category.resources.map((resource, resourceIndex) => (
                                        <li key={resourceIndex} className="flex items-start">
                                            <div className="w-2 h-2 bg-beacon-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-neutral-700">{resource}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Resources */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Featured Resources</h2>
                            <p className="text-xl text-neutral-700">
                                Our most popular guides, videos, and tools for creative professionals
                            </p>
                        </div>
                        <Button variant="outline">
                            View All Resources
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {featuredResources.map((resource, index) => (
                            <div key={index} className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 bg-beacon-purple-light/20 text-beacon-purple text-xs font-medium rounded-full">
                                            {resource.type}
                                        </span>
                                        <span className="text-neutral-500 text-sm">
                                            {resource.duration}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-neutral-900 mb-3">{resource.title}</h3>
                                    <p className="text-neutral-700 mb-6">
                                        {resource.description}
                                    </p>
                                    <Button variant="primary" className="w-full">
                                        Access Resource
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Success Stories</h2>
                        <p className="text-xl text-neutral-700">
                            How creative professionals have used our resources to advance their careers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                &ldquo;The portfolio building guide helped me redesign my portfolio, which led to a 40% increase in project inquiries.&rdquo;
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Jessica Miller</h4>
                                    <p className="text-neutral-600">UI/UX Designer</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                &ldquo;The pricing guide helped me double my rates while attracting higher-quality clients.&rdquo;
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Marcus Johnson</h4>
                                    <p className="text-neutral-600">Photographer</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                    <Award className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                &ldquo;The client communication webinar transformed how I work with clients and reduced project revisions by 60%.&rdquo;
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Sophia Chen</h4>
                                    <p className="text-neutral-600">Content Creator</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to take your creative career to the next level?</h2>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Join our community of creative professionals and access exclusive resources.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register?type=creative">
                            <Button variant="primary" size="lg">
                                Join B3ACON
                            </Button>
                        </Link>
                        <Link href="/find-work">
                            <Button variant="secondary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}