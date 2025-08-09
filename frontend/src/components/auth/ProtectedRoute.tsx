'use client'

import { useNotification } from '@/components/ui/NotificationProvider'
import { usersAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: 'creative' | 'client' | 'admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const router = useRouter()
    const { showNotification } = useNotification()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Get current user (this will automatically check HttpOnly cookies via our API proxy)
                const user = await usersAPI.getCurrentUser()

                // Check role if required
                if (requiredRole && user.role !== requiredRole) {
                    // Redirect based on user role
                    switch (user.role) {
                        case 'creative':
                            router.push('/creative-dashboard')
                            break
                        case 'client':
                            router.push('/dashboard')
                            break
                        case 'admin':
                            router.push('/admin')
                            break
                        default:
                            router.push('/')
                    }
                    return
                }

                setIsAuthorized(true)
            } catch (error) {
                console.error('Authentication check failed:', error)
                // Redirect to login with a return URL, but avoid redirecting if we're already
                // on the login/post-login flow to prevent redirect loops.
                const currentPath = window.location.pathname + window.location.search
                if (!currentPath.startsWith('/login') && !currentPath.startsWith('/post-login')) {
                    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
                }
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [requiredRole, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beacon-purple mx-auto"></div>
                    <p className="mt-4 text-neutral-600">Verifying your authentication...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
}