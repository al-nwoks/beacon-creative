'use client'

import { cn } from '@/lib/utils'
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: ReactNode
    className?: string
}

export function Dialog({ isOpen, onClose, title, description, children, className }: DialogProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <HeadlessDialog.Panel className={cn(
                                "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                                className
                            )}>
                                <div className="flex justify-between items-center mb-4">
                                    {title && (
                                        <HeadlessDialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-gray-900"
                                        >
                                            {title}
                                        </HeadlessDialog.Title>
                                    )}
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <X className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>

                                {description && (
                                    <HeadlessDialog.Description className="mt-2 text-sm text-gray-500">
                                        {description}
                                    </HeadlessDialog.Description>
                                )}

                                <div className="mt-4">
                                    {children}
                                </div>
                            </HeadlessDialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </HeadlessDialog>
        </Transition>
    )
}