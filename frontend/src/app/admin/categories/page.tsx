import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Project Categories | B3ACON Admin',
    description: 'Manage project categories.',
}

export default function AdminCategoriesPage() {
    // Mock data for categories
    const categories = [
        { id: 1, name: 'Design', description: 'Graphic design, UI/UX, branding', projects: 120 },
        { id: 2, name: 'Development', description: 'Web development, mobile apps, software', projects: 95 },
        { id: 3, name: 'Marketing', description: 'Content marketing, SEO, social media', projects: 72 },
        { id: 4, name: 'Video', description: 'Video production, editing, animation', projects: 37 },
        { id: 5, name: 'Writing', description: 'Copywriting, technical writing, blogging', projects: 45 },
        { id: 6, name: 'Other', description: 'Miscellaneous creative services', projects: 23 },
    ]

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search categories...">
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Project Categories</h1>
                        <button className="bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-beacon-purple-dark transition-colors">
                            Add New Category
                        </button>
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
                                        <div className="flex items-center space-x-6">
                                            <span className="text-sm text-neutral-500">
                                                {category.projects} projects
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
                                Next
                            </button>
                        </nav>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}