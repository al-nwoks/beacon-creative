import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import { serverFetch } from '@/lib/api'
import type { User } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile | B3ACON Creative Connect',
    description: 'View and edit your profile.',
}

export default async function ProfilePage() {
    let user: User | null = null

    try {
        // Fetch current user info
        user = await serverFetch('/users/me') as User
    } catch (err) {
        console.error('Failed to fetch user info', err)
    }

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Profile</h1>

                    {user ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-24 h-24 flex-shrink-0" />
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900">{user.name || 'Unnamed User'}</h2>
                                    <p className="text-neutral-600">{user.email}</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2">
                                        {user.role || 'user'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-neutral-200 pt-6">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Profile Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                                        <p className="text-neutral-900">{user.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                                        <p className="text-neutral-900">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Member Since</label>
                                        <p className="text-neutral-900">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown date'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">Last Updated</label>
                                        <p className="text-neutral-900">
                                            {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-neutral-200 pt-6 mt-6">
                                <button className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Failed to load profile</h2>
                            <p className="text-neutral-600">There was an error loading your profile information.</p>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}