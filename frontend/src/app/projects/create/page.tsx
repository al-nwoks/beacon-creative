import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Project | B3ACON Creative Connect',
    description: 'Post a new project to find talented creatives.',
}

export default function CreateProjectPage() {
    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Create New Project</h1>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 max-w-3xl mx-auto">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    placeholder="Enter project title"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Project Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    placeholder="Describe your project in detail..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="design">Design</option>
                                        <option value="development">Development</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="video">Video</option>
                                        <option value="writing">Writing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Required Skills
                                    </label>
                                    <input
                                        type="text"
                                        name="skills"
                                        id="skills"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                        placeholder="e.g., React, UI/UX, SEO"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="budget_min" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Minimum Budget ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="budget_min"
                                        id="budget_min"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                        placeholder="Enter minimum budget"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="budget_max" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Maximum Budget ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="budget_max"
                                        id="budget_max"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                        placeholder="Enter maximum budget"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="timeline_weeks" className="block text-sm font-medium text-neutral-700 mb-1">
                                    Project Timeline (weeks)
                                </label>
                                <input
                                    type="number"
                                    name="timeline_weeks"
                                    id="timeline_weeks"
                                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    placeholder="Enter estimated timeline in weeks"
                                />
                            </div>

                            <div className="flex justify-end space-x-4 pt-6">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit">
                                    Post Project
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}