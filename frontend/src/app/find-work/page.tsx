'use client'

import Button from '@/components/ui/Button'
import { Award, Briefcase, CheckCircle, TrendingUp, UserCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export default function FindWork() {
    const steps = [
        {
            icon: <UserCheck className="h-8 w-8" />,
            title: 'Create Your Profile',
            description: 'Build a compelling profile showcasing your skills, experience, and portfolio to attract clients.'
        },
        {
            icon: <Briefcase className="h-8 w-8" />,
            title: 'Browse Projects',
            description: 'Explore opportunities that match your expertise and interests in our project marketplace.'
        },
        {
            icon: <Zap className="h-8 w-8" />,
            title: 'Submit Proposals',
            description: 'Craft personalized proposals to demonstrate your value and win projects.'
        },
        {
            icon: <TrendingUp className="h-8 w-8" />,
            title: 'Grow Your Career',
            description: 'Deliver exceptional work, build your reputation, and access even more opportunities.'
        }
    ]

    const benefits = [
        'Access to a global marketplace of creative opportunities',
        'Secure payment protection for all transactions',
        'Built-in project management and communication tools',
        'Portfolio showcasing and professional development resources',
        '24/7 customer support and dispute resolution',
        'Opportunity to build long-term client relationships'
    ]

    return (
        <div className="min-h-screen bg-neutral-50">

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Find Creative Work</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Connect with clients and grow your creative career through meaningful projects
                    </p>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Your Path to Success</h2>
                        <p className="text-xl text-neutral-700">
                            Our platform streamlines the process of finding and securing creative projects.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Why Creative Professionals Love B3ACON</h2>
                            <p className="text-xl text-neutral-700 mb-8">
                                Our platform is designed to help you succeed in your creative career.
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
                                        Start Finding Work
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

            {/* Success Stories Preview */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Success Stories</h2>
                        <p className="text-xl text-neutral-700">
                            Creative professionals like you are building successful careers through B3ACON.
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
                                &ldquo;B3ACON helped me transition from a hobbyist to a full-time freelance designer. I've earned over $50,000 in my first year!&rdquo;
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Alex Morgan</h4>
                                    <p className="text-neutral-600">Graphic Designer</p>
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
                                &ldquo;The quality of projects on B3ACON is exceptional. I've worked with amazing clients on projects I'm truly proud of.&rdquo;
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Jamie Chen</h4>
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
                                &ldquo;B3ACON's payment protection gives me peace of mind. I get paid on time, every time, and can focus on creating.&rdquo;
                            </p>
                            <div className="flex items-center">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                <div className="ml-4">
                                    <h4 className="font-semibold text-neutral-900">Taylor Williams</h4>
                                    <p className="text-neutral-600">Content Creator</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/success-stories">
                            <Button variant="outline">
                                View All Success Stories
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to advance your creative career?</h2>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Join thousands of creative professionals who have found success through B3ACON.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register?type=creative">
                            <Button variant="primary" size="lg">
                                Create Your Profile
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