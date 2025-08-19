'use client'

import { MainLayout } from '@/components/layout'
import Button from '@/components/ui/Button'
import { Briefcase, Clock, Globe, Heart, Lightbulb, MapPin, Target, Users } from 'lucide-react'
import Link from 'next/link'

export default function Careers() {
    const values = [
        { icon: <Heart className="h-8 w-8" />, title: 'Passion for Creativity', description: 'We believe in the power of creative expression to transform businesses and enrich lives.' },
        { icon: <Target className="h-8 w-8" />, title: 'Quality Focus', description: 'We are committed to connecting clients with only the highest quality creative talent.' },
        { icon: <Users className="h-8 w-8" />, title: 'Community First', description: 'We foster a supportive community where creatives and clients can thrive together.' },
        { icon: <Lightbulb className="h-8 w-8" />, title: 'Innovation', description: 'We continuously evolve our platform to meet the changing needs of the creative industry.' }
    ]

    const benefits = [
        'Competitive salary and equity package',
        'Comprehensive health, dental, and vision insurance',
        'Flexible work arrangements and remote options',
        'Professional development budget and learning opportunities',
        'Generous vacation and parental leave policies',
        'Wellness stipend and mental health support',
        'Latest equipment and tools for your role',
        'Regular team events and company retreats'
    ]

    const openPositions = [
        { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Build and maintain our cutting-edge creative platform using React, Next.js, and TypeScript.' },
        { title: 'Product Designer', department: 'Design', location: 'San Francisco, CA', type: 'Full-time', description: 'Create beautiful, intuitive user experiences for creative professionals and clients.' },
        { title: 'Community Manager', department: 'Marketing', location: 'New York, NY', type: 'Full-time', description: 'Build and nurture relationships with our creative community and business clients.' },
        { title: 'Senior Backend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Design and implement scalable backend services using Python, FastAPI, and PostgreSQL.' }
    ]

    return (
        <MainLayout>
            <div className="min-h-screen bg-neutral-50">

                {/* Hero Section */}
                <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Join Our Team</h1>
                            <p className="text-xl md:text-2xl mb-8 text-beacon-purple-light">
                                Help us build the future of creative work
                            </p>
                            <p className="text-lg mb-12">
                                We're looking for passionate, talented individuals to join our mission of connecting creative
                                talent with meaningful opportunities.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="#openings">
                                    <Button variant="primary" size="lg">
                                        View Open Positions
                                    </Button>
                                </Link>
                                <Link href="#benefits">
                                    <Button variant="secondary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                        Learn About Benefits
                                    </Button>
                                </Link>
                            </div>
                        </div>
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
                                <h3 className="text-2xl font-bold text-neutral-900 mb-4">Building the Creative Economy</h3>
                                <p className="text-neutral-700 text-lg">
                                    At B3ACON, we're not just building a platform - we're building the infrastructure for the
                                    future of work. Our team is passionate about creating tools and experiences that help
                                    creative professionals thrive and enable businesses to find the perfect talent for their
                                    most important projects.
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

                {/* Benefits Section */}
                <section id="benefits" className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Why Work With Us</h2>
                            <p className="text-xl text-neutral-700">
                                We invest in our team's success and well-being
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <div className="grid md:grid-cols-2 gap-8">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="w-2 h-2 bg-beacon-purple rounded-full mt-2 mr-4 flex-shrink-0"></div>
                                        <span className="text-neutral-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark rounded-2xl p-8 text-white text-center">
                                <h3 className="text-2xl font-bold mb-4">Diversity & Inclusion</h3>
                                <p className="text-beacon-purple-light mb-6">
                                    We believe that diverse teams build better products. B3ACON is committed to creating an
                                    inclusive environment where people from all backgrounds can thrive and contribute their
                                    unique perspectives.
                                </p>
                                <Button variant="secondary" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                    Learn About Our DEI Initiatives
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section id="openings" className="py-16 bg-neutral-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Open Positions</h2>
                            <p className="text-xl text-neutral-700">
                                Join us in building the future of creative work
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-6">
                            {openPositions.map((position, index) => (
                                <div key={index} className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow p-6">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{position.title}</h3>
                                            <p className="text-neutral-700 mb-4">{position.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                                                <div className="flex items-center">
                                                    <Briefcase className="h-4 w-4 mr-1" />
                                                    {position.department}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {position.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {position.type}
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="primary">
                                            Apply Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-neutral-700 mb-6">
                                Don't see a position that matches your skills? We're always looking for talented individuals.
                            </p>
                            <Button variant="outline">
                                Send Us Your Resume
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Culture Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Our Culture</h2>
                            <p className="text-xl text-neutral-700 mb-12">
                                A collaborative, innovative environment where creativity thrives
                            </p>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">Continuous Learning</h3>
                                    <p className="text-neutral-700">
                                        We encourage ongoing education and provide resources for professional development.
                                    </p>
                                </div>

                                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">Work-Life Balance</h3>
                                    <p className="text-neutral-700">
                                        We believe in sustainable productivity and support our team's well-being.
                                    </p>
                                </div>

                                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-3">Creative Freedom</h3>
                                    <p className="text-neutral-700">
                                        We empower our team to experiment, innovate, and bring their best ideas to life.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                            Join our team and help shape the future of creative work.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link href="#openings">
                                <Button variant="primary" size="lg">
                                    View Open Positions
                                </Button>
                            </Link>
                            <Button variant="secondary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                Contact Our Recruiting Team
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    )
}