import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Platform Settings | B3ACON Admin',
    description: 'Manage platform-wide settings.',
}

export default async function AdminSettingsPage() {
    // Fetch real data from the API
    let platformSettings = {
        platform_name: 'B3ACON Creative Connect',
        support_email: 'support@beacon-connect.com',
        maintenance_mode: false,
        max_file_upload_size: 50, // in MB
        allowed_file_types: ['.jpg', '.png', '.pdf', '.doc', '.docx'],
    }

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            // TODO: Fetch platform settings from API
            // For now, we'll use mock data
        }
    } catch (err) {
        console.error('Failed to fetch settings', err)
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Platform Settings</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Settings Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h2 className="text-xl font-semibold text-neutral-900 mb-6">General Settings</h2>

                                <form className="space-y-6">
                                    <div>
                                        <label htmlFor="platform_name" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Platform Name
                                        </label>
                                        <Input
                                            type="text"
                                            id="platform_name"
                                            name="platform_name"
                                            defaultValue={platformSettings.platform_name}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="support_email" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Support Email
                                        </label>
                                        <Input
                                            type="email"
                                            id="support_email"
                                            name="support_email"
                                            defaultValue={platformSettings.support_email}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="max_file_upload_size" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Max File Upload Size (MB)
                                        </label>
                                        <Input
                                            type="number"
                                            id="max_file_upload_size"
                                            name="max_file_upload_size"
                                            defaultValue={platformSettings.max_file_upload_size}
                                            className="w-full"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                                            Maintenance Mode
                                        </label>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="maintenance_mode"
                                                name="maintenance_mode"
                                                defaultChecked={platformSettings.maintenance_mode}
                                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300 rounded"
                                            />
                                            <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-neutral-900">
                                                Enable maintenance mode
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="allowed_file_types" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Allowed File Types
                                        </label>
                                        <Input
                                            type="text"
                                            id="allowed_file_types"
                                            name="allowed_file_types"
                                            defaultValue={platformSettings.allowed_file_types.join(', ')}
                                            className="w-full"
                                        />
                                        <p className="mt-1 text-sm text-neutral-500">Comma-separated list of allowed file extensions</p>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-4">
                                        <Button variant="outline" type="button">
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit">
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Button variant="outline" fullWidth className="justify-start">
                                        <span className="text-sm font-medium">Clear Cache</span>
                                    </Button>
                                    <Button variant="outline" fullWidth className="justify-start">
                                        <span className="text-sm font-medium">Backup Database</span>
                                    </Button>
                                    <Button variant="outline" fullWidth className="justify-start">
                                        <span className="text-sm font-medium">Reset Statistics</span>
                                    </Button>
                                </div>
                            </div>

                            {/* System Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">System Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-neutral-600">Version</span>
                                        <span className="text-sm font-medium text-neutral-900">1.0.0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-neutral-600">Last Backup</span>
                                        <span className="text-sm font-medium text-neutral-900">2023-07-15</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-neutral-600">Storage Used</span>
                                        <span className="text-sm font-medium text-neutral-900">2.4 GB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}