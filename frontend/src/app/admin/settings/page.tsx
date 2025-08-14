import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Platform Settings | B3ACON Admin',
    description: 'Manage platform settings and configurations.',
}

export default function AdminSettingsPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Platform Settings</h1>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 max-w-3xl mx-auto">
                        <div className="border-b border-neutral-200 pb-5 mb-6">
                            <h2 className="text-2xl font-bold text-neutral-900">General Settings</h2>
                        </div>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="platform-name" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Platform Name
                                </label>
                                <input
                                    type="text"
                                    name="platform-name"
                                    id="platform-name"
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    defaultValue="B3ACON Creative Connect"
                                />
                            </div>

                            <div>
                                <label htmlFor="platform-email" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Platform Email
                                </label>
                                <input
                                    type="email"
                                    name="platform-email"
                                    id="platform-email"
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    defaultValue="support@b3acon.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="support-email" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Support Email
                                </label>
                                <input
                                    type="email"
                                    name="support-email"
                                    id="support-email"
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    defaultValue="support@b3acon.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="maintenance-mode" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Maintenance Mode
                                </label>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="maintenance-mode"
                                        id="maintenance-mode"
                                        className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300 rounded"
                                    />
                                    <label htmlFor="maintenance-mode" className="ml-2 block text-sm text-neutral-900">
                                        Enable maintenance mode
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="maintenance-message" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Maintenance Message
                                </label>
                                <textarea
                                    id="maintenance-message"
                                    name="maintenance-message"
                                    rows={3}
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    placeholder="Platform is currently under maintenance. We'll be back soon!"
                                ></textarea>
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
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}