import React from 'react';

interface SkillIconProps extends React.SVGProps<SVGSVGElement> {
    skill: 'design' | 'development' | 'marketing' | 'writing' | 'video' | 'photography' | 'animation' | 'music' | 'other';
    className?: string;
}

export function SkillIcon({ skill, className, ...props }: SkillIconProps) {
    const getIcon = () => {
        switch (skill) {
            case 'design':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M12,3 C16.97,3 21,7.03 21,12 C21,16.97 16.97,21 12,21 C7.03,21 3,16.97 3,12 C3,7.03 7.03,3 12,3 Z M12,19 C15.87,19 19,15.87 19,12 C19,8.13 15.87,5 12,5 C8.13,5 5,8.13 5,12 C5,15.87 8.13,19 12,19 Z"
                            fill="currentColor"
                        />
                        <polygon
                            fill="currentColor"
                            points="12 7 14 12 12 17 10 12"
                        />
                    </g>
                );
            case 'development':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M9.5,3 L7.5,5 L9.5,7 L7.5,9 L9.5,11 L7.5,13 L9.5,15 L7.5,17 L9.5,19 L4.5,19 L4.5,5 L9.5,5 L9.5,3 Z M14.5,3 L14.5,5 L19.5,5 L19.5,19 L14.5,19 L14.5,21 L19.5,21 C20.05,21 20.5,20.55 20.5,20 L20.5,4 C20.5,3.45 20.05,3 19.5,3 L14.5,3 Z"
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
            case 'photography':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="currentColor"
                        />
                        <path
                            d="M9,2 L7,4 L5,4 C3.9,4 3,4.9 3,6 L3,18 C3,19.1 3.9,20 5,20 L19,20 C20.1,20 21,19.1 21,18 L21,6 C21,4.9 20.1,4 19,4 L17,4 L15,2 L9,2 Z M12,17 C8.69,17 6,14.31 6,11 C6,7.69 8.69,5 12,5 C15.31,5 18,7.69 18,11 C18,14.31 15.31,17 12,17 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'animation':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M4,6 L20,6 L20,18 L4,18 L4,6 Z M4,4 L4,20 L20,20 L20,4 L4,4 Z M8,14 L10,14 L10,16 L8,16 L8,14 Z M8,10 L10,10 L10,12 L8,12 L8,10 Z M8,18 L10,18 L10,20 L8,20 L8,18 Z M12,14 L16,14 L16,16 L12,16 L12,14 Z M12,10 L16,10 L16,12 L12,12 L12,10 Z M12,18 L16,18 L16,20 L12,20 L12,18 Z"
                            fill="currentColor"
                        />
                    </g>
                );
            case 'music':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path
                            d="M12,3 L12,12.28 C11.71,12.1 11.37,12 11,12 C9.34,12 8,13.34 8,15 C8,16.66 9.34,18 11,18 C12.66,18 14,16.66 14,15 L14,6 L16,6 L16,15.28 C15.71,15.1 15.37,15 15,15 C13.34,15 12,16.34 12,18 C12,19.66 13.34,21 15,21 C16.66,21 18,19.66 18,18 L18,3 L12,3 Z"
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