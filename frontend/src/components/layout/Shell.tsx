'use client'

import { B3aconLogo } from '@/components/icons/B3aconLogo'
import LoginHeader from '@/components/layout/LoginHeader'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicHeader from '@/components/layout/PublicHeader'
import { Menu } from '@headlessui/react'
import { User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    role: 'creative' | 'client' | 'admin'
}

const HomepageHeader = ({ user }: { user: User | null }) => {
    const handleLogout = async () => {
        try {
            // Make POST request to logout endpoint
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })
            // Redirect to homepage after logout
            window.location.href = '/'
        } catch (error) {
            console.error('Logout failed:', error)
            // Still redirect to homepage even if logout request fails
            window.location.href = '/'
        }
    }

    return (
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-beacon-purple">
                        <B3aconLogo className="h-8 w-auto" />
                    </Link>
                </div>

                {/* Navigation links - always visible */}
                <nav className="hidden md:flex items-center space-x-6" aria-label="Main">
                    <Link href="/creatives" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                        For Creatives
                    </Link>
                    <Link href="/projects" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                        For Clients
                    </Link>
                    <Link href="/how-it-works" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium">
                        How It Works
                    </Link>
                </nav>

                {user ? (
                    // Enhanced view for logged-in users
                    <div className="flex items-center space-x-4">
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                                <div className="h-10 w-10 bg-beacon-purple rounded-full flex items-center justify-center text-white">
                                    <User className="h-6 w-6" />
                                </div>
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none z-50">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href={user.role === 'admin' ? '/admin' : user.role === 'client' ? '/client' : '/creative'}
                                            className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'} block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Dashboard
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/profile"
                                            className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'} block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Profile
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/settings"
                                            className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'} block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Account Settings
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={handleLogout}
                                            className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'} block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                ) : (
                    // Default view for non-logged-in users
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-neutral-700 hover:text-beacon-purple transition-colors font-medium hidden sm:block">
                            Log in
                        </Link>
                        <Link href="/register">
                            <button className="inline-flex items-center justify-center px-3 py-1.5 bg-beacon-purple text-white rounded text-sm">Sign up</button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    )
}

interface ShellProps {
    children: React.ReactNode
}

/**
 * Shell
 *
 * Global application shell that renders the main header, footer, and page content.
 * It watches `document.body` for the `.hide-global-shell` class and hides chrome
 * immediately when internal pages (SimplifiedLayout) request it to avoid double headers.
 *
 * This implementation renders PublicHeader/PublicFooter for public routes and
 * Header/Footer for internal/dashboard routes. It also adds a `data-global-shell`
 * marker so other components (LayoutWrapper) can detect the presence of the shell
 * and avoid rendering duplicate chrome.
 */
export default function Shell({ children }: ShellProps) {
    const [showChrome, setShowChrome] = useState<boolean>(() => {
        if (typeof document === 'undefined') return true
        return !document.body.classList.contains('hide-global-shell')
    })

    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const pathname = usePathname() || ''

    useEffect(() => {
        // If document isn't available, do nothing.
        if (typeof document === 'undefined') return

        const body = document.body
        const obs = new MutationObserver(() => {
            const hasClass = body.classList.contains('hide-global-shell')
            setShowChrome(!hasClass)
        })
        obs.observe(body, { attributes: true, attributeFilter: ['class'] })

        // Ensure initial state is in sync (in case class changed before mount)
        setShowChrome(!body.classList.contains('hide-global-shell'))

        return () => obs.disconnect()
    }, [])

    // Check if user is logged in when on homepage
    useEffect(() => {
        if (pathname === '/') {
            const checkAuthStatus = async () => {
                try {
                    const response = await fetch('/api/users/me', {
                        method: 'GET',
                        credentials: 'include'
                    })
                    if (response.ok) {
                        const userData = await response.json()
                        // Ensure the user data has the required properties
                        if (userData && typeof userData === 'object') {
                            setUser({
                                id: userData.id || '',
                                email: userData.email || '',
                                first_name: userData.first_name || '',
                                last_name: userData.last_name || '',
                                role: userData.role || 'creative'
                            })
                        } else {
                            setUser(null)
                        }
                    } else {
                        setUser(null)
                    }
                } catch (error) {
                    console.error('Failed to check auth status:', error)
                    setUser(null)
                } finally {
                    setLoading(false)
                }
            }

            checkAuthStatus()
        }
    }, [pathname])

    // Auth routes should render a minimal LoginHeader.
    const isAuthRoute = pathname === '/login' || pathname === '/register'

    const isInternalDashboard =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/creative-dashboard') ||
        pathname.startsWith('/client-dashboard') ||
        pathname.startsWith('/admin') ||
        pathname === '/client' ||
        pathname === '/creative'

    // Determine userType for internal dashboard routes
    const getUserType = () => {
        if (pathname === '/client' || pathname.startsWith('/client/')) return 'client'
        if (pathname === '/creative' || pathname.startsWith('/creative/')) return 'creative'
        if (pathname.startsWith('/admin')) return 'admin'
        return 'creative' // default
    }

    // Determine which header to render
    const RenderHeader = showChrome
        ? isAuthRoute
            ? LoginHeader
            : isInternalDashboard
                ? () => <Header userType={getUserType()} />
                : pathname === '/'
                    ? () => <HomepageHeader user={user} />
                    : PublicHeader
        : null

    const RenderFooter = showChrome ? (isInternalDashboard ? Footer : PublicFooter) : null

    return (
        // Add a marker attribute so consumers can detect the presence of the global shell.
        <div data-global-shell className="min-h-screen flex flex-col">
            {RenderHeader ? <RenderHeader /> : null}
            <div className="flex-1">
                {children}
            </div>
            {RenderFooter ? <RenderFooter /> : null}
        </div>
    )
}