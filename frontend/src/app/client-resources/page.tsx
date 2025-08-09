'use client'

import Button from '@/components/ui/Button'
import { ArrowRight, BookOpen, CheckCircle, FileText, Shield, ThumbsUp, Users } from 'lucide-react'
import Link from 'next/link'

export default function ClientResources() {
    const guides = [
        {
            icon: <FileText className="h-8 w-8" />,
            title: 'Writing a Great Brief',
            desc: 'How to describe your project clearly to attract the right creatives.',
            href: '/how-to-hire',
        },
        {
            icon: <ThumbsUp className="h-8 w-8" />,
            title: 'Selecting the Right Creative',
            desc: 'Review portfolios, proposals, and fit to make a confident hire.',
            href: '/talent-marketplace',
        },
        {
            icon: <Shield className="h-8 w-8" />,
            title: 'Safe Payments & Milestones',
            desc: 'Use milestones to control scope and release funds securely.',
            href: '/how-it-works',
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: 'Collaborating Effectively',
            desc: 'Best practices for feedback cycles, file sharing, and timelines.',
            href: '/community',
        },
    ]

    const checklist = [
        'Define clear project goals and success criteria',
        'Set a realistic budget and timeframe',
        'Provide brand assets and references',
        'Agree on milestones and deliverables',
        'Establish communication cadence',
        'Plan review/approval checkpoints',
    ]

    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-neutral-50 border-b border-neutral-200">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Client Resources</h1>
                        <p className="text-xl text-neutral-700">
                            Practical guides, checklists, and templates to help you hire and collaborate with top creative talent.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/how-to-hire">
                                <Button variant="primary">
                                    How to Hire Creatives
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/talent-marketplace">
                                <Button variant="secondary">Explore Talent</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guides */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {guides.map((g, idx) => (
                        <Link
                            key={idx}
                            href={g.href}
                            className="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="w-14 h-14 rounded-lg bg-beacon-purple-light/20 text-beacon-purple flex items-center justify-center mb-4">
                                {g.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">{g.title}</h3>
                            <p className="text-neutral-600">{g.desc}</p>
                            <div className="mt-4 inline-flex items-center text-beacon-purple font-medium group-hover:underline">
                                Read more
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Checklist */}
            <section className="bg-neutral-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">Project Kickoff Checklist</h2>
                        <ul className="space-y-3">
                            {checklist.map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-beacon-purple mt-1 mr-3 flex-shrink-0" />
                                    <span className="text-neutral-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-white rounded-2xl p-10 border border-neutral-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-lg bg-beacon-purple-light/20 text-beacon-purple flex items-center justify-center">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-neutral-900">New to B3ACON?</h3>
                                <p className="text-neutral-600">Start with our quick guide to posting your first project.</p>
                            </div>
                        </div>
                        <Link href="/how-it-works">
                            <Button variant="primary">See How It Works</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}