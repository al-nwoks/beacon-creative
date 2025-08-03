'use client'

import BottomNavigation from '@/../../components/shared/BottomNavigation'
import Header from '@/../../components/shared/Header'
import Button from '@/../../components/ui/Button'
import { Bell, CreditCard, Lock, Mail, Palette, Shield, User } from 'lucide-react'
import { useState } from 'react'

interface ProfileSettings {
    firstName: string
    lastName: string
    email: string
    bio: string
    location: string
    website: string
}

interface AccountSettings {
    username: string
    email: string
    phoneNumber: string
    twoFactorAuth: boolean
}

interface NotificationSettings {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    projectUpdates: boolean
    messages: boolean
}

interface PrivacySettings {
    profileVisibility: 'public' | 'private' | 'connections'
    searchVisibility: boolean
    showEmail: boolean
    showLocation: boolean
}

interface SecuritySettings {
    password: string
    confirmPassword: string
}

interface BillingSettings {
    cardNumber: string
    expiryDate: string
    cvv: string
}

interface ThemeSettings {
    theme: 'light' | 'dark' | 'system'
    language: string
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')
    const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        bio: 'Creative professional passionate about design and innovation.',
        location: 'San Francisco, CA',
        website: 'https://johndoe.com'
    })

    const [accountSettings, setAccountSettings] = useState<AccountSettings>({
        username: 'johndoe',
        email: 'john.doe@example.com',
        phoneNumber: '+1 (555) 123-4567',
        twoFactorAuth: true
    })

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        projectUpdates: true,
        messages: true
    })

    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        profileVisibility: 'public',
        searchVisibility: true,
        showEmail: false,
        showLocation: true
    })

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        password: '',
        confirmPassword: ''
    })

    const [billingSettings, setBillingSettings] = useState<BillingSettings>({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    })

    const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
        theme: 'system',
        language: 'en'
    })

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProfileSettings(prev => ({ ...prev, [name]: value }))
    }

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setAccountSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        setNotificationSettings(prev => ({ ...prev, [name]: checked }))
    }

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setPrivacySettings(prev => ({
            ...prev,
            [name]: value as any
        }))
    }

    const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSecuritySettings(prev => ({ ...prev, [name]: value }))
    }

    const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setBillingSettings(prev => ({ ...prev, [name]: value }))
    }

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setThemeSettings(prev => ({ ...prev, [name]: value as any }))
    }

    const handleSaveProfile = () => {
        console.log('Saving profile settings:', profileSettings)
        // Implement save logic
    }

    const handleSaveAccount = () => {
        console.log('Saving account settings:', accountSettings)
        // Implement save logic
    }

    const handleSaveNotifications = () => {
        console.log('Saving notification settings:', notificationSettings)
        // Implement save logic
    }

    const handleSavePrivacy = () => {
        console.log('Saving privacy settings:', privacySettings)
        // Implement save logic
    }

    const handleSaveSecurity = () => {
        console.log('Saving security settings:', securitySettings)
        // Implement save logic
    }

    const handleSaveBilling = () => {
        console.log('Saving billing settings:', billingSettings)
        // Implement save logic
    }

    const handleSaveTheme = () => {
        console.log('Saving theme settings:', themeSettings)
        // Implement save logic
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'account', label: 'Account', icon: Mail },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy', icon: Shield },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'theme', label: 'Theme', icon: Palette },
    ]

    return (
        <div className="min-h-screen bg-neutral-50 pb-20">
            {/* Header */}
            <Header
                showSearch={false}
                searchPlaceholder="Search settings..."
                userType="creative"
            />

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
                    <p className="text-neutral-600">Manage your account preferences and settings</p>
                </div>

                {/* Settings Navigation */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm mb-8">
                    <div className="flex overflow-x-auto py-2 px-4">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-beacon-purple text-beacon-purple'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Profile Settings</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={profileSettings.firstName}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={profileSettings.lastName}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileSettings.email}
                                        onChange={handleProfileChange}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={profileSettings.bio}
                                        onChange={handleProfileChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={profileSettings.location}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Website
                                        </label>
                                        <input
                                            type="url"
                                            id="website"
                                            name="website"
                                            value={profileSettings.website}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" onClick={handleSaveProfile}>
                                        Save Profile Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Account Settings</h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={accountSettings.username}
                                            onChange={handleAccountChange}
                                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="accountEmail" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="accountEmail"
                                            name="email"
                                            value={accountSettings.email}
                                            onChange={handleAccountChange}
                                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={accountSettings.phoneNumber}
                                        onChange={handleAccountChange}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-900">Two-Factor Authentication</h3>
                                        <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="twoFactorAuth"
                                            checked={accountSettings.twoFactorAuth}
                                            onChange={handleAccountChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                    </label>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" onClick={handleSaveAccount}>
                                        Save Account Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Notification Preferences</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-900">Email Notifications</h3>
                                        <p className="text-sm text-neutral-500">Receive notifications via email</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="emailNotifications"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={handleNotificationChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-900">Push Notifications</h3>
                                        <p className="text-sm text-neutral-500">Receive push notifications on your device</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="pushNotifications"
                                            checked={notificationSettings.pushNotifications}
                                            onChange={handleNotificationChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-900">SMS Notifications</h3>
                                        <p className="text-sm text-neutral-500">Receive text messages for important updates</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="smsNotifications"
                                            checked={notificationSettings.smsNotifications}
                                            onChange={handleNotificationChange}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                    </label>
                                </div>

                                <div className="border-t border-neutral-200 pt-6">
                                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Specific Notifications</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900">Marketing Emails</h4>
                                                <p className="text-sm text-neutral-500">Receive promotional emails and updates</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="marketingEmails"
                                                    checked={notificationSettings.marketingEmails}
                                                    onChange={handleNotificationChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900">Project Updates</h4>
                                                <p className="text-sm text-neutral-500">Get notified about project progress</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="projectUpdates"
                                                    checked={notificationSettings.projectUpdates}
                                                    onChange={handleNotificationChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900">Messages</h4>
                                                <p className="text-sm text-neutral-500">Get notified when you receive messages</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="messages"
                                                    checked={notificationSettings.messages}
                                                    onChange={handleNotificationChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" onClick={handleSaveNotifications}>
                                        Save Notification Preferences
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Privacy Settings</h2>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="profileVisibility" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Profile Visibility
                                    </label>
                                    <select
                                        id="profileVisibility"
                                        name="profileVisibility"
                                        value={privacySettings.profileVisibility}
                                        onChange={handlePrivacyChange}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    >
                                        <option value="public">Public</option>
                                        <option value="private">Private</option>
                                        <option value="connections">Connections Only</option>
                                    </select>
                                    <p className="mt-2 text-sm text-neutral-500">
                                        Control who can see your profile information
                                    </p>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-neutral-900">Include in Search Results</h3>
                                        <p className="text-sm text-neutral-500">Allow your profile to appear in search results</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="searchVisibility"
                                            checked={privacySettings.searchVisibility}
                                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, searchVisibility: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                    </label>
                                </div>

                                <div className="border-t border-neutral-200 pt-6">
                                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Personal Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900">Show Email Address</h4>
                                                <p className="text-sm text-neutral-500">Display your email on your profile</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="showEmail"
                                                    checked={privacySettings.showEmail}
                                                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, showEmail: e.target.checked }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900">Show Location</h4>
                                                <p className="text-sm text-neutral-500">Display your location on your profile</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="showLocation"
                                                    checked={privacySettings.showLocation}
                                                    onChange={(e) => setPrivacySettings(prev => ({ ...prev, showLocation: e.target.checked }))}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" onClick={handleSavePrivacy}>
                                        Save Privacy Settings
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Security Settings</h2>
                            <div className="space-y-6">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-red-800 mb-2">Change Password</h3>
                                    <p className="text-sm text-red-700 mb-4">
                                        Ensure your password is strong and unique to protect your account.
                                    </p>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={securitySettings.password}
                                                onChange={handleSecurityChange}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={securitySettings.confirmPassword}
                                                onChange={handleSecurityChange}
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button variant="primary" onClick={handleSaveSecurity}>
                                        Update Password
                                    </Button>
                                </div>

                                <div className="border-t border-neutral-200 pt-6">
                                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Security Actions</h3>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-center">
                                            Review Login Activity
                                        </Button>
                                        <Button variant="outline" className="w-full justify-center">
                                            Enable Two-Factor Authentication
                                        </Button>
                                        <Button variant="outline" className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50">
                                            Deactivate Account
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Billing Settings */}
                    {activeTab === 'billing' && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Billing Information</h2>
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-beacon-purple-light/10 to-beacon-blue-light/10 rounded-xl p-6 border border-beacon-purple-light/30">
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">Current Plan</h3>
                                    <p className="text-neutral-700 mb-4">Professional Plan - $29/month</p>
                                    <div className="flex space-x-3">
                                        <Button variant="primary">Upgrade Plan</Button>
                                        <Button variant="outline">View Invoices</Button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Payment Method</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                name="cardNumber"
                                                value={billingSettings.cardNumber}
                                                onChange={handleBillingChange}
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="expiryDate" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    value={billingSettings.expiryDate}
                                                    onChange={handleBillingChange}
                                                    placeholder="MM/YY"
                                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    id="cvv"
                                                    name="cvv"
                                                    value={billingSettings.cvv}
                                                    onChange={handleBillingChange}
                                                    placeholder="123"
                                                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button variant="primary" onClick={handleSaveBilling}>
                                        Save Billing Information
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Theme Settings */}
                    {activeTab === 'theme' && (
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Theme Preferences</h2>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="theme" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Theme
                                    </label>
                                    <select
                                        id="theme"
                                        name="theme"
                                        value={themeSettings.theme}
                                        onChange={handleThemeChange}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="system">System Default</option>
                                    </select>
                                    <p className="mt-2 text-sm text-neutral-500">
                                        Choose how the application appears to you
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        id="language"
                                        name="language"
                                        value={themeSettings.language}
                                        onChange={handleThemeChange}
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="it">Italian</option>
                                        <option value="pt">Portuguese</option>
                                        <option value="ru">Russian</option>
                                        <option value="zh">Chinese</option>
                                        <option value="ja">Japanese</option>
                                        <option value="ko">Korean</option>
                                    </select>
                                    <p className="mt-2 text-sm text-neutral-500">
                                        Select your preferred language for the interface
                                    </p>
                                </div>

                                <div className="border-t border-neutral-200 pt-6">
                                    <h3 className="text-sm font-medium text-neutral-900 mb-4">Display Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900">Compact Mode</h4>
                                                <p className="text-sm text-neutral-500">Use a more compact layout</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                            </label>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-medium text-neutral-900">Animations</h4>
                                                <p className="text-sm text-neutral-500">Enable UI animations and transitions</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-beacon-purple-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-beacon-purple"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button variant="primary" onClick={handleSaveTheme}>
                                        Save Theme Preferences
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNavigation userType="creative" />
        </div>
    )
}