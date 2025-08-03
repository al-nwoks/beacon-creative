'use client'

import CreativeCard from '@/components/dashboard/CreativeCard'
import JobCard from '@/components/dashboard/JobCard'
import { Header } from '@/components/layout/Header'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import { AnimatedComponent } from '@/components/ui/AnimatedComponent'
import Button from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useNotification } from '@/components/ui/NotificationProvider'
import { StaggeredAnimationContainer } from '@/components/ui/StaggeredAnimationContainer'
import { applicationsAPI, projectsAPI, usersAPI } from '@/lib/api'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Project {
    id: string
    title: string
    description: string
    category: string
    budget_min?: number
    budget_max?: number
    timeline_weeks?: number
    required_skills?: string[]
    status: string
    created_at: string
    client: {
        id: string
        first_name: string
        last_name: string
        email: string
    }
}

interface User {
    id: string
    first_name: string
    last_name: string
    email: string
    profile_image_url?: string
    user_type: string
    is_verified: boolean
    bio?: string
    location?: string
    hourly_rate?: number
    skills?: string[]
    portfolio_links?: string[]
}

export default function CreativeDashboard() {
    const [filterOpen, setFilterOpen] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState('Newest First')
    const [projects, setProjects] = useState<Project[]>([])
    const [topCreators, setTopCreators] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const { showNotification } = useNotification()

    const filterOptions = [
        'Newest First',
        'Most Popular',
        'Highest Rated',
        'Nearby Location'
    ]

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)

            // Load current user
            const user = await usersAPI.getCurrentUser()
            setCurrentUser(user)

            // Load featured projects
            const projectsData = await projectsAPI.getProjects({
                limit: 6,
                status: 'active'
            })
            setProjects(projectsData)

            // Mock top creators data (since we don't have a specific endpoint)
            setTopCreators([
                {
                    id: '1',
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    email: 'sarah@example.com',
                    user_type: 'creative',
                    is_verified: true,
                    bio: 'Passionate photographer with 8+ years of experience in fashion and portrait photography.',
                    location: 'New York, NY',
                    hourly_rate: 75,
                    skills: ['Photography', 'Fashion', 'Portrait'],
                    portfolio_links: ['https://sarahjohnson.com']
                },
                {
                    id: '2',
                    first_name: 'Mike',
                    last_name: 'Chen',
                    email: 'mike@example.com',
                    user_type: 'creative',
                    is_verified: true,
                    bio: 'Creative director and graphic designer with expertise in brand identity.',
                    location: 'San Francisco, CA',
                    hourly_rate: 85,
                    skills: ['Graphic Design', 'Branding', 'Web Design'],
                    portfolio_links: ['https://mikechen.design']
                },
                {
                    id: '3',
                    first_name: 'Emma',
                    last_name: 'Davis',
                    email: 'emma@example.com',
                    user_type: 'creative',
                    is_verified: false,
                    bio: 'Professional model and content creator specializing in fashion.',
                    location: 'Los Angeles, CA',
                    hourly_rate: 120,
                    skills: ['Modeling', 'Fashion', 'Commercial'],
                    portfolio_links: ['https://emmadavis.model']
                }
            ])
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (query: string) => {
        if (!query.trim()) return

        try {
            const searchResults = await projectsAPI.getProjects({
                search: query,
                status: 'active'
            })
            setProjects(searchResults)
        } catch (error) {
            console.error('Error searching projects:', error)
        }
    }

    const handleApplyToJob = async (projectId: string) => {
        try {
            await applicationsAPI.createApplication({
                project_id: projectId,
                cover_letter: 'I am interested in this project and would like to apply.',
            })
            showNotification('Application submitted successfully!', 'success')
        } catch (error) {
            console.error('Error applying to job:', error)
            showNotification('Error submitting application. Please try again.', 'error')
        }
    }

    const handleContactCreative = (creativeId: string) => {
        // Navigate to messages or open contact modal
        console.log('Contact creative:', creativeId)
    }

    const handleViewCreativeProfile = (creativeId: string) => {
        // Navigate to creative profile
        console.log('View creative profile:', creativeId)
    }

    const handleFilter = () => {
        setFilterOpen(!filterOpen)
    }

    const handleFilterSelect = (option: string) => {
        setSelectedFilter(option)
        setFilterOpen(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Header */}
            <AnimatedComponent delay={0.1}>
                <Header
                    showSearch={true}
                    showFilter={true}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    searchPlaceholder="Search creators, jobs, skills..."
                    userType="creative"
                />
            </AnimatedComponent>

            {/* Filter Dropdown */}
            {filterOpen && (
                <div className="relative z-10">
                    <div className="absolute right-4 top-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-lg">
                        <div className="p-4 border-b border-neutral-100">
                            <h3 className="font-semibold text-neutral-900">Filter By</h3>
                        </div>
                        <div className="p-2">
                            {filterOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleFilterSelect(option)}
                                    className={`w-full text-left px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors ${selectedFilter === option
                                        ? 'bg-beacon-purple-light/20 text-beacon-purple font-medium'
                                        : 'text-neutral-700'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Welcome Banner */}
                <AnimatedComponent delay={0.2}>
                    <div className="bg-gradient-to-r from-beacon-purple to-beacon-purple-dark rounded-2xl p-6 mb-8 text-white">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start space-x-3">
                                <div className="mt-1 p-2 bg-white/20 rounded-lg">
                                    <Star className="h-6 w-6" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.first_name}!</h1>
                                    <p className="text-purple-100 mb-4">Connect with top creative talent and exciting opportunities worldwide.</p>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                className="bg-white/20 text-white border-white/30 hover:bg-white/30 whitespace-nowrap"
                            >
                                Complete Your Profile
                            </Button>
                        </div>
                    </div>
                </AnimatedComponent>

                {/* Stats Section */}
                <AnimatedComponent delay={0.25}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 border border-neutral-200">
                            <div className="text-2xl font-bold text-neutral-900">12</div>
                            <div className="text-sm text-neutral-600">Active Applications</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-neutral-200">
                            <div className="text-2xl font-bold text-neutral-900">8</div>
                            <div className="text-sm text-neutral-600">Messages</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-neutral-200">
                            <div className="text-2xl font-bold text-neutral-900">3</div>
                            <div className="text-sm text-neutral-600">Ongoing Projects</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-neutral-200">
                            <div className="text-2xl font-bold text-neutral-900">4.8</div>
                            <div className="text-sm text-neutral-600">Rating</div>
                        </div>
                    </div>
                </AnimatedComponent>

                {/* Quick Actions */}
                <AnimatedComponent delay={0.3}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Button variant="primary" className="py-3">
                            <span className="text-sm font-medium">Browse Jobs</span>
                        </Button>
                        <Button variant="outline" className="py-3 border-beacon-purple text-beacon-purple hover:bg-beacon-purple-light/10">
                            <span className="text-sm font-medium">My Portfolio</span>
                        </Button>
                        <Button variant="outline" className="py-3">
                            <span className="text-sm font-medium">Messages</span>
                        </Button>
                        <Button variant="outline" className="py-3">
                            <span className="text-sm font-medium">Settings</span>
                        </Button>
                    </div>
                </AnimatedComponent>

                {/* Featured Jobs Section */}
                <AnimatedComponent delay={0.35}>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-neutral-900">Featured Jobs</h2>
                            <button className="text-beacon-purple hover:text-beacon-purple-dark font-medium flex items-center">
                                View All
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <StaggeredAnimationContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                            {projects.slice(0, 3).map((project) => (
                                <AnimatedComponent key={project.id}>
                                    <div>
                                        <JobCard
                                            id={project.id}
                                            title={project.title}
                                            company={`${project.client.first_name} ${project.client.last_name}`}
                                            description={project.description}
                                            location={project.category}
                                            budget_min={project.budget_min}
                                            budget_max={project.budget_max}
                                            timeline_weeks={project.timeline_weeks}
                                            required_skills={project.required_skills}
                                            created_at={project.created_at}
                                            onApply={handleApplyToJob}
                                        />
                                    </div>
                                </AnimatedComponent>
                            ))}
                        </StaggeredAnimationContainer>
                    </div>
                </AnimatedComponent>

                {/* Top Creators Section */}
                <AnimatedComponent delay={0.4}>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-neutral-900">Top Creators</h2>
                            <button className="text-beacon-purple hover:text-beacon-purple-dark font-medium flex items-center">
                                View All
                                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <StaggeredAnimationContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {topCreators.map((creator, index) => (
                                <AnimatedComponent key={creator.id}>
                                    <div>
                                        <CreativeCard
                                            id={creator.id}
                                            first_name={creator.first_name}
                                            last_name={creator.last_name}
                                            email={creator.email}
                                            bio={creator.bio}
                                            location={creator.location}
                                            hourly_rate={creator.hourly_rate}
                                            skills={creator.skills}
                                            portfolio_links={creator.portfolio_links}
                                            profile_image_url={creator.profile_image_url}
                                            is_verified={creator.is_verified}
                                            featured={index === 0}
                                            onContact={handleContactCreative}
                                            onViewProfile={handleViewCreativeProfile}
                                        />
                                    </div>
                                </AnimatedComponent>
                            ))}
                        </StaggeredAnimationContainer>
                    </div>
                </AnimatedComponent>
            </div>

            {/* Bottom Navigation */}
            <AnimatedComponent delay={0.5}>
                <BottomNavigation userType="creative" />
            </AnimatedComponent>
        </div>
    )
}