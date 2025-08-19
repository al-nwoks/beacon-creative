'use client'

import { MainLayout } from '@/components/layout'
import Button from '@/components/ui/Button'
import { Globe, Heart, Lightbulb, Target, Users } from 'lucide-react'
import Link from 'next/link'

export default function About() {
    const values = [
        { icon: <Heart className="h-8 w-8" />, title: 'Passion for Creativity', description: 'We believe in the power of creative expression to transform businesses and enrich lives.' },
        { icon: <Target className="h-8 w-8" />, title: 'Quality Focus', description: 'We are committed to connecting clients with only the highest quality creative talent.' },
        { icon: <Users className="h-8 w-8" />, title: 'Community First', description: 'We foster a supportive community where creatives and clients can thrive together.' },
        { icon: <Lightbulb className="h-8 w-8" />, title: 'Innovation', description: 'We continuously evolve our platform to meet the changing needs of the creative industry.' }
    ]

    const team = [
        { name: 'Alex Johnson', role: 'Founder & CEO', bio: 'Creative industry veteran with 15+ years of experience connecting talent with opportunity.' },
        { name: 'Maria Garcia', role: 'Chief Technology Officer', bio: 'Tech innovator focused on creating seamless platforms for creative collaboration.' },
        { name: 'David Kim', role: 'Head of Talent Relations', bio: 'Passionate advocate for creative professionals and their career development.' },
        { name: 'Sarah Williams', role: 'Client Success Director', bio: 'Dedicated to ensuring exceptional experiences for our business clients.' }
    ]

    return (
        <MainLayout>
            <div className="min-h-screen bg-neutral-50">
                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About B3ACON</h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                            Connecting creative talent with opportunities worldwide
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Our Mission</h2>
                            <p className="text-xl text-neutral-700 mb-12">
                                To empower creative professionals and businesses by providing a seamless platform for collaboration, growth, and success.
                            </p>

                            <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 shadow-sm">
                                <Globe className="h-16 w-16 text-beacon-purple mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Bridging the Creative Gap</h3>
                                <p className="text-neutral-700 text-lg">
                                    Founded in 2023, B3ACON was born from the recognition that talented creative professionals
                                    often struggle to find quality opportunities, while businesses frequently have difficulty
                                    discovering and connecting with the right creative talent. We set out to solve this problem
                                    by creating a platform that bridges this gap, making it easier for both sides to find each other
                                    and collaborate successfully.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Our Core Values</h2>
                            <p className="text-xl text-neutral-700">
                                The principles that guide everything we do at B3ACON
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <div key={index} className="bg-white rounded-xl p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow text-center">
                                    <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mx-auto mb-6">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-neutral-900">{value.title}</h3>
                                    <p className="text-neutral-700">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Our Leadership Team</h2>
                            <p className="text-xl text-neutral-700">
                                The passionate individuals driving B3ACON forward
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map((member, index) => (
                                <div key={index} className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm text-center">
                                    <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-neutral-900 mb-1">{member.name}</h3>
                                    <p className="text-beacon-purple font-medium mb-3">{member.role}</p>
                                    <p className="text-neutral-700 text-sm">
                                        {member.bio}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">By the Numbers</h2>
                            <p className="text-xl text-beacon-purple-light">
                                Our impact on the creative community
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                                <div className="text-beacon-purple-light">Creative Professionals</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-2">5K+</div>
                                <div className="text-beacon-purple-light">Active Projects</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
                                <div className="text-beacon-purple-light">Client Satisfaction</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                                <div className="text-beacon-purple-light">Support Available</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-neutral-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">Join Our Community</h2>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-neutral-700">
                            Whether you're a creative professional looking for opportunities or a business seeking talent,
                            we'd love to have you as part of the B3ACON community.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="/register?type=creative">
                                <Button variant="primary" size="lg">
                                    Join as Creative
                                </Button>
                            </Link>
                            <Link href="/register?type=client">
                                <Button variant="secondary" size="lg">
                                    Join as Client
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    )
}