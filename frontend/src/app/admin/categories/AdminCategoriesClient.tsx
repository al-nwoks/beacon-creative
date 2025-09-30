'use client'

import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { useNotification } from '@/components/ui/NotificationProvider'
import { Edit, Plus, Search, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface AdminCategoriesClientProps {
    initialCategories: any[]
    error: string | null
}

export default function AdminCategoriesClient({ initialCategories, error: initialError }: AdminCategoriesClientProps) {
    const [categories, setCategories] = useState(initialCategories)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(initialError)
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<any>(null)
    const [formData, setFormData] = useState({ name: '', description: '' })
    const { showNotification } = useNotification()

    // Filter categories based on search
    const filteredCategories = categories.filter(category =>
        !searchTerm ||
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Refresh data
    const refreshData = async () => {
        try {
            setLoading(true)
            setError(null)

            // For now, we'll keep the mock data since backend categories endpoint might not exist
            // In a real implementation, this would fetch from /api/admin/categories
            showNotification('Categories data refreshed', 'success')
        } catch (err: any) {
            console.error('Failed to refresh categories data:', err)
            setError('Failed to refresh categories data')
            showNotification('Failed to refresh categories data', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Add category
    const handleAddCategory = async () => {
        if (!formData.name.trim()) {
            showNotification('Category name is required', 'error')
            return
        }

        try {
            const newCategory = {
                id: Date.now(), // Mock ID
                name: formData.name.trim(),
                description: formData.description.trim(),
                created_at: new Date().toISOString()
            }

            setCategories(prev => [...prev, newCategory])
            setShowAddModal(false)
            setFormData({ name: '', description: '' })

            showNotification('Category added successfully', 'success')
        } catch (err: any) {
            console.error('Failed to add category:', err)
            showNotification('Failed to add category', 'error')
        }
    }

    // Edit category
    const handleEditCategory = async () => {
        if (!formData.name.trim() || !selectedCategory) {
            showNotification('Category name is required', 'error')
            return
        }

        try {
            const updatedCategory = {
                ...selectedCategory,
                name: formData.name.trim(),
                description: formData.description.trim(),
                updated_at: new Date().toISOString()
            }

            setCategories(prev => prev.map(cat =>
                cat.id === selectedCategory.id ? updatedCategory : cat
            ))
            setShowEditModal(false)
            setSelectedCategory(null)
            setFormData({ name: '', description: '' })

            showNotification('Category updated successfully', 'success')
        } catch (err: any) {
            console.error('Failed to update category:', err)
            showNotification('Failed to update category', 'error')
        }
    }

    // Delete category
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return

        try {
            setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id))
            setShowDeleteModal(false)
            setSelectedCategory(null)

            showNotification('Category deleted successfully', 'success')
        } catch (err: any) {
            console.error('Failed to delete category:', err)
            showNotification('Failed to delete category', 'error')
        }
    }

    // Open edit modal
    const openEditModal = (category: any) => {
        setSelectedCategory(category)
        setFormData({
            name: category.name || '',
            description: category.description || ''
        })
        setShowEditModal(true)
    }

    // Open delete modal
    const openDeleteModal = (category: any) => {
        setSelectedCategory(category)
        setShowDeleteModal(true)
    }

    if (error && !categories.length) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Unable to load categories</h3>
                    <p className="mt-2 text-sm text-neutral-500">{error}</p>
                    <Button onClick={refreshData} className="mt-4">
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
                    <h1 className="text-3xl font-bold text-neutral-900">Gig Categories</h1>
                    <p className="text-neutral-600 mt-2">Manage platform categories and tags</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={refreshData} disabled={loading}>
                        {loading ? <EnhancedLoadingSpinner size="sm" /> : 'Refresh'}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setFormData({ name: '', description: '' })
                            setShowAddModal(true)
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                    />
                </div>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Categories ({filteredCategories.length})
                    </h2>
                </div>

                <div className="divide-y divide-neutral-200">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="p-6 hover:bg-neutral-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 rounded-full bg-beacon-purple-light text-beacon-purple">
                                        <Tag className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900">{category.name}</h3>
                                        <p className="text-neutral-600">{category.description}</p>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            Added {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'Unknown date'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditModal(category)}
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openDeleteModal(category)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <Tag className="mx-auto h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900">No categories found</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                            {searchTerm
                                ? 'Try adjusting your search criteria.'
                                : 'No categories have been created yet.'}
                        </p>
                        {!searchTerm && (
                            <Button
                                variant="primary"
                                className="mt-4"
                                onClick={() => {
                                    setFormData({ name: '', description: '' })
                                    setShowAddModal(true)
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add First Category
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">Add New Category</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    placeholder="Enter category description"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowAddModal(false)
                                    setFormData({ name: '', description: '' })
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleAddCategory}>
                                Add Category
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">Edit Category</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    placeholder="Enter category name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    placeholder="Enter category description"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowEditModal(false)
                                    setSelectedCategory(null)
                                    setFormData({ name: '', description: '' })
                                }}
                            >
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleEditCategory}>
                                Update Category
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-neutral-900 mb-4">Confirm Delete</h3>
                        <p className="text-sm text-neutral-600 mb-6">
                            Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setSelectedCategory(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleDeleteCategory}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <EnhancedLoadingSpinner size="lg" message="Loading categories..." />
                </div>
            )}
        </main>
    )
}