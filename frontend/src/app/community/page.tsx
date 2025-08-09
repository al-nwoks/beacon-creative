'use client'

import Button from '@/components/ui/Button'
import { ArrowRight, Calendar, MessageSquare, Users } from 'lucide-react'
import Link from 'next/link'

export default function CommunityPage() {
    const sections = [
        {
            icon: <Users className="h-6 w-6" />,
            title: 'Forums & Groups',
            desc: 'Discuss industry trends, share tips, and connect with peers.',
            href: '/community',
        },
        {
            icon: <MessageSquare className="h-6 w-6" />,
            title: 'Show & Tell',
            desc: 'Get constructive feedback on work in progress and finished pieces.',
            href: '/community',
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: 'Events & Workshops',
            desc: 'Join AMAs, portfolio reviews, and skill-building sessions.',
            href: '/community',
        },
    ]

    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-neutral-50 border-b border-neutral-200">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Community</h1>
                        <p className="text-xl text-neutral-700">
                            Learn, share, and grow with a community of creatives and clients.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/success-stories">
                                <Button variant="primary">
                                    See Success Stories
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/client-resources">
                                <Button variant="secondary">Client Resources</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sections */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-6">
                    {sections.map((s, idx) => (
                        <Link
                            key={idx}
                            href={s.href}
                            className="group bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="w-12 h-12 rounded-lg bg-beacon-purple-light/20 text-beacon-purple flex items-center justify-center mb-4">
                                {s.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">{s.title}</h3>
                            <p className="text-neutral-600">{s.desc}</p>
                            <div className="mt-4 inline-flex items-center text-beacon-purple font-medium group-hover:underline">
                                Explore
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-neutral-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="bg-white rounded-2xl p-10 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-semibold text-neutral-900">Join the conversation</h3>
                            <p className="text-neutral-600 mt-1">
                                Meet collaborators, find mentors, and showcase your craft.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/register?type=creative">
                                <Button variant="primary">Become a Member</Button>
                            </Link>
                            <Link href="/how-it-works">
                                <Button variant="secondary">How It Works</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}