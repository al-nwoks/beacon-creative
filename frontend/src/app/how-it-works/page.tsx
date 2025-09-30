import Button from '@/components/ui/Button'
import { CheckCircle, DollarSign, MessageCircle, Search } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'How It Works | B3ACON Creative Connect',
    description: 'Learn how our platform connects creatives with clients through gigs.',
}

export default function HowItWorksPage() {
    const stepsForCreatives = [
        {
            icon: <Search className="h-8 w-8 text-beacon-purple" />,
            title: 'Browse Gigs',
            description: 'Search through thousands of gigs posted by clients. Filter by category, budget, timeline, and skills to find opportunities that match your expertise.'
        },
        {
            icon: <MessageCircle className="h-8 w-8 text-beacon-purple" />,
            title: 'Apply & Connect',
            description: 'Submit your application with a personalized cover letter. Connect directly with clients through our secure messaging system to discuss gig details.'
        },
        {
            icon: <CheckCircle className="h-8 w-8 text-beacon-purple" />,
            title: 'Get Hired',
            description: 'Once selected for a gig, you\'ll receive a contract outlining the scope of work, timeline, and payment terms. Accept the gig to get started.'
        },
        {
            icon: <DollarSign className="h-8 w-8 text-beacon-purple" />,
            title: 'Work & Get Paid',
            description: 'Complete the gig according to the agreed terms. Our secure payment system ensures you get paid when milestones are completed and approved.'
        }
    ]

    const stepsForClients = [
        {
            icon: <Search className="h-8 w-8 text-beacon-purple" />,
            title: 'Post a Gig',
            description: 'Create a detailed gig posting with your requirements, budget, timeline, and required skills. Our platform helps you craft compelling gig descriptions.'
        },
        {
            icon: <MessageCircle className="h-8 w-8 text-beacon-purple" />,
            title: 'Review Applications',
            description: 'Browse applications from qualified creatives. Review portfolios, ratings, and previous work to find the perfect match for your gig.'
        },
        {
            icon: <CheckCircle className="h-8 w-8 text-beacon-purple" />,
            title: 'Hire & Collaborate',
            description: 'Select the creative that best fits your needs. Collaborate through our gig management tools and secure messaging system.'
        },
        {
            icon: <DollarSign className="h-8 w-8 text-beacon-purple" />,
            title: 'Pay Securely',
            description: 'Our escrow system holds payments until work is completed and approved. Release payments at agreed milestones for peace of mind.'
        }
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-beacon-purple to-beacon-blue text-white">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            How B3ACON Creative Connect Works
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-purple-100">
                            Connecting creative talent with exciting gigs has never been easier.
                        </p>
                    </div>
                </div>
            </div>

            {/* For Creatives Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            For Creatives
                        </h2>
                        <p className="text-xl text-neutral-600">
                            Find and apply to gigs that match your skills and interests.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stepsForCreatives.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-6">
                                    {step.icon}
                                </div>
                                <div className="text-5xl font-bold text-neutral-200 mb-4">
                                    0{index + 1}
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-neutral-600">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/register?role=creative">
                            <Button variant="primary" size="lg">
                                Get Started as a Creative
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* For Clients Section */}
            <div className="py-20 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                            For Clients
                        </h2>
                        <p className="text-xl text-neutral-600">
                            Post gigs and find the perfect creative talent for your gigs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stepsForClients.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-6">
                                    {step.icon}
                                </div>
                                <div className="text-5xl font-bold text-neutral-200 mb-4">
                                    0{index + 1}
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-neutral-600">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="/register?role=client">
                            <Button variant="primary" size="lg">
                                Get Started as a Client
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-neutral-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-neutral-300 mb-10">
                            Join thousands of creatives and clients who are already finding success through gigs on our platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register?role=creative">
                                <Button variant="primary" size="lg" className="bg-beacon-purple hover:bg-beacon-purple-dark">
                                    I'm a Creative
                                </Button>
                            </Link>
                            <Link href="/register?role=client">
                                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                                    I'm a Client
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}