import Button from '@/components/ui/Button'
import { MapPin, Search, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Talent Marketplace | B3ACON Creative Connect',
    description: 'Browse our curated marketplace of creative professionals ready for your gigs.',
}

export default function TalentMarketplacePage() {
    // Mock data for creatives
    const creatives = [
        {
            id: '1',
            name: 'Sarah Johnson',
            title: 'Professional Photographer',
            rating: 4.9,
            reviews: 124,
            hourlyRate: 75,
            location: 'New York, NY',
            skills: ['Photography', 'Portrait', 'Fashion', 'Lighting'],
            image: '/placeholder-creative-1.jpg',
            verified: true
        },
        {
            id: '2',
            name: 'Michael Chen',
            title: 'UI/UX Designer',
            rating: 4.8,
            reviews: 89,
            hourlyRate: 65,
            location: 'San Francisco, CA',
            skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
            image: '/placeholder-creative-2.jpg',
            verified: true
        },
        {
            id: '3',
            name: 'Emma Davis',
            title: 'Content Writer & Strategist',
            rating: 4.9,
            reviews: 156,
            hourlyRate: 45,
            location: 'London, UK',
            skills: ['Content Writing', 'SEO', 'Copywriting', 'Strategy'],
            image: '/placeholder-creative-3.jpg',
            verified: false
        }
    ]

    const categories = [
        'All Categories',
        'Design',
        'Writing',
        'Photography',
        'Development',
        'Marketing',
        'Video'
    ]

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold text-neutral-900 mb-4">
                            Find Top Creative Talent
                        </h1>
                        <p className="text-xl text-neutral-600 mb-8">
                            Browse our curated marketplace of professionals ready to work on your gigs.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-4 border border-neutral-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple text-lg"
                                    placeholder="Search for creative talent..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
                                <button className="text-sm text-beacon-purple hover:text-beacon-purple-dark">
                                    Clear all
                                </button>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-neutral-900 mb-3">Category</h3>
                                <div className="space-y-2">
                                    {categories.map((category, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                id={`category-${index}`}
                                                name="category"
                                                type="radio"
                                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300"
                                                defaultChecked={index === 0}
                                            />
                                            <label htmlFor={`category-${index}`} className="ml-3 block text-sm text-neutral-700">
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-neutral-900 mb-3">Minimum Rating</h3>
                                <div className="space-y-2">
                                    {['Any rating', '4.5+ stars', '4.0+ stars', '3.5+ stars'].map((rating, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                id={`rating-${index}`}
                                                name="rating"
                                                type="radio"
                                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300"
                                                defaultChecked={index === 0}
                                            />
                                            <label htmlFor={`rating-${index}`} className="ml-3 block text-sm text-neutral-700">
                                                {rating}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hourly Rate */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-neutral-900 mb-3">Hourly Rate</h3>
                                <div className="space-y-2">
                                    {['Any rate', '$0 - $50', '$50 - $100', '$100+'].map((rate, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                id={`rate-${index}`}
                                                name="rate"
                                                type="radio"
                                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300"
                                                defaultChecked={index === 0}
                                            />
                                            <label htmlFor={`rate-${index}`} className="ml-3 block text-sm text-neutral-700">
                                                {rate}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button variant="primary" fullWidth>
                                Apply Filters
                            </Button>
                        </div>
                    </div>

                    {/* Creatives List */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-neutral-900">
                                {creatives.length} creatives found
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-neutral-600">Sort by:</span>
                                <select className="border border-neutral-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple">
                                    <option>Highest rated</option>
                                    <option>Most reviewed</option>
                                    <option>Lowest hourly rate</option>
                                    <option>Most experienced</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {creatives.map((creative) => (
                                <div key={creative.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-neutral-900">{creative.name}</h3>
                                                    <p className="text-neutral-600">{creative.title}</p>
                                                </div>
                                                {creative.verified && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Verified
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center mt-2">
                                                <div className="flex items-center">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <span className="ml-1 text-sm font-medium text-neutral-900">{creative.rating}</span>
                                                    <span className="mx-1 text-neutral-400">•</span>
                                                    <span className="text-sm text-neutral-600">{creative.reviews} reviews</span>
                                                </div>
                                                <span className="mx-2 text-neutral-400">•</span>
                                                <div className="flex items-center text-sm text-neutral-600">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {creative.location}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {creative.skills.slice(0, 4).map((skill, index) => (
                                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {creative.skills.length > 4 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                        +{creative.skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-4 flex justify-between items-center">
                                                <div className="text-lg font-semibold text-neutral-900">
                                                    ${creative.hourlyRate}/hr
                                                </div>
                                                <div className="space-x-2">
                                                    <Link href={`/creatives/${creative.id}`}>
                                                        <Button variant="outline" size="sm">View Profile</Button>
                                                    </Link>
                                                    <Link href={`/messages/new?to=${creative.id}`}>
                                                        <Button variant="primary" size="sm">Message</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <button className="px-3 py-1 rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
                                    Previous
                                </button>
                                <button className="px-3 py-1 rounded-md bg-beacon-purple text-white">
                                    1
                                </button>
                                <button className="px-3 py-1 rounded-md text-neutral-600 hover:bg-neutral-100">
                                    2
                                </button>
                                <button className="px-3 py-1 rounded-md text-neutral-600 hover:bg-neutral-100">
                                    3
                                </button>
                                <span className="px-3 py-1 text-neutral-400">
                                    ...
                                </span>
                                <button className="px-3 py-1 rounded-md text-neutral-600 hover:bg-neutral-100">
                                    10
                                </button>
                                <button className="px-3 py-1 rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200">
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}