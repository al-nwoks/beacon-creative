'use client'

import BottomNavigation from '@/components/shared/BottomNavigation'
import CreativeCard from '@/components/shared/CreativeCard'
import Header from '@/components/shared/Header'
import JobCard from '@/components/shared/JobCard'
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
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
                    <div className="absolute right-4 top-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="p-3 border-b border-gray-200">
                            <h3 className="font-medium text-gray-900">Filter By</h3>
                        </div>
                        <div className="p-2">
                            {filterOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        setSelectedFilter(option)
                                        setFilterOpen(false)
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${selectedFilter === option ? 'bg-beacon-purple-light/20 text-beacon-purple' : 'text-gray-700'
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
                    <div className="bg-gradient-purple rounded-xl p-6 mb-8 text-white">
                        <div className="flex items-start space-x-3">
                            <Star className="h-6 w-6 mt-1" />
                            <div>
                                <h1 className="text-2xl font-bold mb-2">Welcome to B3ACON</h1>
                                <p className="text-purple-100 mb-4">Connect with top creative talent and exciting opportunities worldwide.</p>
                                <Button
                                    variant="secondary"
                                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                                >
                                    Complete Your Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </AnimatedComponent>

                {/* Featured Jobs Section */}
                <AnimatedComponent delay={0.3}>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Featured Jobs</h2>
                            <button className="text-beacon-purple hover:text-beacon-purple-dark font-medium">
                                View All →
                            </button>
                        </div>

                        <StaggeredAnimationContainer staggerDelay={0.1} className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                            {projects.slice(0, 3).map((project) => (
                                <AnimatedComponent key={project.id}>
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
                                </AnimatedComponent>
                            ))}
                        </StaggeredAnimationContainer>
                    </div>
                </AnimatedComponent>

                {/* Top Creators Section */}
                <AnimatedComponent delay={0.4}>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Top Creators</h2>
                            <button className="text-beacon-purple hover:text-beacon-purple-dark font-medium">
                                View All →
                            </button>
                        </div>

                        <StaggeredAnimationContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topCreators.map((creator, index) => (
                                <AnimatedComponent key={creator.id}>
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