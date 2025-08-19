import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Platform Analytics | B3ACON Admin',
    description: 'View platform analytics and metrics.',
}

export default function AdminAnalyticsPage() {
    // Mock data for analytics
    const stats = [
        { label: 'Total Users', value: '1,248', change: '+12%' },
        { label: 'Active Projects', value: '324', change: '+8%' },
        { label: 'Completed Projects', value: '1,562', change: '+5%' },
        { label: 'Total Payments', value: '$248,650', change: '+15%' },
    ]

    const userGrowth = [
        { month: 'Jan', users: 400 },
        { month: 'Feb', users: 600 },
        { month: 'Mar', users: 800 },
        { month: 'Apr', users: 1000 },
        { month: 'May', users: 1200 },
        { month: 'Jun', users: 1248 },
    ]

    const projectStats = [
        { category: 'Design', count: 120, percentage: 37 },
        { category: 'Development', count: 95, percentage: 29 },
        { category: 'Marketing', count: 72, percentage: 22 },
        { category: 'Video', count: 37, percentage: 11 },
    ]

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Platform Analytics</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{stat.label}</h3>
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                                    <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* User Growth Chart */}
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">User Growth</h2>
                            <div className="h-64 flex items-end space-x-2">
                                {userGrowth.map((data, index) => (
                                    <div key={index} className="flex flex-col items-center flex-1">
                                        <div
                                            className="w-full bg-beacon-purple rounded-t-md hover:bg-beacon-purple-dark transition-colors"
                                            style={{ height: `${(data.users / 1300) * 100}%` }}
                                        ></div>
                                        <span className="text-xs text-neutral-500 mt-2">{data.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Categories */}
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Project Categories</h2>
                            <div className="space-y-4">
                                {projectStats.map((stat, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-neutral-700">{stat.category}</span>
                                            <span className="text-sm font-medium text-neutral-700">{stat.count} ({stat.percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 rounded-full h-2">
                                            <div
                                                className="bg-beacon-purple h-2 rounded-full"
                                                style={{ width: `${stat.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-10 h-10 flex-shrink-0 mr-4" />
                                <div>
                                    <p className="text-neutral-900"><span className="font-semibold">John Client</span> posted a new project: "Website Redesign"</p>
                                    <p className="text-sm text-neutral-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-10 h-10 flex-shrink-0 mr-4" />
                                <div>
                                    <p className="text-neutral-900"><span className="font-semibold">Jane Creative</span> applied to "Mobile App Development"</p>
                                    <p className="text-sm text-neutral-500">4 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-10 h-10 flex-shrink-0 mr-4" />
                                <div>
                                    <p className="text-neutral-900">Payment of $3,000 released for "Brand Identity Package"</p>
                                    <p className="text-sm text-neutral-500">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}