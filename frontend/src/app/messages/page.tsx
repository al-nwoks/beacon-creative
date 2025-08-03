'use client'

import { MainLayout } from '@/components/layout'

export default function MessagesPage() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-6">Messages</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-neutral-600">Communicate with your team and creatives</p>
                </div>
            </div>
        </MainLayout>
    )
}