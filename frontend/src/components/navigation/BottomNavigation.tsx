'use client'

import { Briefcase, Home, MessageSquare, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
}

interface BottomNavigationProps {
    userType?: 'creative' | 'client' | 'admin'
}

export default function BottomNavigation({ userType = 'creative' }: BottomNavigationProps) {
    const pathname = usePathname()

    const getNavItems = (): NavItem[] => {
        const baseItems: NavItem[] = [
            { name: 'Home', href: userType === 'creative' ? '/creative-dashboard' : '/dashboard', icon: Home },
            { name: 'Jobs', href: '/jobs', icon: Briefcase },
            { name: 'Search', href: '/search', icon: Search },
            { name: 'Messages', href: '/messages', icon: MessageSquare },
            { name: 'Profile', href: '/profile', icon: User },
        ]

        if (userType === 'client') {
            baseItems[1] = { name: 'Projects', href: '/projects', icon: Briefcase }
        } else if (userType === 'admin') {
            baseItems[1] = { name: 'Admin', href: '/admin', icon: Briefcase }
        }

        return baseItems
    }

    const navItems = getNavItems()

    const isActive = (href: string) => {
        if (href === '/creative-dashboard' || href === '/dashboard') {
            return pathname === href
        }
        return pathname?.startsWith(href)
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const active = isActive(item.href)

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex flex-col items-center space-y-1 p-2 min-w-0"
                        >
                            <Icon
                                className={`h-6 w-6 ${active ? 'text-beacon-purple' : 'text-gray-400'
                                    }`}
                            />
                            <span
                                className={`text-xs ${active ? 'text-beacon-purple font-medium' : 'text-gray-400'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}