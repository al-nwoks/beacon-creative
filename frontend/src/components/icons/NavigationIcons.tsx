import React from 'react';

interface NavigationIconProps extends React.SVGProps<SVGSVGElement> {
    type: 'messages' | 'notifications' | 'profile' | 'login' | 'filter';
    className?: string;
}

export function NavigationIcon({ type, className, ...props }: NavigationIconProps) {
    const getIcon = () => {
        switch (type) {
            case 'messages':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M20,2 L4,2 C2.9,2 2,2.9 2,4 L2,22 L6,18 L20,18 C21.1,18 22,17.1 22,16 L22,4 C22,2.9 21.1,2 20,2 Z M20,16 L5.67,16 L4,17.67 L4,4 L20,4 L20,16 Z M7,9 L10,12 L17,5 L17,8 L20,8 L20,5 C20,3.9 19.1,3 18,3 L15,3 L15,6 L12,6 L12,3 L9,3 L9,7 L7,7 L7,9 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'notifications':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M12,22 C13.1,22 14,21.1 14,20 L10,20 C10,21.1 10.9,22 12,22 Z M18,16 L18,11 C18,7.93 16.37,5.36 13.5,4.68 L13.5,4 C13.5,3.45 13.05,3 12.5,3 L11.5,3 C10.95,3 10.5,3.45 10.5,4 L10.5,4.68 C7.64,5.36 6,7.92 6,11 L6,16 L4,18 L4,19 L20,19 L20,18 L18,16 Z M16,17 L8,17 L8,11 C8,8.24 9.79,5.89 12.5,5.54 L12.5,5.5 C12.78,5.5 13,5.28 13,5 L13,4 L11,4 L11,5 L11.5,5 L11.5,5.07 C14.53,5.56 17,8.11 17,11 L17,17 L16,17 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'profile':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M12,12 C14.21,12 16,10.21 16,8 C16,5.79 14.21,4 12,4 C9.79,4 8,5.79 8,8 C8,10.21 9.79,12 12,12 Z M12,14 C9.33,14 4,15.34 4,18 L4,20 L20,20 L20,18 C20,15.34 14.67,14 12,14 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'login':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M11,7 L9.6,8.4 L12.2,11 L2,11 L2,13 L12.2,13 L9.6,15.6 L11,17 L16,12 L11,7 Z M20,19 L14,19 L14,21 L20,21 C21.1,21 22,20.1 22,19 L22,5 C22,3.9 21.1,3 20,3 L14,3 L14,5 L20,5 L20,19 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'filter':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M10,18 L14,18 L14,16 L10,16 L10,18 Z M3,6 L3,8 L21,8 L21,6 L3,6 Z M6,13 L18,13 L18,11 L6,11 L6,13 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            default:
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M12,2 C6.48,2 2,6.48 2,12 C2,17.52 6.48,22 12,22 C17.52,22 22,17.52 22,12 C22,6.48 17.52,2 12,2 Z M13,17 L11,17 L11,15 L13,15 L13,17 Z M13,13 L11,13 L11,7 L13,7 L13,13 Z"
                            fill="currentColor"
                        />
                    </g>
                );
        }
    };

    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={`w-6 h-6 ${className || ''}`}
        >
            {getIcon()}
        </svg>
    );
}