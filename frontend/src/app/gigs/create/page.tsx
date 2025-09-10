import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Create Gig | B3ACON Creative Connect',
    description: 'Post a new gig to find talented creatives.',
}

export default function CreateGigPage() {
    return (
        <ProtectedRoute requiredRole="client">
            <SimplifiedLayout userType="client">
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                            <header className="mb-8">
                                <h1 className="text-2xl font-bold text-neutral-900">Create New Gig</h1>
                                <p className="text-neutral-600 mt-1">Post a new gig to find talented creatives.</p>
                            </header>

                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-neutral-900 mb-2">
                                        Gig Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                        placeholder="Enter gig title"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-neutral-900 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={6}
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                        placeholder="Describe your gig in detail..."
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="budget_min" className="block text-sm font-medium text-neutral-900 mb-2">
                                            Minimum Budget ($)
                                        </label>
                                        <input
                                            type="number"
                                            id="budget_min"
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="budget_max" className="block text-sm font-medium text-neutral-900 mb-2">
                                            Maximum Budget ($)
                                        </label>
                                        <input
                                            type="number"
                                            id="budget_max"
                                            className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="timeline_weeks" className="block text-sm font-medium text-neutral-900 mb-2">
                                        Estimated Timeline (weeks)
                                    </label>
                                    <input
                                        type="number"
                                        id="timeline_weeks"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                        placeholder="Number of weeks"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-neutral-900 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="design">Design</option>
                                        <option value="writing">Writing</option>
                                        <option value="photography">Photography</option>
                                        <option value="development">Development</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="video">Video</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="skills" className="block text-sm font-medium text-neutral-900 mb-2">
                                        Required Skills
                                    </label>
                                    <input
                                        type="text"
                                        id="skills"
                                        className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-beacon-purple focus:ring-beacon-purple sm:text-sm"
                                        placeholder="Enter skills separated by commas"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <Button variant="outline">Cancel</Button>
                                    <Button variant="primary">Create Gig</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}