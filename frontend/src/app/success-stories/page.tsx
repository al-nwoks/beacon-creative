'use client'

import Button from '@/components/ui/Button'
import { ArrowRight, Quote, Star } from 'lucide-react'
import Link from 'next/link'

export default function SuccessStories() {
    const stories = [
        {
            quote:
                'B3ACON connected us with an incredible designer who reimagined our brand in record time. The milestone-based workflow kept everything on track.',
            author: 'Amara Okoye',
            role: 'Founder, Kora Foods',
        },
        {
            quote:
                'As a videographer, I found repeat clients quickly. The built-in messaging and file sharing streamlined feedback and delivery.',
            author: 'David Mensah',
            role: 'Videographer',
        },
        {
            quote:
                'We sourced a front-end developer within 72 hours. Communication, payments, and file handoff were seamless end-to-end.',
            author: 'Fatima Bello',
            role: 'Product Manager, Atlas Health',
        },
    ]

    return (
        <main className="min-h-screen bg-white">
            {/* Hero */}
            <section className="bg-neutral-50 border-b border-neutral-200">
                <div className="container mx-auto px-4 py-16 md:py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Success Stories</h1>
                        <p className="text-xl text-neutral-700">
                            Real outcomes from creatives and clients who shipped exceptional work on B3ACON.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link href="/client-success-stories">
                                <Button variant="primary">
                                    Client Case Studies
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/success-stories">
                                <Button variant="secondary">Creative Wins</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8">
                    {stories.map((s, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-neutral-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                            <Quote className="h-8 w-8 text-beacon-purple mb-4" />
                            <p className="text-neutral-700 mb-6">{s.quote}</p>
                            <div>
                                <div className="font-semibold text-neutral-900">{s.author}</div>
                                <div className="text-neutral-600">{s.role}</div>
                            </div>
                            <div className="mt-4 flex text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-neutral-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="bg-white rounded-2xl p-10 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-semibold text-neutral-900">Ready to create your own success story?</h3>
                            <p className="text-neutral-600 mt-1">Hire top creatives or find your next project on B3ACON.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/register?type=client">
                                <Button variant="primary">Hire Creatives</Button>
                            </Link>
                            <Link href="/register?type=creative">
                                <Button variant="secondary">Find Work</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}