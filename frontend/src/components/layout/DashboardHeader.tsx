'use client'

import { B3aconLogo } from '@/components/icons/B3aconLogo'
import { NavigationIcon } from '@/components/icons/NavigationIcons'
import { MessageDropdown } from '@/components/layout/MessageDropdown'
import { NotificationDropdown } from '@/components/layout/NotificationDropdown'
import { Menu } from '@headlessui/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

interface DashboardHeaderProps {
    userType?: 'creative' | 'client' | 'admin'
    showSearch?: boolean
    searchPlaceholder?: string
}

export function DashboardHeader({
    userType = 'creative',
    showSearch = true,
    searchPlaceholder = 'Search...'
}: DashboardHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Search functionality would be implemented here
        console.log('Search query:', searchQuery)
    }

    return (
        <motion.header
            className="bg-white shadow-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <motion.div
                        className="flex items-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <B3aconLogo className="h-8 w-auto" />
                        </Link>
                    </motion.div>

                    {showSearch ? (
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={searchPlaceholder}
                                    aria-label="Search"
                                    className="w-full h-10 px-4 pr-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple transition-all duration-200"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-neutral-500 hover:text-beacon-purple"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    ) : null}

                    <div className="flex items-center space-x-4">
                        <MessageDropdown />
                        <NotificationDropdown />
                        <Menu as="div" className="relative">
                            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                <NavigationIcon type="profile" className="h-6 w-6 text-neutral-600" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none z-50">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            href={userType === 'admin' ? '/admin/settings' : '/profile'}
                                            className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'} block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            {userType === 'admin' ? 'Admin Settings' : 'Profile'}
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
                                            onClick={async () => {
                                                try {
                                                    // Make POST request to logout endpoint
                                                    await fetch('/api/auth/logout', {
                                                        method: 'POST',
                                                        credentials: 'include'
                                                    });
                                                    // Redirect to homepage after logout
                                                    window.location.href = '/';
                                                } catch (error) {
                                                    console.error('Logout failed:', error);
                                                    // Still redirect to homepage even if logout request fails
                                                    window.location.href = '/';
                                                }
                                            }}
                                            className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'} block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Sign out
                                        </button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
            </div>
        </motion.header>
    )
}