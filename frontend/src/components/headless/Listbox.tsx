'use client'

import { cn } from '@/lib/utils'
import { Listbox as HeadlessListbox, Transition } from '@headlessui/react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Fragment, ReactNode } from 'react'

interface ListboxProps<T> {
    value: T
    onChange: (value: T) => void
    children: ReactNode
    className?: string
}

interface ListboxButtonProps {
    children: ReactNode
    className?: string
}

interface ListboxOptionsProps {
    children: ReactNode
    className?: string
}

interface ListboxOptionProps<T> {
    value: T
    children: ReactNode
    className?: string
}

const Listbox = <T,>({ value, onChange, children, className }: ListboxProps<T>) => {
    return (
        <HeadlessListbox value={value} onChange={onChange}>
            <div className={cn("relative", className)}>
                {children}
            </div>
        </HeadlessListbox>
    )
}

const ListboxButton = ({ children, className }: ListboxButtonProps) => {
    return (
        <HeadlessListbox.Button className={cn(
            "relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-beacon-purple focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-beacon-purple sm:text-sm",
            className
        )}>
            <span className="block truncate">{children}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                />
            </span>
        </HeadlessListbox.Button>
    )
}

const ListboxOptions = ({ children, className }: ListboxOptionsProps) => {
    return (
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <HeadlessListbox.Options className={cn(
                "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                className
            )}>
                {children}
            </HeadlessListbox.Options>
        </Transition>
    )
}

const ListboxOption = <T,>({ value, children, className }: ListboxOptionProps<T>) => {
    return (
        <HeadlessListbox.Option
            className={({ active }) =>
                cn(
                    'relative cursor-default select-none py-2 pl-10 pr-4',
                    active ? 'bg-beacon-purple-light bg-opacity-20 text-beacon-purple' : 'text-gray-900',
                    className
                )
            }
            value={value}
        >
            {({ selected, active }) => (
                <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {children}
                    </span>
                    {selected ? (
                        <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-beacon-purple' : 'text-beacon-purple'}`}>
                            <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                    ) : null}
                </>
            )}
        </HeadlessListbox.Option>
    )
}

Listbox.Button = ListboxButton
Listbox.Options = ListboxOptions
Listbox.Option = ListboxOption

export { Listbox }
