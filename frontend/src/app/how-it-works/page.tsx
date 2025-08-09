'use client'

import Button from '@/components/ui/Button'
import { CheckCircle, UserCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorks() {
    const steps = [
        {
            icon: <UserCheck className="h-8 w-8" />,
            title: 'Create Your Profile',
            description: 'Sign up and build a compelling profile showcasing your skills, experience, and portfolio.'
        },
        {
            icon: <Zap className="h-8 w-8" />,
            title: 'Find Opportunities',
            description: 'Browse through projects posted by clients or get matched with opportunities that fit your expertise.'
        },
        {
            icon: <CheckCircle className="h-8 w-8" />,
            title: 'Get Hired & Collaborate',
            description: 'Submit proposals, communicate with clients, and work together in our secure platform.'
        }
    ]

    const benefits = [
        'Access to a global marketplace of creative opportunities',
        'Secure payment protection for all transactions',
        'Built-in project management and communication tools',
        'Portfolio showcasing and professional development resources',
        '24/7 customer support and dispute resolution'
    ]

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">How B3ACON Works</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Connecting creative talent with opportunities has never been easier
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Simple Steps to Success</h2>
                        <p className="text-xl text-neutral-700">
                            Our platform streamlines the creative hiring process, making it easy for clients to find talent and for creatives to showcase their skills.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="bg-neutral-50 rounded-xl p-8 border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mb-6">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-neutral-900">{step.title}</h3>
                                <p className="text-neutral-700">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* For Creatives */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">For Creative Professionals</h2>
                            <p className="text-xl text-neutral-700 mb-8">
                                Find great projects, showcase your talents, and grow your creative career.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-beacon-purple mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-neutral-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register?type=creative">
                                    <Button variant="primary" size="lg">
                                        Get Started as a Creative
                                    </Button>
                                </Link>
                                <Link href="/creatives">
                                    <Button variant="secondary" size="lg">
                                        Browse Creative Profiles
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-full h-96" />
                        </div>
                    </div>
                </div>
            </section>

            {/* For Clients */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">For Clients & Businesses</h2>
                            <p className="text-xl text-neutral-700 mb-8">
                                Discover top creative talent and manage projects seamlessly from start to finish.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {benefits.map((benefit, index) => (
                                    <li key={`client-${index}`} className="flex items-start">
                                        <CheckCircle className="h-6 w-6 text-beacon-purple mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-neutral-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register?type=client">
                                    <Button variant="primary" size="lg">
                                        Get Started as a Client
                                    </Button>
                                </Link>
                                <Link href="/projects">
                                    <Button variant="secondary" size="lg">
                                        Browse Projects
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-full h-96" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Join thousands of creative professionals and clients already using B3ACON to connect, collaborate, and create amazing work.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register?type=client">
                            <Button variant="primary" size="lg">
                                Hire Creatives
                            </Button>
                        </Link>
                        <Link href="/register?type=creative">
                            <Button variant="secondary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                Find Work
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}