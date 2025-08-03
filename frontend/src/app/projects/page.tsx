'use client'

import { MainLayout } from '@/components/layout'

export default function ProjectsPage() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-6">Projects</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-neutral-600">Browse and manage projects</p>
                </div>
            </div>
        </MainLayout>
    )
}