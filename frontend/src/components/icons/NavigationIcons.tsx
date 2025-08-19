import { Bell, LogIn, Mail, Sliders, User } from 'lucide-react'
import React from 'react'

interface NavigationIconProps extends React.SVGProps<SVGSVGElement> {
    type: 'messages' | 'notifications' | 'profile' | 'login' | 'filter'
    className?: string
}

/**
 * NavigationIcon - lightweight wrapper to provide consistent navigation icons.
 * Uses Lucide icons for accessibility and consistency. Props are forwarded.
 */
export function NavigationIcon({ type, className, ...props }: NavigationIconProps) {
    const commonProps = { className: className || 'w-6 h-6', ...props } as any

    switch (type) {
        case 'messages':
            return <Mail {...commonProps} />
        case 'notifications':
            return <Bell {...commonProps} />
        case 'profile':
            return <User {...commonProps} />
        case 'login':
            return <LogIn {...commonProps} />
        case 'filter':
            return <Sliders {...commonProps} />
        default:
            return <User {...commonProps} />
    }
}