'use client'

import { NavigationIcon } from '@/components/icons/NavigationIcons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BottomNavigationProps {
    userType: 'creative' | 'client' | 'admin'
}

export function BottomNavigation({ userType }: BottomNavigationProps) {
    const pathname = usePathname()

    // Define navigation items based on user type
    const navItems = userType === 'client'
        ? [
            { name: 'Home', href: '/', icon: 'home' as const },
            { name: 'Gigs', href: '/gigs', icon: 'briefcase' as const },
            { name: 'Messages', href: '/messages', icon: 'messages' as const },
            { name: 'Profile', href: '/profile', icon: 'profile' as const },
        ]
        : userType === 'admin'
            ? [
                { name: 'Home', href: '/', icon: 'home' as const },
                { name: 'Dashboard', href: '/admin', icon: 'dashboard' as const },
                { name: 'Messages', href: '/messages', icon: 'messages' as const },
                { name: 'Profile', href: '/profile', icon: 'profile' as const },
            ]
            : [
                { name: 'Home', href: '/', icon: 'home' as const },
                { name: 'Find Work', href: '/find-work', icon: 'search' as const },
                { name: 'Messages', href: '/messages', icon: 'messages' as const },
                { name: 'Profile', href: '/profile', icon: 'profile' as const },
            ]

    const isActive = (href: string) => {
        return pathname === href
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-50">
            <div className="grid grid-cols-4 gap-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`flex flex-col items-center justify-center py-2 px-1 text-xs ${isActive(item.href)
                                ? 'text-beacon-purple'
                                : 'text-neutral-500 hover:text-neutral-700'
                            }`}
                    >
                        <NavigationIcon type={item.icon} className="h-5 w-5 mb-1" />
                        <span>{item.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}