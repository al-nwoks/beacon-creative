'use client'

import BottomNavigation from '@/components/shared/BottomNavigation'
import Header from '@/components/shared/Header'
import Button from '@/components/ui/Button'
import { projectsAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle, Briefcase, CheckCircle, DollarSign, Shield, TrendingUp, Users, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AdminStats {
    totalUsers: number
    totalCreatives: number
    totalClients: number
    totalProjects: number
    activeProjects: number
    totalRevenue: number
    monthlyGrowth: number
}

interface User {
    id: string
    first_name: string
    last_name: string
    email: string
    user_type: string
    is_verified: boolean
    is_active: boolean
    created_at: string
}

interface Project {
    id: string
    title: string
    status: string
    budget_min?: number
    budget_max?: number
    created_at: string
    client: {
        first_name: string
        last_name: string
    }
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        totalUsers: 0,
        totalCreatives: 0,
        totalClients: 0,
        totalProjects: 0,
        activeProjects: 0,
        totalRevenue: 0,
        monthlyGrowth: 0
    })
    const [recentUsers, setRecentUsers] = useState<User[]>([])
    const [recentProjects, setRecentProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAdminData()
    }, [])

    const loadAdminData = async () => {
        try {
            setLoading(true)

            // Mock admin data - in a real app, you'd have admin-specific endpoints
            setStats({
                totalUsers: 156,
                totalCreatives: 89,
                totalClients: 67,
                totalProjects: 234,
                activeProjects: 45,
                totalRevenue: 125000,
                monthlyGrowth: 12.5
            })

            // Mock recent users
            setRecentUsers([
                {
                    id: '1',
                    first_name: 'Sarah',
                    last_name: 'Johnson',
                    email: 'sarah.johnson@example.com',
                    user_type: 'creative',
                    is_verified: true,
                    is_active: true,
                    created_at: new Date().toISOString()
                },
                {
                    id: '2',
                    first_name: 'John',
                    last_name: 'Smith',
                    email: 'john.smith@stylemagzine.com',
                    user_type: 'client',
                    is_verified: true,
                    is_active: true,
                    created_at: new Date(Date.now() - 86400000).toISOString()
                },
                {
                    id: '3',
                    first_name: 'Mike',
                    last_name: 'Chen',
                    email: 'mike.chen@example.com',
                    user_type: 'creative',
                    is_verified: false,
                    is_active: true,
                    created_at: new Date(Date.now() - 172800000).toISOString()
                }
            ])

            // Load recent projects
            const projects = await projectsAPI.getProjects({ limit: 5 })
            setRecentProjects(projects)

        } catch (error) {
            console.error('Error loading admin data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUserAction = (userId: string, action: 'verify' | 'suspend' | 'activate') => {
        console.log(`${action} user:`, userId)
        // Implement user management actions
    }

    const handleProjectAction = (projectId: string, action: 'approve' | 'suspend' | 'delete') => {
        console.log(`${action} project:`, projectId)
        // Implement project management actions
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'text-green-600'
            case 'suspended':
                return 'text-red-600'
            case 'pending':
                return 'text-yellow-600'
            default:
                return 'text-gray-600'
        }
    }

    const getUserTypeColor = (userType: string) => {
        switch (userType) {
            case 'creative':
                return 'bg-purple-100 text-purple-800'
            case 'client':
                return 'bg-blue-100 text-blue-800'
            case 'admin':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <Header
                showSearch={true}
                searchPlaceholder="Search users, projects..."
                userType="admin"
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Admin Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-2">
                        <Shield className="h-6 w-6 text-purple-600 mr-2" />
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <p className="text-gray-600">Manage users, projects, and platform analytics.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stats.totalCreatives} creatives, {stats.totalClients} clients
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Projects</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stats.activeProjects} active
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Briefcase className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                                <p className="text-xs text-green-600 mt-1">
                                    +{stats.monthlyGrowth}% this month
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Growth Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.monthlyGrowth}%</p>
                                <p className="text-xs text-gray-500 mt-1">Monthly</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                            variant="primary"
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            <Users className="h-4 w-4 mr-2" />
                            Manage Users
                        </Button>

                        <Button variant="outline">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Review Projects
                        </Button>

                        <Button variant="outline">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            View Reports
                        </Button>

                        <Button variant="outline">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Analytics
                        </Button>
                    </div>
                </div>

                {/* Recent Users */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                        <Button variant="outline" size="sm">
                            View All Users
                        </Button>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.user_type)}`}>
                                                    {user.user_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {user.is_verified ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                                    )}
                                                    <span className={`text-sm ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {!user.is_verified && (
                                                        <button
                                                            onClick={() => handleUserAction(user.id, 'verify')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleUserAction(user.id, user.is_active ? 'suspend' : 'activate')}
                                                        className={user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                                                    >
                                                        {user.is_active ? 'Suspend' : 'Activate'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
                        <Button variant="outline" size="sm">
                            View All Projects
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {recentProjects.slice(0, 3).map((project) => (
                            <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                                        <p className="text-gray-600 mb-2">
                                            by {project.client.first_name} {project.client.last_name}
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                                            {project.budget_min && project.budget_max && (
                                                <span>Budget: {formatCurrency(project.budget_min)} - {formatCurrency(project.budget_max)}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                            project.status === 'hired' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {project.status}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleProjectAction(project.id, 'approve')}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation userType="admin" />
        </div>
    )
}