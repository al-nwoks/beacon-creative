'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, forwardRef } from 'react'

// Define button variants using class-variance-authority
const buttonVariants = cva(
    // Base styles applied to all buttons
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    {
        variants: {
            // Button variants (primary, secondary, etc.)
            variant: {
                default: 'bg-beacon-blue text-white hover:bg-beacon-blue-dark',
                primary: 'bg-beacon-blue text-white hover:bg-beacon-blue-dark',
                secondary: 'bg-white text-beacon-blue border border-beacon-blue hover:bg-blue-50',
                purple: 'bg-beacon-purple text-white hover:bg-beacon-purple-dark',
                outline: 'border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700',
                ghost: 'hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900',
                destructive: 'bg-beacon-red text-white hover:bg-red-700',
                link: 'text-beacon-blue underline-offset-4 hover:underline p-0 h-auto',
            },
            // Button sizes
            size: {
                sm: 'h-9 px-3 rounded-md',
                md: 'h-10 py-2 px-4',
                lg: 'h-12 px-8 rounded-md text-base',
                icon: 'h-10 w-10',
            },
            // Full width option
            fullWidth: {
                true: 'w-full',
            },
        },
        // Default variants
        defaultVariants: {
            variant: 'default',
            size: 'md',
            fullWidth: false,
        },
    }
)

// Extend button props with our custom variants
export interface ButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'translate' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationComplete' | 'onAnimationIteration' | 'onDragTransitionEnd' | 'onPan' | 'onPanStart' | 'onPanEnd'>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean
}

// Create the Button component with forwardRef to allow ref passing
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, variant, size, fullWidth, isLoading, ...props }, ref) => {
        return (
            <motion.button
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={isLoading || props.disabled}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {children}
                    </>
                ) : (
                    children
                )}
            </motion.button>
        )
    }
)

// Set display name for debugging
Button.displayName = 'Button'

export default Button
