'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatDate } from '@/lib/utils'
import { Briefcase, CheckCircle, DollarSign, MessageSquare, User } from 'lucide-react'
import { useState } from 'react'

interface Notification {
    id: string
    type: 'project' | 'application' | 'message' | 'payment' | 'system'
    title: string
    message: string
    read: boolean
    createdAt: string
    relatedId?: string
    relatedType?: 'project' | 'application' | 'message' | 'payment' | 'user'
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()
    const [filterType, setFilterType] = useState('all')

    // Mock data for demonstration
    const mockNotifications: Notification[] = [
        {
            id: '1',
            type: 'application',
            title: 'New Application Received',
            message: 'Sarah Johnson has applied to your Fashion Editorial Photography project.',
            read: false,
            createdAt: '2023-06-15T14:30:00Z',
            relatedId: '101',
            relatedType: 'application'
        },
        {
            id: '2',
            type: 'message',
            title: 'New Message',
            message: 'Michael Chen sent you a message about the Brand Identity Design project.',
            read: false,
            createdAt: '2023-06-14T09:15:00Z',
            relatedId: '201',
            relatedType: 'message'
        },
        {
            id: '3',
            type: 'payment',
            title: 'Payment Released',
            message: 'Payment for Website Copywriting project has been released to Emma Rodriguez.',
            read: true,
            createdAt: '2023-06-12T16:45:00Z',
            relatedId: '301',
            relatedType: 'payment'
        },
        {
            id: '4',
            type: 'project',
            title: 'Project Update',
            message: 'The deadline for Product Video Animation project has been extended by 1 week.',
            read: true,
            createdAt: '2023-06-10T11:20:00Z',
            relatedId: '401',
            relatedType: 'project'
        },
        {
            id: '5',
            type: 'application',
            title: 'Application Accepted',
            message: 'Your application for Social Media Content Creation has been accepted!',
            read: false,
            createdAt: '2023-06-08T14:30:00Z',
            relatedId: '501',
            relatedType: 'application'
        },
        {
            id: '6',
            type: 'message',
            title: 'New Message',
            message: 'David Kim sent you a message about the Product Video Animation project.',
            read: true,
            createdAt: '2023-06-05T10:45:00Z',
            relatedId: '601',
            relatedType: 'message'
        },
        {
            id: '7',
            type: 'system',
            title: 'Profile Update',
            message: 'Your profile has been successfully updated. Great job completing your portfolio!',
            read: true,
            createdAt: '2023-06-01T09:30:00Z'
        }
    ]

    // Simulate loading
    setTimeout(() => {
        setNotifications(mockNotifications)
        setLoading(false)
    }, 500)

    const filteredNotifications = notifications.filter(notification => {
        return filterType === 'all' || notification.type === filterType
    })

    const getIconForType = (type: Notification['type']) => {
        switch (type) {
            case 'project':
                return <Briefcase className="h-5 w-5" />
            case 'application':
                return <User className="h-5 w-5" />
            case 'message':
                return <MessageSquare className="h-5 w-5" />
            case 'payment':
                return <DollarSign className="h-5 w-5" />
            case 'system':
                return <CheckCircle className="h-5 w-5" />
            default:
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                )
        }
    }

    const getColorForType = (type: Notification['type']) => {
        switch (type) {
            case 'project':
                return 'bg-blue-100 text-blue-600'
            case 'application':
                return 'bg-purple-100 text-purple-600'
            case 'message':
                return 'bg-green-100 text-green-600'
            case 'payment':
                return 'bg-yellow-100 text-yellow-600'
            case 'system':
                return 'bg-gray-100 text-gray-600'
            default:
                return 'bg-neutral-100 text-neutral-600'
        }
    }

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        )
        showNotification('All notifications marked as read', 'success')
    }

    const clearAll = () => {
        setNotifications([])
        showNotification('All notifications cleared', 'success')
    }

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search notifications...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading notifications..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search notifications...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Notifications</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={() => {
                                setNotifications(mockNotifications)
                                setLoading(false)
                            }}>
                                Try Again
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search notifications...">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
                        <p className="text-neutral-600 mt-2">
                            Stay updated with project activities and platform announcements
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-3">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                        >
                            <option value="all">All Notifications</option>
                            <option value="project">Projects</option>
                            <option value="application">Applications</option>
                            <option value="message">Messages</option>
                            <option value="payment">Payments</option>
                            <option value="system">System</option>
                        </select>
                        <Button variant="outline" onClick={markAllAsRead}>
                            Mark All Read
                        </Button>
                        <Button variant="outline" onClick={clearAll}>
                            Clear All
                        </Button>
                    </div>
                </div>

                <ErrorBoundary>
                    {filteredNotifications.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                            <ul className="divide-y divide-neutral-200">
                                {filteredNotifications.map((notification) => (
                                    <li
                                        key={notification.id}
                                        className={`p-6 hover:bg-neutral-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                    >
                                        <div className="flex items-start">
                                            <div className={`flex-shrink-0 p-2 rounded-full ${getColorForType(notification.type)}`}>
                                                {getIconForType(notification.type)}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className={`text-sm font-medium ${notification.read ? 'text-neutral-900' : 'text-neutral-900 font-semibold'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <div className="flex items-center">
                                                        <span className="text-xs text-neutral-500">
                                                            {formatDate(notification.createdAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {!notification.read && (
                                                            <span className="ml-2 inline-flex items-center justify-center h-2 w-2 rounded-full bg-beacon-purple"></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-sm text-neutral-600">
                                                    {notification.message}
                                                </p>
                                                <div className="mt-3 flex items-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        disabled={notification.read}
                                                    >
                                                        {notification.read ? 'Read' : 'Mark as Read'}
                                                    </Button>
                                                    {notification.relatedId && (
                                                        <Button variant="primary" size="sm" className="ml-2">
                                                            View Details
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100">
                                <svg className="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2 mt-4">
                                {filterType === 'all' ? 'No Notifications' : `No ${filterType} Notifications`}
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                {filterType === 'all'
                                    ? 'You don\'t have any notifications at the moment.'
                                    : `You don't have any ${filterType} notifications.`}
                            </p>
                            <Button variant="primary" onClick={() => setFilterType('all')}>
                                View All Notifications
                            </Button>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </SimplifiedLayout>
    )
}