'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const profileSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    bio: z.string().optional(),
    location: z.string().optional(),
    hourlyRate: z.number().min(1, 'Hourly rate must be greater than 0').optional(),
})

const notificationSchema = z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    messageNotifications: z.boolean(),
    projectNotifications: z.boolean(),
})

const securitySchema = z.object({
    currentPassword: z.string().min(8, 'Current password must be at least 8 characters'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').optional(),
    confirmNewPassword: z.string().optional(),
}).refine((data) => {
    if (data.newPassword && !data.confirmNewPassword) {
        return false
    }
    if (data.newPassword && data.confirmNewPassword && data.newPassword !== data.confirmNewPassword) {
        return false
    }
    return true
}, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type NotificationFormData = z.infer<typeof notificationSchema>
type SecurityFormData = z.infer<typeof securitySchema>

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()

    // Mock initial data
    const mockProfileData: ProfileFormData = {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        bio: 'Passionate fashion photographer with 8+ years of experience.',
        location: 'New York, NY',
        hourlyRate: 75,
    }

    const mockNotificationData: NotificationFormData = {
        emailNotifications: true,
        pushNotifications: true,
        messageNotifications: true,
        projectNotifications: false,
    }

    // Profile form
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
        reset: resetProfile,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: mockProfileData
    })

    // Notification form
    const {
        control: controlNotifications,
        handleSubmit: handleSubmitNotifications,
        reset: resetNotifications,
    } = useForm<NotificationFormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: mockNotificationData
    })

    // Security form
    const {
        register: registerSecurity,
        handleSubmit: handleSubmitSecurity,
        formState: { errors: securityErrors },
        watch: watchSecurity,
        reset: resetSecurity,
    } = useForm<SecurityFormData>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        }
    })

    const newPassword = watchSecurity('newPassword')

    const onSubmitProfile = async (data: ProfileFormData) => {
        try {
            setLoading(true)
            // In a real implementation, this would call the API
            // await usersAPI.updateCurrentUser(data)

            showNotification('Profile updated successfully!', 'success')
        } catch (err) {
            console.error('Error updating profile:', err)
            showNotification('Failed to update profile. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const onSubmitNotifications = async (data: NotificationFormData) => {
        try {
            setLoading(true)
            // In a real implementation, this would call the API
            // await usersAPI.updateNotificationSettings(data)

            showNotification('Notification settings updated!', 'success')
        } catch (err) {
            console.error('Error updating notifications:', err)
            showNotification('Failed to update notification settings. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const onSubmitSecurity = async (data: SecurityFormData) => {
        try {
            setLoading(true)
            // In a real implementation, this would call the API
            // await usersAPI.changePassword(data)

            showNotification('Password updated successfully!', 'success')
            resetSecurity()
        } catch (err) {
            console.error('Error updating password:', err)
            showNotification('Failed to update password. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const tabs = [
        { id: 'profile', name: 'Profile' },
        { id: 'notifications', name: 'Notifications' },
        { id: 'security', name: 'Security' },
    ]

    if (loading) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading settings..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Settings</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={() => {
                                resetProfile(mockProfileData)
                                resetNotifications(mockNotificationData)
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
        <SimplifiedLayout userType="creative" showSearch={true} searchPlaceholder="Search...">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
                        <p className="text-neutral-600 mt-2">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    <ErrorBoundary>
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                            {/* Tabs */}
                            <div className="border-b border-neutral-200">
                                <nav className="flex -mb-px">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === tab.id
                                                    ? 'border-beacon-purple text-beacon-purple'
                                                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                                                }`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {tab.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            <div className="p-6">
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Profile Information</h2>
                                        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                                                        First Name
                                                    </label>
                                                    <input
                                                        id="firstName"
                                                        {...registerProfile('firstName')}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${profileErrors.firstName ? 'border-red-500' : 'border-neutral-300'}`}
                                                    />
                                                    {profileErrors.firstName && (
                                                        <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        id="lastName"
                                                        {...registerProfile('lastName')}
                                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${profileErrors.lastName ? 'border-red-500' : 'border-neutral-300'}`}
                                                    />
                                                    {profileErrors.lastName && (
                                                        <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    {...registerProfile('email')}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${profileErrors.email ? 'border-red-500' : 'border-neutral-300'}`}
                                                />
                                                {profileErrors.email && (
                                                    <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Location
                                                </label>
                                                <input
                                                    id="location"
                                                    {...registerProfile('location')}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${profileErrors.location ? 'border-red-500' : 'border-neutral-300'}`}
                                                />
                                                {profileErrors.location && (
                                                    <p className="mt-1 text-sm text-red-600">{profileErrors.location.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Bio
                                                </label>
                                                <textarea
                                                    id="bio"
                                                    rows={4}
                                                    {...registerProfile('bio')}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${profileErrors.bio ? 'border-red-500' : 'border-neutral-300'}`}
                                                />
                                                {profileErrors.bio && (
                                                    <p className="mt-1 text-sm text-red-600">{profileErrors.bio.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="hourlyRate" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Hourly Rate (USD)
                                                </label>
                                                <input
                                                    id="hourlyRate"
                                                    type="number"
                                                    {...registerProfile('hourlyRate', { valueAsNumber: true })}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${profileErrors.hourlyRate ? 'border-red-500' : 'border-neutral-300'}`}
                                                />
                                                {profileErrors.hourlyRate && (
                                                    <p className="mt-1 text-sm text-red-600">{profileErrors.hourlyRate.message}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button variant="primary" type="submit">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeTab === 'notifications' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Notification Preferences</h2>
                                        <form onSubmit={handleSubmitNotifications(onSubmitNotifications)} className="space-y-6">
                                            <div className="space-y-4">
                                                <Controller
                                                    name="emailNotifications"
                                                    control={controlNotifications}
                                                    render={({ field }) => (
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-sm font-medium text-neutral-900">Email Notifications</h3>
                                                                <p className="text-sm text-neutral-500">Receive email notifications for important updates</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                                            </label>
                                                        </div>
                                                    )}
                                                />

                                                <Controller
                                                    name="pushNotifications"
                                                    control={controlNotifications}
                                                    render={({ field }) => (
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-sm font-medium text-neutral-900">Push Notifications</h3>
                                                                <p className="text-sm text-neutral-500">Receive push notifications on your devices</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                                            </label>
                                                        </div>
                                                    )}
                                                />

                                                <Controller
                                                    name="messageNotifications"
                                                    control={controlNotifications}
                                                    render={({ field }) => (
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-sm font-medium text-neutral-900">Message Notifications</h3>
                                                                <p className="text-sm text-neutral-500">Receive notifications for new messages</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                                            </label>
                                                        </div>
                                                    )}
                                                />

                                                <Controller
                                                    name="projectNotifications"
                                                    control={controlNotifications}
                                                    render={({ field }) => (
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="text-sm font-medium text-neutral-900">Project Notifications</h3>
                                                                <p className="text-sm text-neutral-500">Receive notifications for project updates</p>
                                                            </div>
                                                            <label className="relative inline-flex items-center cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    className="sr-only peer"
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                />
                                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                                            </label>
                                                        </div>
                                                    )}
                                                />
                                            </div>

                                            <div className="flex justify-end">
                                                <Button variant="primary" type="submit">
                                                    Save Preferences
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Security Tab */}
                                {activeTab === 'security' && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-neutral-900 mb-6">Security Settings</h2>
                                        <form onSubmit={handleSubmitSecurity(onSubmitSecurity)} className="space-y-6">
                                            <div>
                                                <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Current Password
                                                </label>
                                                <input
                                                    id="currentPassword"
                                                    type="password"
                                                    {...registerSecurity('currentPassword')}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${securityErrors.currentPassword ? 'border-red-500' : 'border-neutral-300'}`}
                                                />
                                                {securityErrors.currentPassword && (
                                                    <p className="mt-1 text-sm text-red-600">{securityErrors.currentPassword.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    New Password
                                                </label>
                                                <input
                                                    id="newPassword"
                                                    type="password"
                                                    {...registerSecurity('newPassword')}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${securityErrors.newPassword ? 'border-red-500' : 'border-neutral-300'}`}
                                                />
                                                {securityErrors.newPassword && (
                                                    <p className="mt-1 text-sm text-red-600">{securityErrors.newPassword.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    id="confirmNewPassword"
                                                    type="password"
                                                    {...registerSecurity('confirmNewPassword')}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${securityErrors.confirmNewPassword ? 'border-red-500' : 'border-neutral-300'}`}
                                                />
                                                {securityErrors.confirmNewPassword && (
                                                    <p className="mt-1 text-sm text-red-600">{securityErrors.confirmNewPassword.message}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button variant="primary" type="submit">
                                                    Update Password
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
        </SimplifiedLayout>
    )
}