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
                            <span className="font-bold text-xl text-neutral-900">B3ACON</span>
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
                            <Menu as="div">
                                <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                    <NavigationIcon type="filter" className="h-6 w-6 text-neutral-600" />
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={onFilter}
                                                className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'}
                                                block w-full text-left px-4 py-2 text-sm`}
                                            >
                                                Filter
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        ) : null}
                        <Menu as="div">
                            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                <NavigationIcon type="messages" className="h-6 w-6 text-neutral-600" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link href="/messages" className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'}
                                        block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Messages
                                        </Link>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                        <Menu as="div">
                            <Menu.Button className="p-2 rounded-full hover:bg-neutral-100">
                                <NavigationIcon type="notifications" className="h-6 w-6 text-neutral-600" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 focus:outline-none">
                                <Menu.Item>
                                    {({ active }) => (
                                        <Link href="/notifications" className={`${active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700'}
                                        block w-full text-left px-4 py-2 text-sm`}
                                        >
                                            Notifications
                                        </Link>
                                    )}
                                </Menu.Item>
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
