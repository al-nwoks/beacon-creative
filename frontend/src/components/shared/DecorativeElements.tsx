import React from 'react';

interface WaveDividerProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    flip?: boolean;
}

export function WaveDivider({ className, flip = false, ...props }: WaveDividerProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className={`w-full ${className || ''}`}
            style={{ transform: flip ? 'scaleY(-1)' : 'none' }}
        >
            <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                fill="url(#wave-gradient)"
            />
            <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                fill="url(#wave-gradient)"
                opacity="0.5"
            />
        </svg>
    );
}

interface BlobBackgroundProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export function BlobBackground({ className, ...props }: BlobBackgroundProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            className={`absolute inset-0 w-full h-full ${className || ''}`}
        >
            <defs>
                <linearGradient id="blob-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="blob-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            <path
                fill="url(#blob-gradient-1)"
                d="M230.1,141.8c-49.6,39.2-99.1,83.1-94.2,137.1c4.7,51.9,54.5,94.2,106.3,98.9c51.9,4.7,106.3-28.3,155.9-67.5
        c49.6-39.2,94.2-83.1,98.9-135C501.7,123.4,452,81.1,399.9,76.4C348,71.7,279.7,102.6,230.1,141.8z"
            />
            <path
                fill="url(#blob-gradient-2)"
                d="M569.9,458.2c49.6-39.2,99.1-83.1,94.2-137.1c-4.7-51.9-54.5-94.2-106.3-98.9c-51.9-4.7-106.3,28.3-155.9,67.5
        c-49.6,39.2-94.2,83.1-98.9,135c-4.7,51.9,44.9,94.2,97.1,98.9C452,528.3,520.3,497.4,569.9,458.2z"
            />
        </svg>
    );
}

interface AbstractShapeProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    variant?: 'circle' | 'triangle' | 'square';
}

export function AbstractShape({ className, variant = 'circle', ...props }: AbstractShapeProps) {
    const renderShape = () => {
        switch (variant) {
            case 'circle':
                return <circle cx="50" cy="50" r="40" />;
            case 'triangle':
                return <polygon points="50,10 90,90 10,90" />;
            case 'square':
                return <rect x="10" y="10" width="80" height="80" />;
            default:
                return <circle cx="50" cy="50" r="40" />;
        }
    };

    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={`w-16 h-16 ${className || ''}`}
        >
            <defs>
                <linearGradient id="shape-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
                </linearGradient>
            </defs>
            {renderShape()}
        </svg>
    );
}