'use client'

import { cn } from '@/lib/utils'
import { Menu as HeadlessMenu, Transition } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { Fragment, ReactNode } from 'react'

interface MenuProps {
    children: ReactNode
    className?: string
}

interface MenuButtonProps {
    children: ReactNode
    className?: string
}

interface MenuItemsProps {
    children: ReactNode
    className?: string
}

interface MenuItemProps {
    children: ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
}

const Menu = ({ children, className }: MenuProps) => {
    return (
        <HeadlessMenu as="div" className={cn("relative inline-block text-left", className)}>
            {children}
        </HeadlessMenu>
    )
}

const MenuButton = ({ children, className }: MenuButtonProps) => {
    return (
        <HeadlessMenu.Button className={cn(
            "inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
            className
        )}>
            {children}
            <ChevronDown className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </HeadlessMenu.Button>
    )
}

const MenuItems = ({ children, className }: MenuItemsProps) => {
    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
            <HeadlessMenu.Items className={cn(
                "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                className
            )}>
                <div className="py-1">
                    {children}
                </div>
            </HeadlessMenu.Items>
        </Transition>
    )
}

const MenuItem = ({ children, onClick, className, disabled }: MenuItemProps) => {
    return (
        <HeadlessMenu.Item disabled={disabled}>
            {({ active }) => (
                <button
                    onClick={onClick}
                    className={cn(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block w-full text-left px-4 py-2 text-sm',
                        disabled && 'opacity-50 cursor-not-allowed',
                        className
                    )}
                >
                    {children}
                </button>
            )}
        </HeadlessMenu.Item>
    )
}

Menu.Button = MenuButton
Menu.Items = MenuItems
Menu.Item = MenuItem

export { Menu }
