'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { useNotification } from '@/components/ui/NotificationProvider'
import { notificationSettingsAPI, passwordAPI, usersAPI } from '@/lib/api'
import type { NotificationSetting, User } from '@/types/api'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('account')
    const [user, setUser] = useState<User | null>(null)
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { showNotification } = useNotification()

    // Form states
    const [accountData, setAccountData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        timezone: 'utc'
    })

    const [notificationData, setNotificationData] = useState({
        email_gig_updates: true,
        email_messages: true,
        email_application_status: true,
        email_payment_updates: true,
        email_newsletter: true,
        in_app_gig_updates: true,
        in_app_messages: true,
        in_app_application_status: true,
        in_app_payment_updates: true,
        push_gig_updates: true,
        push_messages: true,
        push_application_status: true,
        push_payment_updates: true
    })

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [privacyData, setPrivacyData] = useState({
        profile_visibility: true,
        search_appearance: true,
        data_collection: true,
        marketing_emails: true,
        product_updates: true
    })

    // Fetch user data and notification settings on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const userData = await usersAPI.getCurrentUser()
                setUser(userData)

                setAccountData({
                    email: userData.email || '',
                    first_name: userData.first_name || '',
                    last_name: userData.last_name || '',
                    timezone: 'utc' // Default value, would be fetched from user preferences
                })

                // Fetch notification settings
                try {
                    const settingsData = await notificationSettingsAPI.getNotificationSettings()
                    setNotificationSettings(settingsData)
                    setNotificationData({
                        email_gig_updates: settingsData.email_gig_updates ?? true,
                        email_messages: settingsData.email_messages ?? true,
                        email_application_status: settingsData.email_application_status ?? true,
                        email_payment_updates: settingsData.email_payment_updates ?? true,
                        email_newsletter: settingsData.email_newsletter ?? true,
                        in_app_gig_updates: settingsData.in_app_gig_updates ?? true,
                        in_app_messages: settingsData.in_app_messages ?? true,
                        in_app_application_status: settingsData.in_app_application_status ?? true,
                        in_app_payment_updates: settingsData.in_app_payment_updates ?? true,
                        push_gig_updates: settingsData.push_gig_updates ?? true,
                        push_messages: settingsData.push_messages ?? true,
                        push_application_status: settingsData.push_application_status ?? true,
                        push_payment_updates: settingsData.push_payment_updates ?? true
                    })
                } catch (error) {
                    console.error('Failed to fetch notification settings:', error)
                    // Create default settings if none exist
                    setNotificationData({
                        email_gig_updates: true,
                        email_messages: true,
                        email_application_status: true,
                        email_payment_updates: true,
                        email_newsletter: true,
                        in_app_gig_updates: true,
                        in_app_messages: true,
                        in_app_application_status: true,
                        in_app_payment_updates: true,
                        push_gig_updates: true,
                        push_messages: true,
                        push_application_status: true,
                        push_payment_updates: true
                    })
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error)
                showNotification('Failed to load user data', 'error')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [showNotification])

    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const updatedUser = await usersAPI.updateUser({
                email: accountData.email,
                first_name: accountData.first_name,
                last_name: accountData.last_name
            })
            setUser(updatedUser)
            showNotification('Account settings saved successfully', 'success')
        } catch (error: any) {
            console.error('Failed to save account settings:', error)
            showNotification(error.message || 'Failed to save account settings', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleNotificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const updatedSettings = await notificationSettingsAPI.updateNotificationSettings(notificationData)
            setNotificationSettings(updatedSettings)
            showNotification('Notification settings saved successfully', 'success')
        } catch (error: any) {
            console.error('Failed to save notification settings:', error)
            showNotification(error.message || 'Failed to save notification settings', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleSecuritySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        // Validate password fields
        if (!securityData.currentPassword) {
            showNotification('Please enter your current password', 'error')
            setSaving(false)
            return
        }

        if (!securityData.newPassword) {
            showNotification('Please enter a new password', 'error')
            setSaving(false)
            return
        }

        if (securityData.newPassword !== securityData.confirmPassword) {
            showNotification('New passwords do not match', 'error')
            setSaving(false)
            return
        }

        if (securityData.newPassword.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error')
            setSaving(false)
            return
        }

        try {
            await passwordAPI.changePassword(securityData.currentPassword, securityData.newPassword)
            showNotification('Password updated successfully', 'success')
            setSecurityData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
        } catch (error: any) {
            console.error('Failed to update password:', error)
            showNotification(error.message || 'Failed to update password', 'error')
        } finally {
            setSaving(false)
        }
    }

    const handleNotificationChange = (field: keyof typeof notificationData, value: boolean) => {
        setNotificationData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePrivacyChange = (field: keyof typeof privacyData, value: boolean) => {
        setPrivacyData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const renderAccountSettings = () => (
        <form onSubmit={handleAccountSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={accountData.email}
                    onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-neutral-700 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={accountData.first_name}
                        onChange={(e) => setAccountData({ ...accountData, first_name: e.target.value })}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-neutral-700 mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={accountData.last_name}
                        onChange={(e) => setAccountData({ ...accountData, last_name: e.target.value })}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-neutral-700 mb-1">
                    Timezone
                </label>
                <select
                    id="timezone"
                    name="timezone"
                    value={accountData.timezone}
                    onChange={(e) => setAccountData({ ...accountData, timezone: e.target.value })}
                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                >
                    <option value="utc">UTC</option>
                    <option value="est">Eastern Time (ET)</option>
                    <option value="pst">Pacific Time (PT)</option>
                    <option value="cet">Central European Time (CET)</option>
                    <option value="africa/lagos">West Africa Time (WAT)</option>
                </select>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="bg-white py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-beacon-purple hover:bg-beacon-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )

    const renderNotificationSettings = () => (
        <form onSubmit={handleNotificationSubmit} className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
                <h3 className="text-lg font-medium text-neutral-900">Email Notifications</h3>
                <p className="text-sm text-neutral-500">Choose which emails you want to receive</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="email_gig_updates" className="text-sm font-medium text-neutral-900">
                            Gig Updates
                        </label>
                        <p className="text-sm text-neutral-500">Get notified about gig status changes</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="email_gig_updates"
                            id="email_gig_updates"
                            checked={notificationData.email_gig_updates}
                            onChange={(e) => handleNotificationChange('email_gig_updates', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="email_gig_updates"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.email_gig_updates ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.email_gig_updates ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="email_messages" className="text-sm font-medium text-neutral-900">
                            Messages
                        </label>
                        <p className="text-sm text-neutral-500">Get notified when you receive new messages</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="email_messages"
                            id="email_messages"
                            checked={notificationData.email_messages}
                            onChange={(e) => handleNotificationChange('email_messages', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="email_messages"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.email_messages ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.email_messages ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="email_application_status" className="text-sm font-medium text-neutral-900">
                            Application Status
                        </label>
                        <p className="text-sm text-neutral-500">Get notified about your application status</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="email_application_status"
                            id="email_application_status"
                            checked={notificationData.email_application_status}
                            onChange={(e) => handleNotificationChange('email_application_status', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="email_application_status"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.email_application_status ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.email_application_status ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="email_payment_updates" className="text-sm font-medium text-neutral-900">
                            Payment Updates
                        </label>
                        <p className="text-sm text-neutral-500">Get notified about payment status changes</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="email_payment_updates"
                            id="email_payment_updates"
                            checked={notificationData.email_payment_updates}
                            onChange={(e) => handleNotificationChange('email_payment_updates', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="email_payment_updates"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.email_payment_updates ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.email_payment_updates ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="email_newsletter" className="text-sm font-medium text-neutral-900">
                            Newsletter
                        </label>
                        <p className="text-sm text-neutral-500">Receive our monthly newsletter</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="email_newsletter"
                            id="email_newsletter"
                            checked={notificationData.email_newsletter}
                            onChange={(e) => handleNotificationChange('email_newsletter', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="email_newsletter"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.email_newsletter ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.email_newsletter ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="border-b border-neutral-200 pb-4 pt-6">
                <h3 className="text-lg font-medium text-neutral-900">In-App Notifications</h3>
                <p className="text-sm text-neutral-500">Choose which in-app notifications you want to see</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="in_app_gig_updates" className="text-sm font-medium text-neutral-900">
                            Gig Updates
                        </label>
                        <p className="text-sm text-neutral-500">Show gig status changes in-app</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="in_app_gig_updates"
                            id="in_app_gig_updates"
                            checked={notificationData.in_app_gig_updates}
                            onChange={(e) => handleNotificationChange('in_app_gig_updates', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="in_app_gig_updates"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.in_app_gig_updates ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.in_app_gig_updates ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="in_app_messages" className="text-sm font-medium text-neutral-900">
                            Messages
                        </label>
                        <p className="text-sm text-neutral-500">Show new messages in-app</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="in_app_messages"
                            id="in_app_messages"
                            checked={notificationData.in_app_messages}
                            onChange={(e) => handleNotificationChange('in_app_messages', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="in_app_messages"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.in_app_messages ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.in_app_messages ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="in_app_application_status" className="text-sm font-medium text-neutral-900">
                            Application Status
                        </label>
                        <p className="text-sm text-neutral-500">Show application status changes in-app</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="in_app_application_status"
                            id="in_app_application_status"
                            checked={notificationData.in_app_application_status}
                            onChange={(e) => handleNotificationChange('in_app_application_status', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="in_app_application_status"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.in_app_application_status ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.in_app_application_status ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="in_app_payment_updates" className="text-sm font-medium text-neutral-900">
                            Payment Updates
                        </label>
                        <p className="text-sm text-neutral-500">Show payment status changes in-app</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="in_app_payment_updates"
                            id="in_app_payment_updates"
                            checked={notificationData.in_app_payment_updates}
                            onChange={(e) => handleNotificationChange('in_app_payment_updates', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="in_app_payment_updates"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.in_app_payment_updates ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.in_app_payment_updates ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="border-b border-neutral-200 pb-4 pt-6">
                <h3 className="text-lg font-medium text-neutral-900">Push Notifications</h3>
                <p className="text-sm text-neutral-500">Choose which push notifications you want to receive</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="push_gig_updates" className="text-sm font-medium text-neutral-900">
                            Gig Updates
                        </label>
                        <p className="text-sm text-neutral-500">Receive push notifications for gig status changes</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="push_gig_updates"
                            id="push_gig_updates"
                            checked={notificationData.push_gig_updates}
                            onChange={(e) => handleNotificationChange('push_gig_updates', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="push_gig_updates"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.push_gig_updates ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.push_gig_updates ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="push_messages" className="text-sm font-medium text-neutral-900">
                            Messages
                        </label>
                        <p className="text-sm text-neutral-500">Receive push notifications for new messages</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="push_messages"
                            id="push_messages"
                            checked={notificationData.push_messages}
                            onChange={(e) => handleNotificationChange('push_messages', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="push_messages"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.push_messages ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.push_messages ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="push_application_status" className="text-sm font-medium text-neutral-900">
                            Application Status
                        </label>
                        <p className="text-sm text-neutral-500">Receive push notifications for application status changes</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="push_application_status"
                            id="push_application_status"
                            checked={notificationData.push_application_status}
                            onChange={(e) => handleNotificationChange('push_application_status', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="push_application_status"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.push_application_status ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.push_application_status ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="push_payment_updates" className="text-sm font-medium text-neutral-900">
                            Payment Updates
                        </label>
                        <p className="text-sm text-neutral-500">Receive push notifications for payment status changes</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="push_payment_updates"
                            id="push_payment_updates"
                            checked={notificationData.push_payment_updates}
                            onChange={(e) => handleNotificationChange('push_payment_updates', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="push_payment_updates"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${notificationData.push_payment_updates ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notificationData.push_payment_updates ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="bg-white py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-beacon-purple hover:bg-beacon-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )

    const renderPrivacySettings = () => (
        <div className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
                <h3 className="text-lg font-medium text-neutral-900">Data Privacy</h3>
                <p className="text-sm text-neutral-500">Control how your data is used</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="profile_visibility" className="text-sm font-medium text-neutral-900">
                            Profile Visibility
                        </label>
                        <p className="text-sm text-neutral-500">Make your profile visible to other users</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="profile_visibility"
                            id="profile_visibility"
                            checked={privacyData.profile_visibility}
                            onChange={(e) => handlePrivacyChange('profile_visibility', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="profile_visibility"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${privacyData.profile_visibility ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${privacyData.profile_visibility ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="search_appearance" className="text-sm font-medium text-neutral-900">
                            Search Appearance
                        </label>
                        <p className="text-sm text-neutral-500">Allow your profile to appear in search results</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="search_appearance"
                            id="search_appearance"
                            checked={privacyData.search_appearance}
                            onChange={(e) => handlePrivacyChange('search_appearance', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="search_appearance"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${privacyData.search_appearance ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${privacyData.search_appearance ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="data_collection" className="text-sm font-medium text-neutral-900">
                            Data Collection
                        </label>
                        <p className="text-sm text-neutral-500">Allow collection of usage data for analytics</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="data_collection"
                            id="data_collection"
                            checked={privacyData.data_collection}
                            onChange={(e) => handlePrivacyChange('data_collection', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="data_collection"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${privacyData.data_collection ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${privacyData.data_collection ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="border-b border-neutral-200 pb-4 pt-6">
                <h3 className="text-lg font-medium text-neutral-900">Communication Preferences</h3>
                <p className="text-sm text-neutral-500">Control how we communicate with you</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="marketing_emails" className="text-sm font-medium text-neutral-900">
                            Marketing Emails
                        </label>
                        <p className="text-sm text-neutral-500">Receive promotional emails and offers</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="marketing_emails"
                            id="marketing_emails"
                            checked={privacyData.marketing_emails}
                            onChange={(e) => handlePrivacyChange('marketing_emails', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="marketing_emails"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${privacyData.marketing_emails ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${privacyData.marketing_emails ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <label htmlFor="product_updates" className="text-sm font-medium text-neutral-900">
                            Product Updates
                        </label>
                        <p className="text-sm text-neutral-500">Receive emails about new features</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                            type="checkbox"
                            name="product_updates"
                            id="product_updates"
                            checked={privacyData.product_updates}
                            onChange={(e) => handlePrivacyChange('product_updates', e.target.checked)}
                            className="sr-only"
                        />
                        <label
                            htmlFor="product_updates"
                            className={`block h-6 w-10 rounded-full cursor-pointer ${privacyData.product_updates ? 'bg-beacon-purple' : 'bg-neutral-300'}`}
                        >
                            <span
                                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${privacyData.product_updates ? 'transform translate-x-4' : ''}`}
                            ></span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="border-b border-neutral-200 pb-4 pt-6">
                <h3 className="text-lg font-medium text-neutral-900">Data Management</h3>
                <p className="text-sm text-neutral-500">Manage your data</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-neutral-900">
                        Download Your Data
                    </label>
                    <p className="text-sm text-neutral-500 mb-2">Get a copy of your personal data</p>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-neutral-300 shadow-sm text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple"
                    >
                        Request Data Export
                    </button>
                </div>

                <div>
                    <label className="text-sm font-medium text-neutral-900">
                        Delete Account
                    </label>
                    <p className="text-sm text-neutral-500 mb-2">Permanently delete your account and all associated data</p>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-red-600 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    )

    const renderSecuritySettings = () => (
        <form onSubmit={handleSecuritySubmit} className="space-y-6">
            <div className="border-b border-neutral-200 pb-4">
                <h3 className="text-lg font-medium text-neutral-900">Change Password</h3>
                <p className="text-sm text-neutral-500">Update your account password</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                        Current Password
                    </label>
                    <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-neutral-500">Must be at least 8 characters long</p>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                    />
                </div>
            </div>

            <div className="border-b border-neutral-200 pb-4 pt-6">
                <h3 className="text-lg font-medium text-neutral-900">Two-Factor Authentication</h3>
                <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <label className="text-sm font-medium text-neutral-900">
                        Two-Factor Authentication
                    </label>
                    <p className="text-sm text-neutral-500">Require a code in addition to your password</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                        type="checkbox"
                        name="two_factor"
                        id="two_factor"
                        className="sr-only"
                    />
                    <label
                        htmlFor="two_factor"
                        className="block h-6 w-10 rounded-full bg-neutral-300 cursor-pointer"
                    >
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full"></span>
                    </label>
                </div>
            </div>

            <div className="border-b border-neutral-200 pb-4 pt-6">
                <h3 className="text-lg font-medium text-neutral-900">Active Sessions</h3>
                <p className="text-sm text-neutral-500">Manage your active sessions</p>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-neutral-900">Current Session</p>
                        <p className="text-xs text-neutral-500">Chrome on macOS · Lagos, Nigeria</p>
                        <p className="text-xs text-neutral-500">Active now</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                    </span>
                </div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-medium text-neutral-900">Firefox on Windows</p>
                        <p className="text-xs text-neutral-500">Lagos, Nigeria · 2 hours ago</p>
                    </div>
                    <button
                        type="button"
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                        Revoke
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="bg-white py-2 px-4 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-beacon-purple hover:bg-beacon-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )

    if (loading) {
        return (
            <ProtectedRoute>
                <SimplifiedLayout showSearch={false}>
                    <main className="container mx-auto px-4 py-8">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beacon-purple"></div>
                        </div>
                    </main>
                </SimplifiedLayout>
            </ProtectedRoute>
        )
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Settings</h1>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveSection('account')}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${activeSection === 'account'
                                            ? 'bg-neutral-100 text-neutral-900'
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                            }`}
                                    >
                                        <span className="truncate">Account</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('notifications')}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${activeSection === 'notifications'
                                            ? 'bg-neutral-100 text-neutral-900'
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                            }`}
                                    >
                                        <span className="truncate">Notifications</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('privacy')}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${activeSection === 'privacy'
                                            ? 'bg-neutral-100 text-neutral-900'
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                            }`}
                                    >
                                        <span className="truncate">Privacy</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('security')}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left ${activeSection === 'security'
                                            ? 'bg-neutral-100 text-neutral-900'
                                            : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                            }`}
                                    >
                                        <span className="truncate">Security</span>
                                    </button>
                                </nav>
                            </div>

                            <div className="md:col-span-2">
                                <div className="border-b border-neutral-200 pb-5 mb-6">
                                    <h2 className="text-2xl font-bold text-neutral-900">
                                        {activeSection === 'account' && 'Account Settings'}
                                        {activeSection === 'notifications' && 'Notification Settings'}
                                        {activeSection === 'privacy' && 'Privacy Settings'}
                                        {activeSection === 'security' && 'Security Settings'}
                                    </h2>
                                </div>

                                {activeSection === 'account' && renderAccountSettings()}
                                {activeSection === 'notifications' && renderNotificationSettings()}
                                {activeSection === 'privacy' && renderPrivacySettings()}
                                {activeSection === 'security' && renderSecuritySettings()}
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}