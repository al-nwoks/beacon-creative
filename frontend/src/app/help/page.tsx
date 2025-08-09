'use client'

import Button from '@/components/ui/Button'
import { CreditCard, FileText, Mail, MessageCircle, Phone, Settings, UserCircle } from 'lucide-react'
import Link from 'next/link'

export default function Help() {
    const helpCategories = [
        {
            icon: <UserCircle className="h-6 w-6" />,
            title: 'Account Management',
            description: 'Learn how to create, manage, and secure your account',
            link: '/help/account'
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: 'Projects & Applications',
            description: 'Information about posting projects and applying to opportunities',
            link: '/help/projects'
        },
        {
            icon: <CreditCard className="h-6 w-6" />,
            title: 'Payments & Billing',
            description: 'Understand our payment system, fees, and billing process',
            link: '/help/payments'
        },
        {
            icon: <Settings className="h-6 w-6" />,
            title: 'Platform Features',
            description: 'Guides on using our tools and platform features',
            link: '/help/features'
        }
    ]

    const faqs = [
        {
            question: 'How do I create an account?',
            answer: 'You can create an account by clicking the "Sign up" button at the top of the page. You\'ll need to provide your email address, create a password, and select whether you\'re a creative professional or a client.'
        },
        {
            question: 'How do payments work?',
            answer: 'We use a secure escrow system. Clients fund projects upfront, and payments are released to creatives when milestones are completed and approved.'
        },
        {
            question: 'What are the fees?',
            answer: 'We charge a 10% service fee on all transactions. There are no hidden fees or additional charges.'
        },
        {
            question: 'How do I contact support?',
            answer: 'You can reach our support team through the contact form below, or by emailing support@b3acon.com. We typically respond within 24 hours.'
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
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Help Center</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Find answers to common questions and get support
                    </p>

                    <div className="max-w-2xl mx-auto mt-12">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                className="w-full px-6 py-4 rounded-full text-neutral-900 text-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-beacon-purple text-white px-6 rounded-full hover:bg-beacon-purple-dark transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Browse Help Topics</h2>
                        <p className="text-xl text-neutral-700">
                            Find answers to your questions in our comprehensive help categories
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {helpCategories.map((category, index) => (
                            <Link
                                key={index}
                                href={category.link}
                                className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition-all hover:border-beacon-purple group"
                            >
                                <div className="w-12 h-12 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mb-4 group-hover:bg-beacon-purple group-hover:text-white transition-colors">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-neutral-900 group-hover:text-beacon-purple transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-neutral-700 mb-4">
                                    {category.description}
                                </p>
                                <span className="text-beacon-purple font-medium inline-flex items-center">
                                    Learn more
                                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
                        <p className="text-xl text-neutral-700">
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 mb-4 border border-neutral-200 shadow-sm">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{faq.question}</h3>
                                <p className="text-neutral-700">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Still Need Help?</h2>
                            <p className="text-xl text-neutral-700">
                                Our support team is here to assist you
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mx-auto mb-4">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Email Support</h3>
                                <p className="text-neutral-700 mb-4">
                                    Get detailed help via email
                                </p>
                                <a href="mailto:support@b3acon.com" className="text-beacon-purple font-medium">
                                    support@b3acon.com
                                </a>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mx-auto mb-4">
                                    <MessageCircle className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Live Chat</h3>
                                <p className="text-neutral-700 mb-4">
                                    Chat with our support team
                                </p>
                                <span className="text-beacon-purple font-medium">
                                    Available 24/7
                                </span>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-beacon-purple-light/20 rounded-full flex items-center justify-center text-beacon-purple mx-auto mb-4">
                                    <Phone className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Phone Support</h3>
                                <p className="text-neutral-700 mb-4">
                                    Speak directly with an agent
                                </p>
                                <span className="text-beacon-purple font-medium">
                                    +1 (555) 123-4567
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}