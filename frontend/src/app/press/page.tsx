'use client'

import { MainLayout } from '@/components/layout'
import Button from '@/components/ui/Button'
import { Mail, Newspaper } from 'lucide-react'

export default function Press() {
    const pressReleases = [
        { title: 'B3ACON Announces $15M Series A Funding to Expand Global Creative Marketplace', date: 'May 15, 2023', summary: 'Platform plans to double its creative talent base and expand into new international markets.' },
        { title: 'B3ACON Partners with Leading Design Schools to Launch Student Talent Program', date: 'April 3, 2023', summary: 'New initiative connects emerging creative talent with businesses seeking fresh perspectives.' },
        { title: 'B3ACON Reports 300% Growth in Creative Professionals Year-Over-Year', date: 'March 1, 2023', summary: 'Platform reaches milestone of 50,000+ registered creative professionals across 75 countries.' },
        { title: 'B3ACON Launches New AI-Powered Project Matching Technology', date: 'February 14, 2023', summary: 'Innovative system connects businesses with the most suitable creative talent for their projects.' }
    ]

    const mediaAssets = [
        { title: 'Company Logo', format: 'PNG, SVG', size: '1024px' },
        { title: 'Founder Headshots', format: 'JPG', size: 'High Resolution' },
        { title: 'Brand Guidelines', format: 'PDF', size: 'Complete Kit' },
        { title: 'Product Screenshots', format: 'PNG', size: 'Various Sizes' }
    ]

    const stats = [
        { value: '50K+', label: 'Creative Professionals' },
        { value: '25K+', label: 'Active Projects' },
        { value: '75', label: 'Countries Represented' },
        { value: '98%', label: 'Client Satisfaction Rate' }
    ]

    return (
        <MainLayout>
            <div className="min-h-screen bg-neutral-50">
                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Press & Media</h1>
                            <p className="text-xl md:text-2xl mb-8 text-beacon-purple-light">
                                Latest news, press releases, and media resources
                            </p>
                            <p className="text-lg mb-12">
                                Stay up-to-date with B3ACON's latest announcements, milestones, and industry insights.
                                For media inquiries, please contact our press team.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button variant="primary" size="lg">
                                    Contact Press Team
                                </Button>
                                <Button variant="secondary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                    Download Media Kit
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">By the Numbers</h2>
                            <p className="text-xl text-neutral-700">
                                Our impact on the creative economy
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

                {/* Latest Press Releases */}
                <section className="py-16 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Latest Press Releases</h2>
                                <p className="text-xl text-neutral-700">
                                    Official announcements and company news
                                </p>
                            </div>
                            <Button variant="outline">
                                View All Releases
                            </Button>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-6">
                            {pressReleases.map((release, index) => (
                                <div key={index} className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <div className="text-neutral-600 mb-2">{release.date}</div>
                                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{release.title}</h3>
                                            <p className="text-neutral-700">
                                                {release.summary}
                                            </p>
                                        </div>
                                        <Button variant="primary">
                                            Read Full Release
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Media Kit */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Media Kit</h2>
                            <p className="text-xl text-neutral-700">
                                Download our official brand assets and resources
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                {mediaAssets.map((asset, index) => (
                                    <div key={index} className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow text-center">
                                        <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mx-auto mb-4">
                                            <Newspaper className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">{asset.title}</h3>
                                        <div className="text-neutral-600 text-sm">
                                            <div>{asset.format}</div>
                                            <div>{asset.size}</div>
                                        </div>
                                        <Button variant="outline" size="sm" className="mt-4 w-full">
                                            Download
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-r from-beacon-purple to-beacon-purple-dark rounded-2xl p-8 text-white text-center">
                                <h3 className="text-2xl font-bold mb-4">Brand Guidelines</h3>
                                <p className="text-beacon-purple-light mb-6">
                                    Our comprehensive brand guidelines ensure consistent and accurate representation
                                    of B3ACON across all media channels.
                                </p>
                                <Button variant="secondary" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                    Download Complete Brand Guidelines
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Press Contact */}
                <section className="py-16 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl p-8 border border-neutral-200 shadow-sm">
                                <div className="text-center">
                                    <Mail className="h-16 w-16 text-beacon-purple mx-auto mb-6" />
                                    <h2 className="text-3xl font-bold text-neutral-900 mb-4">Press Inquiries</h2>
                                    <p className="text-xl text-neutral-700 mb-8">
                                        For media requests, interviews, or press kit information, please contact our team.
                                    </p>
                                    <div className="bg-neutral-50 rounded-xl p-6 mb-8">
                                        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Media Relations Team</h3>
                                        <p className="text-neutral-700 mb-1">
                                            <strong>Email:</strong> press@b3acon.com
                                        </p>
                                        <p className="text-neutral-700">
                                            <strong>Phone:</strong> +1 (555) 123-4567
                                        </p>
                                    </div>
                                    <Button variant="primary" size="lg">
                                        Send Message
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Updated</h2>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                            Subscribe to our press newsletter for the latest updates and announcements.
                        </p>
                        <div className="max-w-2xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-6 py-4 rounded-full text-neutral-900 text-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple"
                                />
                                <Button variant="secondary" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                    Subscribe
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    )
}