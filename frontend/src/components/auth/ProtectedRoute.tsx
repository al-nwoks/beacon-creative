'use client'

import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { clientFetcher } from '@/lib/api'
import type { User } from '@/types/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: 'creative' | 'client' | 'admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check if user is authenticated
                const userData = await clientFetcher('/api/auth/me', { method: 'GET' })

                if (!userData) {
                    // Not authenticated, redirect to login
                    router.push('/login')
                    return
                }

                setUser(userData)

                // Check role-based access if required
                if (requiredRole && userData.role !== requiredRole) {
                    setError(`Access denied. ${requiredRole} role required.`)
                    // Redirect based on user role
                    switch (userData.role) {
                        case 'admin':
                            router.push('/admin')
                            break
                        case 'creative':
                            router.push('/creative')
                            break
                        case 'client':
                            router.push('/client')
                            break
                        default:
                            router.push('/')
                    }
                    return
                }

            } catch (error) {
                console.error('Authentication check failed:', error)
                // Redirect to login on auth failure
                router.push('/login')
                return
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [requiredRole, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <EnhancedLoadingSpinner size="lg" message="Checking authentication..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-2">Access Denied</h3>
                    <p className="text-neutral-600">{error}</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}