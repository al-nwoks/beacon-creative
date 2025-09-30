'use client'

import { useState, useEffect } from 'react'
import { useNotification } from '@/components/ui/NotificationProvider'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import Button from '@/components/ui/Button'
import { clientFetcher } from '@/lib/api'
import { BarChart3, Briefcase, Users, Activity, Download, RefreshCw } from 'lucide-react'

interface AdminAnalyticsClientProps {
    initialStats: any
    initialAnalytics: any
    initialActivity: any[]
    error: string | null
}

export default function AdminAnalyticsClient({ 
    initialStats, 
    initialAnalytics, 
    initialActivity, 
    error: initialError 
}: AdminAnalyticsClientProps) {
    const [stats, setStats] = useState(initialStats)
    const [analyticsData, setAnalyticsData] = useState(initialAnalytics)
    const [recentActivity, setRecentActivity] = useState(initialActivity)
    const [auditLogs, setAuditLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(initialError)
    const [selectedTimeRange, setSelectedTimeRange] = useState('30')
    const [showAuditLogs, setShowAuditLogs] = useState(false)
    const { showNotification } = useNotification()

    // Refresh data
    const refreshData = async () => {
        try {
            setLoading(true)
            setError(null)

            const [statsData, analyticsDataResp, activityData] = await Promise.all([
                clientFetcher('/api/admin/stats', { method: 'GET' }),
                clientFetcher(`/api/admin/analytics?days=${selectedTimeRange}`, { method: 'GET' }),
                clientFetcher('/api/admin/recent-activity?limit=10', { method: 'GET' })
            ])

            setStats(statsData)
            setAnalyticsData(analyticsDataResp)
            setRecentActivity(activityData)
            
            showNotification('Data refreshed successfully', 'success')
        } catch (err: any) {
            console.error('Failed to refresh data:', err)
            setError('Failed to refresh data')
            showNotification('Failed to refresh data', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Fetch audit logs
    const fetchAuditLogs = async () => {
        try {
            const logs = await clientFetcher('/api/admin/audit-logs?limit=50', { method: 'GET' })
            setAuditLogs(logs)
        } catch (err: any) {
            console.error('Failed to fetch audit logs:', err)
            showNotification('Failed to fetch audit logs', 'error')
        }
    }

    // Export data
    const exportData = () => {
        const exportData = {
            stats,
            analytics: analyticsData,
            recent_activity: recentActivity,
            exported_at: new Date().toISOString()
        }

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `platform-analytics-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        showNotification('Analytics data exported successfully', 'success')
    }

    // Handle time range change
    const handleTimeRangeChange = (days: string) => {
        setSelectedTimeRange(days)
        // Refresh analytics data with new time range
        clientFetcher(`/api/admin/analytics?days=${days}`, { method: 'GET' })
            .then(setAnalyticsData)
            .catch(err => {
                console.error('Failed to fetch analytics:', err)
                showNotification('Failed to update analytics', 'error')
            })
    }

    if (error && !stats) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Unable to load analytics</h3>
                    <p className="mt-2 text-sm text-neutral-500">{error}</p>
                    <Button onClick={refreshData} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-neutral-900">Platform Analytics</h1>
                <div className="flex space-x-2">
                    <select 
                        value={selectedTimeRange}
                        onChange={(e) => handleTimeRangeChange(e.target.value)}
                        className="rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple"
                    >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                    </select>
                    <Button variant="outline" onClick={exportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                    <Button variant="outline" onClick={refreshData} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Total Users</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total_users}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Total Creatives</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.creatives}</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <Briefcase className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Total Clients</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.clients}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <Briefcase className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Total Admins</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.admins}</p>
                        </div>
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Growth Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">User Growth</h2>
                    <div className="h-64">
                        {analyticsData.user_growth && analyticsData.user_growth.length > 0 ? (
                            <div className="h-full flex items-end space-x-1">
                                {analyticsData.user_growth.slice(-14).map((data: any, index: number) => (
                                    <div key={index} className="flex-1 bg-blue-200 rounded-t" style={{
                                        height: `${Math.max(10, (data.count / Math.max(...analyticsData.user_growth.map((d: any) => d.count))) * 100)}%`
                                    }}>
                                        <div className="text-xs text-center mt-1 text-blue-800">
                                            {data.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-neutral-50 rounded-lg">
                                <p className="text-neutral-500">No user growth data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gig Growth Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">Gig Growth</h2>
                    <div className="h-64">
                        {analyticsData.gig_growth && analyticsData.gig_growth.length > 0 ? (
                            <div className="h-full flex items-end space-x-1">
                                {analyticsData.gig_growth.slice(-14).map((data: any, index: number) => (
                                    <div key={index} className="flex-1 bg-purple-200 rounded-t" style={{
                                        height: `${Math.max(10, (data.count / Math.max(...analyticsData.gig_growth.map((d: any) => d.count))) * 100)}%`
                                    }}>
                                        <div className="text-xs text-center mt-1 text-purple-800">
                                            {data.count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-neutral-50 rounded-lg">
                                <p className="text-neutral-500">No gig growth data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Activity and Audit Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-neutral-900">Recent Platform Activity</h2>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                                setShowAuditLogs(!showAuditLogs)
                                if (!showAuditLogs && auditLogs.length === 0) {
                                    fetchAuditLogs()
                                }
                            }}
                        >
                            <Activity className="h-4 w-4 mr-2" />
                            {showAuditLogs ? 'Show Activity' : 'Show Audit Logs'}
                        </Button>
                    </div>
                    
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {showAuditLogs ? (
                            // Audit Logs View
                            auditLogs.length > 0 ? (
                                auditLogs.map((log) => (
                                    <div key={log.id} className="border border-neutral-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-neutral-900">{log.description}</h3>
                                                <p className="text-sm text-neutral-600">
                                                    by {log.admin_user?.first_name} {log.admin_user?.last_name}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {log.action}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {log.resource_type}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-sm text-neutral-500">
                                                {new Date(log.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-neutral-500">No audit logs available</p>
                                </div>
                            )
                        ) : (
                            // Recent Activity View
                            recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="border border-neutral-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-medium text-neutral-900">{activity.action}</h3>
                                                <p className="text-sm text-neutral-600">
                                                    by {activity.admin_name}
                                                </p>
                                            </div>
                                            <span className="text-sm text-neutral-500">
                                                {new Date(activity.time).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-neutral-500">No recent activity</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Payment Analytics */}
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                    <h2 className="text-xl font-semibold text-neutral-900 mb-4">Payment Analytics</h2>
                    <div className="h-64">
                        {analyticsData.payment_data && analyticsData.payment_data.length > 0 ? (
                            <div className="h-full flex items-end space-x-1">
                                {analyticsData.payment_data.slice(-14).map((data: any, index: number) => (
                                    <div key={index} className="flex-1 bg-green-200 rounded-t" style={{
                                        height: `${Math.max(10, (data.amount / Math.max(...analyticsData.payment_data.map((d: any) => d.amount))) * 100)}%`
                                    }}>
                                        <div className="text-xs text-center mt-1 text-green-800">
                                            ${Math.round(data.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-neutral-50 rounded-lg">
                                <p className="text-neutral-500">No payment data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">System Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">Database</h3>
                        <p className="text-sm text-green-600">Healthy</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">API</h3>
                        <p className="text-sm text-green-600">Operational</p>
                    </div>
                    
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-neutral-900">WebSocket</h3>
                        <p className="text-sm text-green-600">Connected</p>
                    </div>
                </div>
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <EnhancedLoadingSpinner size="lg" message="Refreshing data..." />
                </div>
            )}
        </main>
    )
}