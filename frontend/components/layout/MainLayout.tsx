'use client'

import {
    Bell,
    Briefcase,
    ChevronDown,
    FileText,
    HelpCircle,
    LayoutDashboard,
    Menu,
    MessageSquare,
    Search,
    Settings,
    Users,
    X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface MainLayoutProps {
    children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const pathname = usePathname()

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen)
    }

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects', href: '/projects', icon: Briefcase },
        { name: 'Messages', href: '/messages', icon: MessageSquare },
        { name: 'Network', href: '/network', icon: Users },
        { name: 'Documents', href: '/documents', icon: FileText },
    ]

    const bottomNavItems = [
        { name: 'Settings', href: '/settings', icon: Settings },
        { name: 'Help & Support', href: '/help', icon: HelpCircle },
    ]

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`)
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Sidebar - Desktop */}
            <aside
                className={`bg-white border-r border-neutral-200 fixed inset-y-0 z-20 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'
                    } hidden md:flex md:flex-col`}
            >
                <div className="h-16 flex items-center px-4 border-b border-neutral-200">
                    <Link href="/dashboard" className="flex items-center">
                        {isSidebarOpen ? (
                            <span className="text-2xl font-bold text-beacon-blue">B3ACON</span>
                        ) : (
                            <span className="text-2xl font-bold text-beacon-blue">B</span>
                        )}
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-between py-4 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-md transition-colors ${isActive(item.href)
                                        ? 'bg-beacon-blue text-white'
                                        : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </nav>

                    <div className="px-2 space-y-1">
                        {bottomNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-md transition-colors ${isActive(item.href)
                                        ? 'bg-beacon-blue text-white'
                                        : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </div>
                </div>

                <button
                    onClick={toggleSidebar}
                    className="h-10 w-10 flex items-center justify-center text-neutral-500 hover:text-neutral-700 absolute right-0 top-20 bg-white border border-neutral-200 rounded-full -mr-5"
                >
                    <ChevronDown
                        className={`h-5 w-5 transform transition-transform ${isSidebarOpen ? 'rotate-90' : '-rotate-90'
                            }`}
                    />
                </button>
            </aside>

            {/* Sidebar - Mobile */}
            <div
                className={`fixed inset-0 bg-neutral-900 bg-opacity-50 z-30 transition-opacity md:hidden ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleMobileSidebar}
            ></div>

            <aside
                className={`bg-white fixed inset-y-0 left-0 z-40 w-64 transition-transform transform md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
                    <Link href="/dashboard" className="flex items-center">
                        <span className="text-2xl font-bold text-beacon-blue">B3ACON</span>
                    </Link>
                    <button
                        onClick={toggleMobileSidebar}
                        className="text-neutral-500 hover:text-neutral-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-between py-4 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-md transition-colors ${isActive(item.href)
                                        ? 'bg-beacon-blue text-white'
                                        : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                onClick={toggleMobileSidebar}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="px-2 space-y-1">
                        {bottomNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-md transition-colors ${isActive(item.href)
                                        ? 'bg-beacon-blue text-white'
                                        : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                onClick={toggleMobileSidebar}
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
                    }`}
            >
                {/* Header */}
                <header className="bg-white border-b border-neutral-200 h-16 flex items-center justify-between px-4 sticky top-0 z-10">
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMobileSidebar}
                            className="text-neutral-500 hover:text-neutral-700"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-end space-x-4">
                        <div className="relative">
                            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-blue focus:border-transparent"
                            />
                        </div>

                        <button className="relative p-2 text-neutral-500 hover:text-neutral-700">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-beacon-red rounded-full"></span>
                        </button>

                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-beacon-blue text-white flex items-center justify-center font-medium">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    )
}
