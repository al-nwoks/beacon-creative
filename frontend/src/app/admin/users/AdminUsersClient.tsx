'use client'

import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import Input from '@/components/ui/Input'
import { useNotification } from '@/components/ui/NotificationProvider'
import { clientFetcher } from '@/lib/api'
import type { User } from '@/types/api'
import { Edit, Search, Shield, ShieldOff, Trash2, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AdminUsersClientProps {
    initialUsers: User[]
    error: string | null
}

export default function AdminUsersClient({ initialUsers, error: initialError }: AdminUsersClientProps) {
    const [users, setUsers] = useState<User[]>(initialUsers)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(initialError)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const { showNotification } = useNotification()

    const itemsPerPage = 10

    // Fetch users with filters
    const fetchUsers = async (page: number = 1, search: string = '', role: string = 'all') => {
        try {
            setLoading(true)
            setError(null)

            const params = new URLSearchParams({
                skip: ((page - 1) * itemsPerPage).toString(),
                limit: itemsPerPage.toString(),
            })

            if (search.trim()) {
                params.append('search', search.trim())
            }

            if (role !== 'all') {
                params.append('role', role)
            }

            const data = await clientFetcher(`/api/admin/users?${params.toString()}`, {
                method: 'GET'
            })

            if (Array.isArray(data)) {
                setUsers(data)
                // Calculate total pages (this would ideally come from the API)
                setTotalPages(Math.max(1, Math.ceil(data.length / itemsPerPage)))
            }
        } catch (err: any) {
            console.error('Failed to fetch users:', err)
            setError('Failed to fetch users. Please try again.')
            showNotification('Failed to fetch users', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Handle search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== '' || roleFilter !== 'all') {
                fetchUsers(1, searchTerm, roleFilter)
                setCurrentPage(1)
            }
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchTerm, roleFilter])

    // Delete user
    const handleDeleteUser = async (userId: string | number) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return
        }

        try {
            await clientFetcher(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            })

            setUsers(prev => prev.filter(user => user.id !== userId))
            showNotification('User deleted successfully', 'success')
        } catch (err: any) {
            console.error('Failed to delete user:', err)
            showNotification('Failed to delete user', 'error')
        }
    }

    // Toggle user active status
    const handleToggleUserStatus = async (user: User) => {
        try {
            const updatedUser = await clientFetcher(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    is_active: !user.is_active
                })
            })

            setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u))
            showNotification(
                `User ${updatedUser.is_active ? 'activated' : 'deactivated'} successfully`,
                'success'
            )
        } catch (err: any) {
            console.error('Failed to update user status:', err)
            showNotification('Failed to update user status', 'error')
        }
    }

    // Handle pagination
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        fetchUsers(page, searchTerm, roleFilter)
    }

    if (error && users.length === 0) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Unable to load users</h3>
                    <p className="mt-2 text-sm text-neutral-500">{error}</p>
                    <Button
                        onClick={() => fetchUsers(currentPage, searchTerm, roleFilter)}
                        className="mt-4"
                    >
                        Try Again
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Manage Users</h1>
                    <p className="text-neutral-600 mt-1">View and manage all platform users</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="h-4 w-4" />
                    Add New User
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                            <Input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-beacon-purple focus:ring-beacon-purple"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admins</option>
                            <option value="creative">Creatives</option>
                            <option value="client">Clients</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <EnhancedLoadingSpinner size="md" message="Loading users..." />
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200">
                        {users.map((user) => (
                            <div key={user.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-neutral-200 border-2 border-dashed rounded-xl w-12 h-12 flex-shrink-0 flex items-center justify-center">
                                            <span className="text-sm font-medium text-neutral-600">
                                                {user.first_name?.charAt(0)}{user.last_name?.charAt(0) || user.name?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-neutral-900">
                                                {user.first_name && user.last_name
                                                    ? `${user.first_name} ${user.last_name}`
                                                    : user.name || 'Unnamed User'
                                                }
                                            </h2>
                                            <p className="text-neutral-600">{user.email}</p>
                                            {user.location && (
                                                <p className="text-sm text-neutral-500">{user.location}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                    user.role === 'creative' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {user.role || 'user'}
                                                </span>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <span className="text-sm text-neutral-500">
                                                Joined {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown date'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingUser(user)}
                                                className="flex items-center gap-1"
                                            >
                                                <Edit className="h-3 w-3" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleToggleUserStatus(user)}
                                                className="flex items-center gap-1"
                                            >
                                                {user.is_active ? (
                                                    <>
                                                        <ShieldOff className="h-3 w-3" />
                                                        Deactivate
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="h-3 w-3" />
                                                        Activate
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {users.length === 0 && !loading && (
                            <div className="p-12 text-center">
                                <div className="mx-auto h-12 w-12 text-neutral-400 mb-4">
                                    <UserPlus className="h-12 w-12" />
                                </div>
                                <h3 className="text-lg font-medium text-neutral-900 mb-2">No users found</h3>
                                <p className="text-neutral-600">
                                    {searchTerm || roleFilter !== 'all'
                                        ? 'No users match your search criteria.'
                                        : 'There are no users in the system yet.'
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <nav className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1
                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </nav>
                </div>
            )}

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onUserCreated={(newUser) => {
                        setUsers(prev => [newUser, ...prev])
                        setShowCreateModal(false)
                        showNotification('User created successfully', 'success')
                    }}
                />
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onUserUpdated={(updatedUser) => {
                        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u))
                        setEditingUser(null)
                        showNotification('User updated successfully', 'success')
                    }}
                />
            )}
        </main>
    )
}

// Create User Modal Component
function CreateUserModal({ onClose, onUserCreated }: {
    onClose: () => void
    onUserCreated: (user: User) => void
}) {
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        role: 'creative',
        password: '',
        confirm_password: ''
    })
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirm_password) {
            showNotification('Passwords do not match', 'error')
            return
        }

        try {
            setLoading(true)
            const newUser = await clientFetcher('/api/admin/users', {
                method: 'POST',
                body: JSON.stringify(formData)
            })
            onUserCreated(newUser)
        } catch (err: any) {
            console.error('Failed to create user:', err)
            showNotification('Failed to create user', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Create New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        required
                    />
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2"
                        required
                    >
                        <option value="creative">Creative</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                    </select>
                    <Input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                        required
                    />
                    <div className="flex space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} fullWidth>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} fullWidth>
                            {loading ? 'Creating...' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onUserUpdated }: {
    user: User
    onClose: () => void
    onUserUpdated: (user: User) => void
}) {
    const [formData, setFormData] = useState({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'creative',
        bio: user.bio || '',
        location: user.location || '',
        is_active: user.is_active ?? true,
        is_verified: user.is_verified ?? false
    })
    const [loading, setLoading] = useState(false)
    const { showNotification } = useNotification()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const updatedUser = await clientFetcher(`/api/admin/users/${user.id}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            })
            onUserUpdated(updatedUser)
        } catch (err: any) {
            console.error('Failed to update user:', err)
            showNotification('Failed to update user', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        required
                    />
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'creative' | 'client' | 'admin' }))}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2"
                        required
                    >
                        <option value="creative">Creative</option>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                    </select>
                    <textarea
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="w-full rounded-md border border-neutral-300 px-3 py-2 h-20 resize-none"
                    />
                    <Input
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300 rounded"
                            />
                            <span className="ml-2 text-sm text-neutral-900">Active</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.is_verified}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                                className="h-4 w-4 text-beacon-purple focus:ring-beacon-purple border-neutral-300 rounded"
                            />
                            <span className="ml-2 text-sm text-neutral-900">Verified</span>
                        </label>
                    </div>
                    <div className="flex space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={onClose} fullWidth>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} fullWidth>
                            {loading ? 'Updating...' : 'Update User'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}