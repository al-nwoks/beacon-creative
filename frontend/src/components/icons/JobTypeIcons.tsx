import React from 'react';

interface JobTypeIconProps extends React.SVGProps<SVGSVGElement> {
    type: 'design' | 'development' | 'marketing' | 'writing' | 'video' | 'other';
    className?: string;
}

export function JobTypeIcon({ type, className, ...props }: JobTypeIconProps) {
    const getIcon = () => {
        switch (type) {
            case 'design':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M12,2 C13.1045695,2 14,2.8954305 14,4 C14,5.1045695 13.1045695,6 12,6 C10.8954305,6 10,5.1045695 10,4 C10,2.8954305 10.8954305,2 12,2 Z M21,9 L19.5,7.5 L18,9 L16.5,7.5 L15,9 L13.5,7.5 L12,9 L10.5,7.5 L9,9 L7.5,7.5 L6,9 L4.5,7.5 L3,9 L3,21 L21,21 L21,9 Z M19,19 L5,19 L5,10.5 L6.5,12 L8,10.5 L9.5,12 L11,10.5 L12.5,12 L14,10.5 L15.5,12 L17,10.5 L18.5,12 L20,10.5 L20,19 L19,19 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'development':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M2.5,10 L2.5,14 L21.5,14 L21.5,10 L2.5,10 Z M2.5,16 L2.5,20 L21.5,20 L21.5,16 L2.5,16 Z M2.5,4 L2.5,8 L21.5,8 L21.5,4 L2.5,4 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'marketing':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M20,4 L4,4 C2.9,4 2,4.9 2,6 L2,18 C2,19.1 2.9,20 4,20 L20,20 C21.1,20 22,19.1 22,18 L22,6 C22,4.9 21.1,4 20,4 Z M20,18 L4,18 L4,8 L20,8 L20,18 Z M18,10 L16,10 L16,16 L18,16 L18,10 Z M14,10 L12,10 L12,16 L14,16 L14,10 Z M10,10 L8,10 L8,16 L10,16 L10,10 Z M6,10 L6,16 L8,16 L8,10 L6,10 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'writing':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M19,3 L5,3 C3.9,3 3,3.9 3,5 L3,19 C3,20.1 3.9,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,5 C21,3.9 20.1,3 19,3 Z M19,19 L5,19 L5,5 L19,5 L19,19 Z M17,12 L17,8 L15,8 L15,12 L12,12 L8,16 L12,16 L12,20 L14,20 L14,16 L17,16 L21,12 L17,12 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'video':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M18,4 L6,4 C4.9,4 4,4.9 4,6 L4,18 C4,19.1 4.9,20 6,20 L18,20 C19.1,20 20,19.1 20,18 L20,6 C20,4.9 19.1,4 18,4 Z M18,18 L6,18 L6,6 L18,6 L18,18 Z M8,14 L12,11.5 L8,9 L8,14 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'other':
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
            className={`w-5 h-5 ${className || ''}`}
        >
            {getIcon()}
        </svg>
    );
}