'use client'

import Button from '@/components/ui/Button'
import { Bell, Filter, Menu, MessageSquare, Search, Users, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
    showSearch?: boolean
    showFilter?: boolean
    showNotifications?: boolean
    onSearch?: (query: string) => void
    onFilter?: () => void
    searchPlaceholder?: string
    userType?: 'creative' | 'client' | 'admin'
    className?: string
}

export default function Header({
    showSearch = false,
    showFilter = false,
    showNotifications = true,
    onSearch,
    onFilter,
    searchPlaceholder = "Search...",
    userType = 'creative',
    className = ""
}: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch && searchQuery.trim()) {
            onSearch(searchQuery.trim())
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    return (
        <header className={`bg-white border-b border-gray-200 px-4 py-3 ${className}`}>
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        B3ACON
                    </Link>
                </div>

                {/* Desktop Search */}
                {showSearch && (
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </form>

                        {showFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                onClick={onFilter}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        )}
                    </div>
                )}

                {/* Right side actions */}
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {showNotifications && (
                            <button className="relative p-2 text-gray-500 hover:text-gray-700">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>
                        )}

                        <Link href="/messages" className="p-2 text-gray-500 hover:text-gray-700">
                            <MessageSquare className="h-5 w-5" />
                        </Link>

                        <Link href="/profile" className="p-2 text-gray-500 hover:text-gray-700">
                            <Users className="h-5 w-5" />
                        </Link>
                    </div>

                    {/* User avatar */}
                    <Link href="/profile" className="hidden md:block">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            U
                        </div>
                    </Link>
                </div>
            </div>

            {/* Mobile Search */}
            {showSearch && (
                <div className="md:hidden mt-3">
                    <form onSubmit={handleSearchSubmit} className="flex space-x-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {showFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onFilter}
                            >
                                <Filter className="h-4 w-4" />
                            </Button>
                        )}
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-col space-y-2">
                        {showNotifications && (
                            <Link
                                href="/notifications"
                                className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Bell className="h-5 w-5 mr-3" />
                                Notifications
                            </Link>
                        )}

                        <Link
                            href="/messages"
                            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <MessageSquare className="h-5 w-5 mr-3" />
                            Messages
                        </Link>

                        <Link
                            href="/profile"
                            className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Users className="h-5 w-5 mr-3" />
                            Profile
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}