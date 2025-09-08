import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { User } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Manage Users | B3ACON Admin',
    description: 'View and manage platform users.',
}

export default async function AdminUsersPage() {
    // Fetch real data from the API
    let users: User[] = []

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            const usersResp = await fetch(`${apiBase}/admin/users`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (usersResp.ok) {
                const usersData = await usersResp.json()
                if (Array.isArray(usersData)) {
                    users = usersData as User[]
                }
            }
        }
    } catch (err) {
        console.error('Failed to fetch users', err)
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search users...">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Manage Users</h1>
                        <button className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                            Add New User
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        <div className="divide-y divide-neutral-200">
                            {users.map((user) => (
                                <div key={user.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0" />
                                            <div>
                                                <h2 className="text-lg font-semibold text-neutral-900">{user.name || 'Unnamed User'}</h2>
                                                <p className="text-neutral-600">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {user.role || 'user'}
                                            </span>
                                            <span className="text-sm text-neutral-500">
                                                Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown date'}
                                            </span>
                                            <div className="flex space-x-2">
                                                <button className="text-beacon-purple hover:underline text-sm font-medium">
                                                    Edit
                                                </button>
                                                <button className="text-red-600 hover:underline text-sm font-medium">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 rounded-md bg-beacon-purple text-white text-sm font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                2
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                3
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Next
                            </button>
                        </nav>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}