'use client'

import { B3aconLogo } from '@/components/icons/B3aconLogo'
import { Menu } from '@headlessui/react'
import { Bell, Filter, MessageSquare, Search, User, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useState } from 'react'

interface UnifiedHeaderProps {
    showSearch?: boolean
    showFilter?: boolean
    onSearch?: (query: string) => void
    onFilter?: () => void
    searchPlaceholder?: string
    userType?: 'creative' | 'client' | 'admin'
    children?: ReactNode
    className?: string
}

export function UnifiedHeader({
    showSearch = false,
    showFilter = false,
    onSearch,
    onFilter,
    searchPlaceholder = "Search...",
    userType = 'creative',
    children,
    className = "bg-white border-b border-gray-200 sticky top-0 z-50"
}: UnifiedHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch) {
            onSearch(searchQuery)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/'
        return pathname?.startsWith(path) || false
    }

    return (
        <header className={className}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <B3aconLogo className="h-8 w-auto" />
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    {showSearch && (
                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <form onSubmit={handleSearchSubmit} className="w-full relative">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder={searchPlaceholder}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Filter Button - Desktop */}
                        {showFilter && (
                            <button
                                onClick={onFilter}
                                className="hidden md:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Filter className="h-5 w-5 text-gray-600" />
                                <span className="text-gray-700">Filter</span>
                            </button>
                        )}

                        {/* Notifications */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Messages */}
                        <button className="relative p-2 text-gray-600 hover:text-gray-900">
                            <MessageSquare className="h-6 w-6" />
                        </button>

                        {/* Profile */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900">
                                <User className="h-6 w-6" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none z-50">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/profile"
                                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                        >
                                            Profile
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href="/settings"
                                            className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                        >
                                            Settings
                                        </Link>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                        >
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Filter className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {showSearch && (
                    <div className="md:hidden pb-4">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder={searchPlaceholder}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            />
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-4">
                            {showFilter && (
                                <button
                                    onClick={onFilter}
                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <Filter className="h-5 w-5" />
                                    <span>Filter</span>
                                </button>
                            )}
                            <Link
                                href="/profile"
                                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                            >
                                <User className="h-5 w-5" />
                                <span>Profile</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    <Link
                        href={userType === 'creative' ? '/creative-dashboard' : '/dashboard'}
                        className={`flex flex-col items-center space-y-1 p-2 ${isActive(userType === 'creative' ? '/creative-dashboard' : '/dashboard') ? 'text-beacon-purple' : 'text-gray-400'}`}
                    >
                        <User className="h-6 w-6" />
                        <span className="text-xs">Home</span>
                    </Link>
                    <Link
                        href="/projects"
                        className={`flex flex-col items-center space-y-1 p-2 ${isActive('/projects') ? 'text-beacon-purple' : 'text-gray-400'}`}
                    >
                        <Filter className="h-6 w-6" />
                        <span className="text-xs">Projects</span>
                    </Link>
                    <Link
                        href="/messages"
                        className={`flex flex-col items-center space-y-1 p-2 ${isActive('/messages') ? 'text-beacon-purple' : 'text-gray-400'}`}
                    >
                        <MessageSquare className="h-6 w-6" />
                        <span className="text-xs">Messages</span>
                    </Link>
                    <Link
                        href="/notifications"
                        className={`flex flex-col items-center space-y-1 p-2 ${isActive('/notifications') ? 'text-beacon-purple' : 'text-gray-400'}`}
                    >
                        <Bell className="h-6 w-6" />
                        <span className="text-xs">Notifications</span>
                    </Link>
                </div>
            </nav>
        </header>
    )
}