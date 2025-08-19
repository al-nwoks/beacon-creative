'use client'

import { B3aconLogo } from '@/components/icons/B3aconLogo'
import { NavigationIcon } from '@/components/icons/NavigationIcons'
import { Menu } from '@headlessui/react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
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

export function Header({
    showSearch = false,
    showFilter = false,
    onSearch,
    onFilter,
    searchPlaceholder = 'Search...',
    userType = 'creative'
}: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSearch) {
            onSearch(searchQuery)
        }
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
                                    aria-describedby="search-description"
                                    className="w-full h-10 px-4 pr-10 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple transition-all duration-200"
                                />
                                <span id="search-description" className="sr-only">
                                    Search the website
                                </span>
                                {searchQuery ? (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-neutral-500 hover:text-neutral-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                ) : null}
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-neutral-500 hover:text-beacon-purple"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    ) : null}

                    <div className="flex items-center space-x-4">
                        {showFilter ? (
                            <Menu as="div" className="relative">
                                <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                    <NavigationIcon type="filter" className="h-6 w-6 text-neutral-600" />
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 focus:outline-none z-50">
                                    <div className="px-4 py-2 border-b border-neutral-100">
                                        <span className="text-sm font-semibold text-neutral-900">Filter</span>
                                    </div>
                                    <div className="px-4 py-2">
                                        <button onClick={onFilter} className="w-full text-left text-sm text-neutral-700 px-2 py-2 rounded hover:bg-neutral-50">
                                            Open advanced filters
                                        </button>
                                        <p className="text-xs text-neutral-500 mt-2">Use filters to narrow results by skill, location, or budget.</p>
                                    </div>
                                </Menu.Items>
                            </Menu>
                        ) : null}
                        <Menu as="div" className="relative">
                            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                <NavigationIcon type="messages" className="h-6 w-6 text-neutral-600" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg py-2 focus:outline-none z-50">
                                <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-neutral-900">Messages</span>
                                    <Link href="/messages" className="text-xs text-beacon-purple hover:underline">View all</Link>
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    <Link href="/messages/1" className="block px-4 py-3 hover:bg-neutral-50">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-full bg-neutral-200 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-neutral-900">Sarah Johnson</p>
                                                    <p className="text-xs text-neutral-500">2h</p>
                                                </div>
                                                <p className="text-xs text-neutral-600 truncate">Thanks — I loved your proposal on the project!</p>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link href="/messages/2" className="block px-4 py-3 hover:bg-neutral-50">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-full bg-neutral-200 flex-shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-neutral-900">Michael Chen</p>
                                                    <p className="text-xs text-neutral-500">4h</p>
                                                </div>
                                                <p className="text-xs text-neutral-600 truncate">Can you share previous work samples for e-commerce?</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </Menu.Items>
                        </Menu>
                        <Menu as="div" className="relative">
                            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                <NavigationIcon type="notifications" className="h-6 w-6 text-neutral-600" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-2 focus:outline-none z-50">
                                <div className="px-4 py-2 border-b border-neutral-100 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-neutral-900">Notifications</span>
                                    <Link href="/notifications" className="text-xs text-beacon-purple hover:underline">View all</Link>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    <div className="px-4 py-3 hover:bg-neutral-50">
                                        <p className="text-sm font-medium">Application accepted</p>
                                        <p className="text-xs text-neutral-500">Your application for "Logo Design" was accepted • 2h</p>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-neutral-50">
                                        <p className="text-sm font-medium">New message</p>
                                        <p className="text-xs text-neutral-500">Message from Sarah on "Website Redesign" • 4h</p>
                                    </div>
                                    <div className="px-4 py-3 hover:bg-neutral-50">
                                        <p className="text-sm font-medium">Payment received</p>
                                        <p className="text-xs text-neutral-500">$1,500 released for "Brand Identity" • 1d</p>
                                    </div>
                                </div>
                            </Menu.Items>
                        </Menu>
                        <Menu as="div">
                            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                <NavigationIcon type="profile" className="h-6 w-6 text-neutral-600" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link href="/profile" className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'}
                                        block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Profile
                                        </Link>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                        <Menu as="div">
                            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                <NavigationIcon type="login" className="h-6 w-6 text-neutral-600" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link href="/login" className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'}
                                        block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Login
                                        </Link>
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
