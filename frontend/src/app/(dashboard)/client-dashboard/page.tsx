'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'

export default function ClientDashboardPage() {
    return (
        <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search projects, creatives...">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-6">Client Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">My Projects</h2>
                        <p className="text-neutral-600">View and manage your active projects</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Find Talent</h2>
                        <p className="text-neutral-600">Browse and connect with creative professionals</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Messages</h2>
                        <p className="text-neutral-600">Communicate with your team and creatives</p>
                    </div>
                </div>
            </div>
        </SimplifiedLayout>
    )
}