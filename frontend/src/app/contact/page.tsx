'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Instagram, Linkedin, Mail, MapPin, MessageSquare, Phone, Twitter } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useState } from 'react'

const MapWithNoSSR = dynamic(() => import('@/components/ui/Map'), {
    ssr: false
})

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    return (
        <>
            {/* Hero */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Contact Us</h1>
                        <p className="text-xl md:text-2xl text-beacon-purple-light">
                            We’re here to help. Reach out to our team for support, partnership inquiries, or general questions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Phone className="h-5 w-5 text-beacon-purple" />
                                <h3 className="font-semibold text-neutral-900">Phone</h3>
                            </div>
                            <p className="text-neutral-600">+1 (555) 123-4567</p>
                            <p className="text-neutral-600">Mon–Fri, 9:00–17:00</p>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Mail className="h-5 w-5 text-beacon-purple" />
                                <h3 className="font-semibold text-neutral-900">Email</h3>
                            </div>
                            <p className="text-neutral-600">support@b3acon.io</p>
                            <p className="text-neutral-600">We reply within 1 business day</p>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <MapPin className="h-5 w-5 text-beacon-purple" />
                                <h3 className="font-semibold text-neutral-900">Office</h3>
                            </div>
                            <p className="text-neutral-600">12 Creative Way, Lagos</p>
                            <p className="text-neutral-600">Nigeria</p>
                        </div>

                        <div className="bg-white rounded-xl border border-neutral-200 p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <MessageSquare className="h-5 w-5 text-beacon-purple" />
                                <h3 className="font-semibold text-neutral-900">Community</h3>
                            </div>
                            <p className="text-neutral-600">Ask the community and get quick tips from peers.</p>
                            <Link href="/community" className="inline-flex items-center text-beacon-purple font-medium mt-2 hover:underline">
                                Visit Community
                            </Link>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-neutral-200 p-8">
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Send us a message</h2>
                            <form
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    setIsSubmitting(true)
                                    setTimeout(() => setIsSubmitting(false), 1200)
                                }}
                            >
                                <Input
                                    label="First Name"
                                    id="first_name"
                                    type="text"
                                    placeholder="John"
                                    className="md:col-span-1"
                                />
                                <Input
                                    label="Last Name"
                                    id="last_name"
                                    type="text"
                                    placeholder="Doe"
                                    className="md:col-span-1"
                                />
                                <Input
                                    label="Email"
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="md:col-span-2"
                                />
                                <div className="md:col-span-2">
                                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-transparent resize-y"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Button type="submit" isLoading={isSubmitting}>Send Message</Button>
                                </div>
                            </form>
                        </div>

                        {/* Helpful links */}
                        <div className="mt-8 bg-neutral-50 rounded-xl border border-neutral-200 p-6">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-3">Helpful Links</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link href="/help" className="text-beacon-purple hover:underline">Help Center</Link>
                                <Link href="/how-it-works" className="text-beacon-purple hover:underline">How It Works</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-xl border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">How quickly can I expect a response?</h3>
                                <p className="text-neutral-700">Our support team typically responds within 24 hours on business days.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Do you offer phone support?</h3>
                                <p className="text-neutral-700">Yes, our phone support is available Monday-Friday from 9am-5pm local time.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Where can I find documentation?</h3>
                                <p className="text-neutral-700">Visit our <Link href="/help" className="text-beacon-purple hover:underline">Help Center</Link> for detailed guides and documentation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Our Team</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="bg-neutral-200 rounded-full w-32 h-32 mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold mb-2">Alex Johnson</h3>
                            <p className="text-neutral-600">Founder & CEO</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-neutral-200 rounded-full w-32 h-32 mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold mb-2">Sam Wilson</h3>
                            <p className="text-neutral-600">Head of Product</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-neutral-200 rounded-full w-32 h-32 mx-auto mb-4"></div>
                            <h3 className="text-xl font-semibold mb-2">Taylor Smith</h3>
                            <p className="text-neutral-600">Customer Support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Media */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8">Connect With Us</h2>
                    <div className="flex justify-center gap-6">
                        <Link href="#" className="text-neutral-700 hover:text-beacon-purple transition-colors">
                            <Twitter className="h-8 w-8" />
                        </Link>
                        <Link href="#" className="text-neutral-700 hover:text-beacon-purple transition-colors">
                            <Linkedin className="h-8 w-8" />
                        </Link>
                        <Link href="#" className="text-neutral-700 hover:text-beacon-purple transition-colors">
                            <Instagram className="h-8 w-8" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-96 w-full">
                <MapWithNoSSR
                    center={{ lat: 6.5244, lng: 3.3792 }}
                    zoom={15}
                    markerText="B3ACON Creative Connect HQ"
                />
            </section>
        </>
    )
}
