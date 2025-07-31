'use client'

import { cn } from '@/lib/utils'
import { forwardRef, InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string
    label?: string
    helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, helperText, type, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={props.id}
                        className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        className={cn(
                            'flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beacon-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                            error
                                ? 'border-beacon-red focus-visible:ring-beacon-red'
                                : 'border-neutral-300',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error ? (
                    <p className="mt-1 text-sm text-beacon-red">{error}</p>
                ) : helperText ? (
                    <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
                ) : null}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
