import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Settings | B3ACON Creative Connect',
    description: 'Manage your account settings.',
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Settings</h1>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <nav className="space-y-1">
                                    <a href="#" className="bg-neutral-100 text-neutral-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                        <span className="truncate">Account</span>
                                    </a>
                                    <a href="#" className="text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                        <span className="truncate">Notifications</span>
                                    </a>
                                    <a href="#" className="text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                        <span className="truncate">Privacy</span>
                                    </a>
                                    <a href="#" className="text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                                        <span className="truncate">Security</span>
                                    </a>
                                </nav>
                            </div>

                            <div className="md:col-span-2">
                                <div className="border-b border-neutral-200 pb-5 mb-6">
                                    <h2 className="text-2xl font-bold text-neutral-900">Account Settings</h2>
                                </div>

                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                            defaultValue="user@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                            defaultValue="User Name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="timezone" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Timezone
                                        </label>
                                        <select
                                            id="timezone"
                                            name="timezone"
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                            defaultValue="utc"
                                        >
                                            <option value="utc">UTC</option>
                                            <option value="est">Eastern Time (ET)</option>
                                            <option value="pst">Pacific Time (PT)</option>
                                            <option value="cet">Central European Time (CET)</option>
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
                                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-beacon-purple hover:bg-beacon-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-beacon-purple"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}