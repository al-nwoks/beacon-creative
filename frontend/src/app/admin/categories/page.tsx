import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Gig Categories | B3ACON Admin',
    description: 'Manage gig categories.',
}

export default async function AdminCategoriesPage() {
    // Mock data for categories
    const categories = [
        { id: 1, name: 'Web Development', description: 'Websites, web applications, and web services', created_at: '2023-01-15T10:30:00Z' },
        { id: 2, name: 'Mobile Development', description: 'iOS and Android applications', created_at: '2023-01-15T10:30:00Z' },
        { id: 3, name: 'UI/UX Design', description: 'User interface and user experience design', created_at: '2023-01-15T10:30:00Z' },
        { id: 4, name: 'Graphic Design', description: 'Visual design and branding', created_at: '2023-01-15T10:30:00Z' },
        { id: 5, name: 'Content Writing', description: 'Copywriting, technical writing, and content creation', created_at: '2023-01-15T10:30:00Z' },
        { id: 6, name: 'Video Production', description: 'Video editing, animation, and production', created_at: '2023-01-15T10:30:00Z' },
    ]

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search categories...">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Gig Categories</h1>
                        <Button variant="primary" data-modal-target="add-category-modal" data-modal-toggle="add-category-modal">
                            Add New Category
                        </Button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        <div className="divide-y divide-neutral-200">
                            {categories.map((category) => (
                                <div key={category.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-neutral-900">{category.name}</h2>
                                            <p className="text-neutral-600">{category.description}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-neutral-500">
                                                Added {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'Unknown date'}
                                            </span>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <Button variant="outline" size="sm">
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" className="bg-beacon-purple text-white">
                                1
                            </Button>
                            <Button variant="outline" size="sm">
                                2
                            </Button>
                            <Button variant="outline" size="sm">
                                3
                            </Button>
                            <Button variant="outline" size="sm">
                                Next
                            </Button>
                        </nav>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}