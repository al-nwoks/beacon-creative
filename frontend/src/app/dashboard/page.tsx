'use client'

import BottomNavigation from '@/components/shared/BottomNavigation'
import CreativeCard from '@/components/shared/CreativeCard'
import Header from '@/components/shared/Header'
import { AnimatedComponent } from '@/components/ui/AnimatedComponent'
import Button from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { StaggeredAnimationContainer } from '@/components/ui/StaggeredAnimationContainer'
import { projectsAPI, usersAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Briefcase, Clock, Eye, MessageSquare, Plus, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'
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
    applications?: any[]
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

interface DashboardStats {
    activeProjects: number
    totalApplications: number
    messagesCount: number
    totalSpent: number
}

export default function ClientDashboard() {
    const [projects, setProjects] = useState<Project[]>([])
    const [topCreatives, setTopCreatives] = useState<User[]>([])
    const [stats, setStats] = useState<DashboardStats>({
        activeProjects: 0,
        totalApplications: 0,
        messagesCount: 0,
        totalSpent: 0
    })
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)

            // Load current user
            const user = await usersAPI.getCurrentUser()
            setCurrentUser(user)

            // Load user's projects
            const userProjects = await projectsAPI.getMyProjects()
            setProjects(userProjects)

            // Calculate stats
            const activeProjectsCount = userProjects.filter((p: Project) => p.status === 'active').length
            const totalApplicationsCount = userProjects.reduce((sum: number, p: Project) => sum + (p.applications?.length || 0), 0)

            setStats({
                activeProjects: activeProjectsCount,
                totalApplications: totalApplicationsCount,
                messagesCount: 8, // Mock data
                totalSpent: 12500 // Mock data
            })

            // Mock top creatives data
            setTopCreatives([
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
        // Implement search functionality for creatives
        console.log('Search creatives:', query)
    }

    const handleContactCreative = (creativeId: string) => {
        // Navigate to messages or open contact modal
        console.log('Contact creative:', creativeId)
    }

    const handleViewCreativeProfile = (creativeId: string) => {
        // Navigate to creative profile
        console.log('View creative profile:', creativeId)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'hired':
                return 'bg-blue-100 text-blue-800'
            case 'completed':
                return 'bg-beacon-purple-light/20 text-beacon-purple'
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getBudgetDisplay = (project: Project) => {
        if (project.budget_min && project.budget_max) {
            return `${formatCurrency(project.budget_min)}-${formatCurrency(project.budget_max)}`
        } else if (project.budget_min) {
            return `From ${formatCurrency(project.budget_min)}`
        } else if (project.budget_max) {
            return `Up to ${formatCurrency(project.budget_max)}`
        }
        return 'Budget TBD'
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
                    onSearch={handleSearch}
                    searchPlaceholder="Search creatives, skills..."
                    userType="client"
                />
            </AnimatedComponent>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Welcome Section */}
                <AnimatedComponent delay={0.2}>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {currentUser?.first_name}!
                        </h1>
                        <p className="text-gray-600">Manage your projects and find amazing creative talent.</p>
                    </div>
                </AnimatedComponent>

                {/* Stats Grid */}
                <StaggeredAnimationContainer staggerDelay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <AnimatedComponent>
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Projects</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </AnimatedComponent>

                    <AnimatedComponent delay={0.1}>
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Applications</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </AnimatedComponent>

                    <AnimatedComponent delay={0.2}>
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Messages</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.messagesCount}</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <MessageSquare className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </AnimatedComponent>

                    <AnimatedComponent delay={0.3}>
                        <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </AnimatedComponent>
                </StaggeredAnimationContainer>

                {/* Quick Actions */}
                <AnimatedComponent delay={0.3}>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/projects/create">
                                <Button
                                    variant="purple"
                                    className="w-full flex items-center justify-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Post Project
                                </Button>
                            </Link>

                            <Link href="/creatives">
                                <Button
                                    variant="outline"
                                    className="w-full border-beacon-purple text-beacon-purple hover:bg-beacon-purple-light/10 flex items-center justify-center"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    Browse Talent
                                </Button>
                            </Link>

                            <Link href="/messages">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center"
                                >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Messages
                                </Button>
                            </Link>

                            <Link href="/analytics">
                                <Button
                                    variant="outline"
                                    className="w-full flex items-center justify-center"
                                >
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Analytics
                                </Button>
                            </Link>
                        </div>
                    </div>
                </AnimatedComponent>

                {/* Recent Projects */}
                <AnimatedComponent delay={0.4}>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
                            <Link href="/projects" className="text-beacon-purple hover:text-beacon-purple-dark font-medium">
                                View All →
                            </Link>
                        </div>

                        <StaggeredAnimationContainer staggerDelay={0.1} className="space-y-4">
                            {projects.slice(0, 3).map((project) => (
                                <AnimatedComponent key={project.id}>
                                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                                                <p className="text-gray-600 mb-2">{project.category}</p>
                                                <p className="text-gray-700 line-clamp-2">{project.description}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="h-4 w-4" />
                                                    <span>{project.applications?.length || 0} applications</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{project.timeline_weeks || 'TBD'} weeks</span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {getBudgetDisplay(project)}
                                            </div>
                                        </div>
                                    </div>
                                </AnimatedComponent>
                            ))}
                        </StaggeredAnimationContainer>
                    </div>
                </AnimatedComponent>

                {/* Top Creatives */}
                <AnimatedComponent delay={0.5}>
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Recommended Creatives</h2>
                            <Link href="/creatives" className="text-beacon-purple hover:text-beacon-purple-dark font-medium">
                                View All →
                            </Link>
                        </div>

                        <StaggeredAnimationContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topCreatives.map((creative, index) => (
                                <AnimatedComponent key={creative.id}>
                                    <CreativeCard
                                        id={creative.id}
                                        first_name={creative.first_name}
                                        last_name={creative.last_name}
                                        email={creative.email}
                                        bio={creative.bio}
                                        location={creative.location}
                                        hourly_rate={creative.hourly_rate}
                                        skills={creative.skills}
                                        portfolio_links={creative.portfolio_links}
                                        profile_image_url={creative.profile_image_url}
                                        is_verified={creative.is_verified}
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
            <AnimatedComponent delay={0.6}>
                <BottomNavigation userType="client" />
            </AnimatedComponent>
        </div>
    )
}