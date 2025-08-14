'use client'

import Button from '@/components/ui/Button'
import { CheckCircle, FileText, MessageCircle, Search, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export default function HowToHire() {
    const steps = [
        {
            icon: <Search className="h-8 w-8" />,
            title: 'Define Your Project',
            description: 'Clearly outline your project requirements, budget, and timeline to attract the right talent.'
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: 'Browse Talent',
            description: 'Search our curated marketplace of verified creative professionals by skills, experience, and portfolio.'
        },
        {
            icon: <MessageCircle className="h-8 w-8" />,
            title: 'Connect & Communicate',
            description: 'Engage with candidates through our secure messaging system to discuss project details.'
        },
        {
            icon: <FileText className="h-8 w-8" />,
            title: 'Review Proposals',
            description: 'Evaluate applications and proposals to select the best fit for your project.'
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: 'Secure Collaboration',
            description: 'Use our protected workspace and milestone-based payment system for peace of mind.'
        },
        {
            icon: <CheckCircle className="h-8 w-8" />,
            title: 'Complete Project',
            description: 'Approve deliverables and release payments when milestones are successfully completed.'
        }
    ]

    const benefits = [
        'Access to pre-vetted, top-tier creative talent',
        'Transparent pricing with no hidden fees',
        'Secure payment protection for all transactions',
        'Built-in project management tools',
        '24/7 customer support',
        'Dispute resolution services'
    ]

    return (
        <div className="min-h-screen bg-neutral-50">

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">How to Hire Creative Talent</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Find and collaborate with the perfect creative professionals for your projects
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Simple Steps to Success</h2>
                        <p className="text-xl text-neutral-700">
                            Our streamlined hiring process makes it easy to find, connect with, and collaborate with creative talent.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            {/* Benefits Section */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Why Hire Through B3ACON</h2>
                            <p className="text-xl text-neutral-700 mb-8">
                                Our platform provides everything you need to successfully hire and manage creative projects.
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
                                <Link href="/register?type=client">
                                    <Button variant="primary" size="lg">
                                        Get Started Hiring
                                    </Button>
                                </Link>
                                <Link href="/talent-marketplace">
                                    <Button variant="secondary" size="lg">
                                        Browse Talent Marketplace
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your perfect creative match?</h2>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Join thousands of businesses that have successfully hired creative talent through B3ACON.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register?type=client">
                            <Button variant="primary" size="lg">
                                Post a Project
                            </Button>
                        </Link>
                        <Link href="/how-it-works">
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