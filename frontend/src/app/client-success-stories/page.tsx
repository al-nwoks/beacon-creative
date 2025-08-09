'use client'

import Button from '@/components/ui/Button'
import { Star } from 'lucide-react'
import Link from 'next/link'

export default function ClientSuccessStories() {
    const successStories = [
        {
            id: '1',
            client: 'Style Magazine',
            industry: 'Publishing',
            project: 'Brand Redesign & Marketing Campaign',
            challenge: 'Needed a complete brand overhaul to appeal to younger demographics',
            solution: 'Partnered with a team of designers and marketers through B3ACON',
            results: '40% increase in digital engagement and 25% growth in subscriptions',
            testimonial: "B3ACON helped us find the perfect creative team to transform our brand. The results exceeded our expectations.",
            clientName: 'John Smith',
            clientTitle: 'Creative Director',
            rating: 5,
            projectValue: '$75,000',
            duration: '4 months'
        },
        {
            id: '2',
            client: 'TechStart Inc.',
            industry: 'Technology',
            project: 'User Experience Design for Mobile App',
            challenge: 'Struggling with user retention due to poor app experience',
            solution: 'Hired UX specialists to redesign the entire user interface',
            results: '65% improvement in user retention and 4.8 app store rating',
            testimonial: "The UX team we found through B3ACON completely transformed our app. User satisfaction has never been higher.",
            clientName: 'Sarah Johnson',
            clientTitle: 'Product Manager',
            rating: 5,
            projectValue: '$120,000',
            duration: '6 months'
        },
        {
            id: '3',
            client: 'Global Retail Corp',
            industry: 'Retail',
            project: 'E-commerce Photography & Content Creation',
            challenge: 'Needed high-quality product photography for 500+ items',
            solution: 'Connected with professional photographers and content creators',
            results: '35% increase in online sales and improved brand perception',
            testimonial: "B3ACON made it easy to find talented photographers who understood our brand vision perfectly.",
            clientName: 'Michael Chen',
            clientTitle: 'Marketing Director',
            rating: 4,
            projectValue: '$45,000',
            duration: '2 months'
        }
    ]

    const stats = [
        {
            value: '98%',
            label: 'Client Satisfaction Rate'
        },
        {
            value: '25K+',
            label: 'Projects Completed'
        },
        {
            value: '75',
            label: 'Countries Represented'
        },
        {
            value: '4.9/5',
            label: 'Average Client Rating'
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
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Client Success Stories</h1>
                        <p className="text-xl md:text-2xl mb-8 text-beacon-purple-light">
                            See how businesses like yours have achieved remarkable results with B3ACON
                        </p>
                        <p className="text-lg mb-12">
                            Discover real stories from companies that have transformed their creative projects
                            and business outcomes by connecting with top talent through our platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">By the Numbers</h2>
                        <p className="text-xl text-neutral-700">
                            Our impact on business success
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-beacon-purple mb-2">{stat.value}</div>
                                <div className="text-neutral-700">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Featured Success Stories</h2>
                        <p className="text-xl text-neutral-700">
                            Real results from real businesses
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto space-y-12">
                        {successStories.map((story, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                                <div className="md:flex">
                                    <div className="md:w-1/3 bg-neutral-100 p-8 flex items-center justify-center">
                                        <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-full h-64" />
                                    </div>
                                    <div className="md:w-2/3 p-8">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{story.client}</h3>
                                                <p className="text-neutral-600">{story.industry} • {story.project}</p>
                                            </div>
                                            <div className="flex items-center bg-beacon-purple-light/20 text-beacon-purple px-4 py-2 rounded-full">
                                                <span className="font-semibold">{story.projectValue}</span>
                                                <span className="mx-2">•</span>
                                                <span>{story.duration}</span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                                            <div>
                                                <h4 className="font-semibold text-neutral-900 mb-2">The Challenge</h4>
                                                <p className="text-neutral-700">{story.challenge}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-neutral-900 mb-2">Our Solution</h4>
                                                <p className="text-neutral-700">{story.solution}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-neutral-900 mb-2">The Results</h4>
                                                <p className="text-neutral-700">{story.results}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-neutral-200 pt-6">
                                            <div className="flex items-center mb-4">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-5 w-5 ${i < story.rating ? 'fill-current' : ''}`} />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-neutral-600">{story.rating}/5</span>
                                            </div>
                                            <blockquote className="text-lg italic text-neutral-700 mb-4">
                                                "{story.testimonial}"
                                            </blockquote>
                                            <div className="flex items-center">
                                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-12 h-12" />
                                                <div className="ml-4">
                                                    <p className="font-semibold text-neutral-900">{story.clientName}</p>
                                                    <p className="text-neutral-600">{story.clientTitle}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">What Our Clients Say</h2>
                        <p className="text-xl text-neutral-700">
                            More feedback from businesses that have succeeded with B3ACON
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                "The quality of talent on B3ACON is exceptional. We've completed three projects with
                                different creative teams, and each has exceeded our expectations."
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Robert Davis</h4>
                                    <p className="text-neutral-600">CEO, Startup Ventures</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                "B3ACON's payment protection gave us peace of mind. The project was completed on time
                                and within budget, exactly as promised."
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Lisa Wang</h4>
                                    <p className="text-neutral-600">Marketing Director, Retail Co.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                    <Star className="h-5 w-5 fill-current" />
                                </div>
                            </div>
                            <p className="text-neutral-700 mb-6">
                                "Finding the right creative partner used to be a challenge. B3ACON made it simple to
                                connect with talented professionals who understood our vision."
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">David Rodriguez</h4>
                                    <p className="text-neutral-600">Founder, Tech Solutions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to achieve your own success story?</h2>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Join thousands of businesses that have transformed their creative projects with B3ACON.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register?type=client">
                            <Button variant="primary" size="lg">
                                Post Your Project
                            </Button>
                        </Link>
                        <Link href="/how-to-hire">
                            <Button variant="secondary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                Learn How It Works
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}