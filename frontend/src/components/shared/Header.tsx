'use client'

import { Bell, Filter, Menu, MessageSquare, Search, User, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface HeaderProps {
    showSearch?: boolean
    showFilter?: boolean
    onSearch?: (query: string) => void
    onFilter?: () => void
    searchPlaceholder?: string
    userType?: 'creative' | 'client' | 'admin'
}

export default function Header({
    showSearch = false,
    showFilter = false,
    onSearch,
    onFilter,
    searchPlaceholder = "Search...",
    userType = 'creative'
}: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch) {
            onSearch(searchQuery)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            B3ACON
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
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900">
                            <User className="h-6 w-6" />
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
        </header>
    )
}