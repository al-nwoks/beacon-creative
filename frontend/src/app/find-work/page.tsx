import Button from '@/components/ui/Button'
import { Clock, DollarSign, MapPin, Search } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Find Gigs | B3ACON Creative Connect',
    description: 'Browse and apply to gigs that match your skills and interests.',
}

export default function FindWorkPage() {
    // Mock data for gigs
    const gigs = [
        {
            id: '1',
            title: 'Brand Photography for Fashion Startup',
            description: 'We need high-quality product photography for our new fashion line. Looking for someone with experience in fashion photography and lighting.',
            budget: '$1,500 - $2,500',
            timeline: '4-6 weeks',
            posted: '2 days ago',
            skills: ['Photography', 'Fashion', 'Lighting', 'Photoshop'],
            category: 'Photography',
            location: 'Remote'
        },
        {
            id: '2',
            title: 'UI/UX Design for Mobile App',
            description: 'Design a complete user interface for our new fitness tracking mobile application. Experience with health and fitness apps preferred.',
            budget: '$3,000 - $5,000',
            timeline: '6-8 weeks',
            posted: '1 week ago',
            skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping'],
            category: 'Design',
            location: 'New York, NY'
        },
        {
            id: '3',
            title: 'Content Writing for Tech Blog',
            description: 'Looking for a technical writer to create engaging content for our technology blog. Must have experience with AI, cloud computing, and software development.',
            budget: '$500 - $1,000',
            timeline: '2-3 weeks',
            posted: '3 days ago',
            skills: ['Technical Writing', 'SEO', 'Content Strategy', 'Tech'],
            category: 'Writing',
            location: 'Remote'
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
                            Find Your Next Gig
                        </h1>
                        <p className="text-xl text-neutral-600 mb-8">
                            Browse thousands of gigs from top clients and find opportunities that match your skills.
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
                                    placeholder="Search for gigs..."
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

                            {/* Budget Range */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-neutral-900 mb-3">Budget Range</h3>
                                <div className="space-y-2">
                                    {['Any budget', '$0 - $1,000', '$1,000 - $5,000', '$5,000+'].map((range, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                id={`budget-${index}`}
                                                name="budget"
                                                type="radio"
                                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300"
                                                defaultChecked={index === 0}
                                            />
                                            <label htmlFor={`budget-${index}`} className="ml-3 block text-sm text-neutral-700">
                                                {range}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Level */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-neutral-900 mb-3">Experience Level</h3>
                                <div className="space-y-2">
                                    {['Any experience', 'Entry level', 'Intermediate', 'Expert'].map((level, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                id={`experience-${index}`}
                                                name="experience"
                                                type="radio"
                                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300"
                                                defaultChecked={index === 0}
                                            />
                                            <label htmlFor={`experience-${index}`} className="ml-3 block text-sm text-neutral-700">
                                                {level}
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

                    {/* Gigs List */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-neutral-900">
                                {gigs.length} gigs found
                            </h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-neutral-600">Sort by:</span>
                                <select className="border border-neutral-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple">
                                    <option>Most recent</option>
                                    <option>Highest budget</option>
                                    <option>Closest deadline</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {gigs.map((gig) => (
                                <div key={gig.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">{gig.title}</h3>
                                            <p className="text-neutral-600 mb-4 line-clamp-2">{gig.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {gig.skills.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {gig.skills.length > 3 && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                                        +{gig.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-4">
                                        <div className="flex items-center">
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            {gig.budget}
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {gig.timeline}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {gig.location}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-neutral-500">Posted {gig.posted}</span>
                                        <Link href={`/gigs/${gig.id}`}>
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </Link>
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