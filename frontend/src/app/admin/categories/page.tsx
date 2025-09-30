import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Metadata } from 'next'
import AdminCategoriesClient from './AdminCategoriesClient'

export const metadata: Metadata = {
    title: 'Gig Categories | B3ACON Admin',
    description: 'Manage gig categories.',
}

export default async function AdminCategoriesPage() {
    let categories: any[] = []
    let error: string | null = null

    try {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            // Fetch categories data
            const categoriesResp = await fetch(`${apiBase}/admin/categories`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (categoriesResp.ok) {
                const categoriesData = await categoriesResp.json()
                if (Array.isArray(categoriesData)) {
                    categories = categoriesData
                } else {
                    // Fallback to mock data if backend doesn't have categories endpoint
                    categories = [
                        { id: 1, name: 'Web Development', description: 'Websites, web applications, and web services', created_at: '2023-01-15T10:30:00Z' },
                        { id: 2, name: 'Mobile Development', description: 'iOS and Android applications', created_at: '2023-01-15T10:30:00Z' },
                        { id: 3, name: 'UI/UX Design', description: 'User interface and user experience design', created_at: '2023-01-15T10:30:00Z' },
                        { id: 4, name: 'Graphic Design', description: 'Visual design and branding', created_at: '2023-01-15T10:30:00Z' },
                        { id: 5, name: 'Content Writing', description: 'Copywriting, technical writing, and content creation', created_at: '2023-01-15T10:30:00Z' },
                        { id: 6, name: 'Video Production', description: 'Video editing, animation, and production', created_at: '2023-01-15T10:30:00Z' },
                    ]
                }
            } else {
                // Use mock data as fallback
                categories = [
                    { id: 1, name: 'Web Development', description: 'Websites, web applications, and web services', created_at: '2023-01-15T10:30:00Z' },
                    { id: 2, name: 'Mobile Development', description: 'iOS and Android applications', created_at: '2023-01-15T10:30:00Z' },
                    { id: 3, name: 'UI/UX Design', description: 'User interface and user experience design', created_at: '2023-01-15T10:30:00Z' },
                    { id: 4, name: 'Graphic Design', description: 'Visual design and branding', created_at: '2023-01-15T10:30:00Z' },
                    { id: 5, name: 'Content Writing', description: 'Copywriting, technical writing, and content creation', created_at: '2023-01-15T10:30:00Z' },
                    { id: 6, name: 'Video Production', description: 'Video editing, animation, and production', created_at: '2023-01-15T10:30:00Z' },
                ]
            }
        } else {
            error = 'Not authenticated'
        }
    } catch (err) {
        console.error('Failed to fetch categories data', err)
        // Use mock data as fallback
        categories = [
            { id: 1, name: 'Web Development', description: 'Websites, web applications, and web services', created_at: '2023-01-15T10:30:00Z' },
            { id: 2, name: 'Mobile Development', description: 'iOS and Android applications', created_at: '2023-01-15T10:30:00Z' },
            { id: 3, name: 'UI/UX Design', description: 'User interface and user experience design', created_at: '2023-01-15T10:30:00Z' },
            { id: 4, name: 'Graphic Design', description: 'Visual design and branding', created_at: '2023-01-15T10:30:00Z' },
            { id: 5, name: 'Content Writing', description: 'Copywriting, technical writing, and content creation', created_at: '2023-01-15T10:30:00Z' },
            { id: 6, name: 'Video Production', description: 'Video editing, animation, and production', created_at: '2023-01-15T10:30:00Z' },
        ]
    }

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={false}>
                <AdminCategoriesClient
                    initialCategories={categories}
                    error={error}
                />
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}