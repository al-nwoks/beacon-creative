import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { User } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Manage Users | B3ACON Admin',
    description: 'View and manage platform users.',
}

export default function AdminUsersPage() {
    // Mock data for users
    const users: User[] = [
        {
            id: 1,
            email: 'client@example.com',
            name: 'John Client',
            role: 'client',
            created_at: '2023-01-15T10:30:00Z',
        },
        {
            id: 2,
            email: 'creative@example.com',
            name: 'Jane Creative',
            role: 'creative',
            created_at: '2023-02-20T14:45:00Z',
        },
        {
            id: 3,
            email: 'admin@example.com',
            name: 'Admin User',
            role: 'admin',
            created_at: '2023-03-10T09:15:00Z',
        },
        {
            id: 4,
            email: 'another.client@example.com',
            name: 'Another Client',
            role: 'client',
            created_at: '2023-04-05T16:20:00Z',
        },
        {
            id: 5,
            email: 'another.creative@example.com',
            name: 'Another Creative',
            role: 'creative',
            created_at: '2023-05-12T11:30:00Z',
        },
    ]

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