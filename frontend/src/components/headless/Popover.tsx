'use client'

import { cn } from '@/lib/utils'
import { Popover as HeadlessPopover, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'

interface PopoverProps {
    children: ReactNode
    className?: string
}

interface PopoverButtonProps {
    children: ReactNode
    className?: string
}

interface PopoverPanelProps {
    children: ReactNode
    className?: string
}

const Popover = ({ children, className }: PopoverProps) => {
    return (
        <HeadlessPopover className={cn("relative", className)}>
            {children}
        </HeadlessPopover>
    )
}

const PopoverButton = ({ children, className }: PopoverButtonProps) => {
    return (
        <HeadlessPopover.Button className={cn(
            "inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900",
            className
        )}>
            {children}
        </HeadlessPopover.Button>
    )
}

const PopoverPanel = ({ children, className }: PopoverPanelProps) => {
    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
        >
            <HeadlessPopover.Panel className={cn(
                "absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-4 sm:px-0",
                className
            )}>
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    {children}
                </div>
            </HeadlessPopover.Panel>
        </Transition>
    )
}

Popover.Button = PopoverButton
Popover.Panel = PopoverPanel

export { Popover }
