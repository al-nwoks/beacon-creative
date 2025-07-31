import React from 'react';

interface AnimatedIconProps extends React.SVGProps<SVGSVGElement> {
    type: 'loading' | 'success' | 'error' | 'progress';
    className?: string;
    progress?: number; // For progress indicator (0-100)
}

export function AnimatedIcon({ type, className, progress = 0, ...props }: AnimatedIconProps) {
    const getIcon = () => {
        switch (type) {
            case 'loading':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="60"
                            strokeDashoffset="15"
                        >
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 12 12"
                                to="360 12 12"
                                dur="1s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </g>
                );
            case 'success':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                        >
                            <animate
                                attributeName="stroke-dasharray"
                                values="0,100; 63,100; 63,100"
                                dur="0.5s"
                                fill="freeze"
                            />
                        </circle>
                        <polyline
                            points="7,12 10,15 17,8"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                        >
                            <animate
                                attributeName="stroke-dasharray"
                                values="0,20; 20,20; 20,20"
                                dur="0.3s"
                                begin="0.5s"
                                fill="freeze"
                            />
                        </polyline>
                    </g>
                );
            case 'error':
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                        >
                            <animate
                                attributeName="stroke-dasharray"
                                values="0,100; 63,100; 63,100"
                                dur="0.5s"
                                fill="freeze"
                            />
                        </circle>
                        <line
                            x1="8"
                            y1="8"
                            x2="16"
                            y2="16"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <animate
                                attributeName="stroke-dasharray"
                                values="0,20; 20,20; 20,20"
                                dur="0.3s"
                                begin="0.5s"
                                fill="freeze"
                            />
                        </line>
                        <line
                            x1="16"
                            y1="8"
                            x2="8"
                            y2="16"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <animate
                                attributeName="stroke-dasharray"
                                values="0,20; 20,20; 20,20"
                                dur="0.3s"
                                begin="0.5s"
                                fill="freeze"
                            />
                        </line>
                    </g>
                );
            case 'progress':
                const circumference = 2 * Math.PI * 10;
                const strokeDashoffset = circumference - (progress / 100) * circumference;

                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#E5E7EB"
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 12 12)"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                values={`${circumference};${strokeDashoffset}`}
                                dur="0.5s"
                                fill="freeze"
                            />
                        </circle>
                        <text
                            x="12"
                            y="16"
                            textAnchor="middle"
                            fill="currentColor"
                            fontSize="8"
                            fontWeight="bold"
                        >
                            {progress}%
                        </text>
                    </g>
                );
            default:
                return (
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
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