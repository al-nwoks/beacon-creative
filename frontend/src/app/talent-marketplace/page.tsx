'use client'

import Button from '@/components/ui/Button'
import { Award, Filter, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function TalentMarketplace() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedLocation, setSelectedLocation] = useState('all')

    const categories = [
        'All Categories',
        'Design',
        'Photography',
        'Writing',
        'Video',
        'Marketing',
        'Development',
        'Music'
    ]

    const locations = [
        'All Locations',
        'United States',
        'United Kingdom',
        'Canada',
        'Australia',
        'Remote'
    ]

    // Mock talent data
    const talent = [
        {
            id: '1',
            name: 'Sarah Johnson',
            title: 'Senior Graphic Designer',
            rating: 4.9,
            reviews: 124,
            hourlyRate: 75,
            location: 'New York, NY',
            skills: ['Branding', 'Logo Design', 'UI/UX', 'Illustration'],
            verified: true,
            featured: true
        },
        {
            id: '2',
            name: 'Michael Chen',
            title: 'Photography & Videography',
            rating: 4.8,
            reviews: 89,
            hourlyRate: 120,
            location: 'Los Angeles, CA',
            skills: ['Portrait', 'Event', 'Commercial', 'Drone'],
            verified: true,
            featured: false
        },
        {
            id: '3',
            name: 'Emma Rodriguez',
            title: 'Content Writer & Copywriter',
            rating: 4.9,
            reviews: 156,
            hourlyRate: 65,
            location: 'Austin, TX',
            skills: ['SEO', 'Blog Posts', 'Marketing Copy', 'Script Writing'],
            verified: true,
            featured: true
        },
        {
            id: '4',
            name: 'David Kim',
            title: 'Full Stack Developer',
            rating: 4.7,
            reviews: 78,
            hourlyRate: 95,
            location: 'San Francisco, CA',
            skills: ['React', 'Node.js', 'Python', 'AWS'],
            verified: false,
            featured: false
        },
        {
            id: '5',
            name: 'Olivia Parker',
            title: 'Motion Graphics Artist',
            rating: 4.9,
            reviews: 92,
            hourlyRate: 85,
            location: 'Remote',
            skills: ['After Effects', 'Cinema 4D', 'Animation', '3D Modeling'],
            verified: true,
            featured: false
        },
        {
            id: '6',
            name: 'James Wilson',
            title: 'Digital Marketing Specialist',
            rating: 4.6,
            reviews: 67,
            hourlyRate: 70,
            location: 'Chicago, IL',
            skills: ['SEO', 'PPC', 'Social Media', 'Analytics'],
            verified: true,
            featured: false
        }
    ]

    const featuredTalent = talent.filter(person => person.featured)
    const regularTalent = talent.filter(person => !person.featured)

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
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Talent Marketplace</h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Discover and connect with top creative talent from around the world
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mt-12">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for talent by skills, name, or expertise..."
                                className="w-full px-6 py-4 rounded-full text-neutral-900 text-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-beacon-purple text-white px-6 rounded-full hover:bg-beacon-purple-dark transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-6 bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center">
                                <Filter className="h-5 w-5 text-neutral-500 mr-2" />
                                <span className="text-neutral-700 font-medium">Filters:</span>
                            </div>

                            <select
                                className="border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-beacon-purple"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map((category, index) => (
                                    <option key={index} value={index === 0 ? 'all' : category.toLowerCase()}>
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-beacon-purple"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                            >
                                {locations.map((location, index) => (
                                    <option key={index} value={index === 0 ? 'all' : location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="text-neutral-600">
                            <span className="font-medium">{talent.length}</span> creative professionals found
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Talent */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-neutral-900">Featured Talent</h2>
                        <Link href="/creatives" className="text-beacon-purple hover:text-beacon-purple-dark font-medium">
                            View All Talent
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredTalent.map((person) => (
                            <div key={person.id} className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-neutral-900">{person.name}</h3>
                                                <p className="text-neutral-600 text-sm">{person.title}</p>
                                            </div>
                                        </div>
                                        {person.verified && (
                                            <Award className="h-5 w-5 text-beacon-purple" />
                                        )}
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                        </div>
                                        <span className="text-neutral-600 text-sm ml-2">
                                            {person.rating} ({person.reviews} reviews)
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-neutral-900 font-semibold">
                                            ${person.hourlyRate}/hr
                                        </div>
                                        <div className="flex items-center text-neutral-600 text-sm">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {person.location}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {person.skills.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-beacon-purple-light/20 text-beacon-purple text-xs rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                        {person.skills.length > 3 && (
                                            <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                                +{person.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex space-x-3">
                                        <Link href={`/creatives/${person.id}`} className="flex-1">
                                            <Button variant="primary" size="sm" className="w-full">
                                                View Profile
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm">
                                            Message
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Talent */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-8">All Talent</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularTalent.map((person) => (
                            <div key={person.id} className="bg-neutral-50 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-neutral-900">{person.name}</h3>
                                                <p className="text-neutral-600 text-sm">{person.title}</p>
                                            </div>
                                        </div>
                                        {person.verified && (
                                            <Award className="h-5 w-5 text-beacon-purple" />
                                        )}
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <div className="flex text-yellow-400">
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                        </div>
                                        <span className="text-neutral-600 text-sm ml-2">
                                            {person.rating} ({person.reviews} reviews)
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-neutral-900 font-semibold">
                                            ${person.hourlyRate}/hr
                                        </div>
                                        <div className="flex items-center text-neutral-600 text-sm">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {person.location}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {person.skills.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="px-3 py-1 bg-beacon-purple-light/20 text-beacon-purple text-xs rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                        {person.skills.length > 3 && (
                                            <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                                                +{person.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex space-x-3">
                                        <Link href={`/creatives/${person.id}`} className="flex-1">
                                            <Button variant="primary" size="sm" className="w-full">
                                                View Profile
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm">
                                            Message
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-beacon-purple to-beacon-purple-dark text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Looking for specific talent?</h2>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-beacon-purple-light">
                        Post a project and let our creative professionals come to you.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/register?type=client">
                            <Button variant="primary" size="lg">
                                Post a Project
                            </Button>
                        </Link>
                        <Link href="/how-to-hire">
                            <Button variant="secondary" size="lg" className="bg-white text-beacon-purple hover:bg-neutral-100">
                                Learn How It Works
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}