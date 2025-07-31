export function B3aconLogo(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
        >
            <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                    <feOffset dx="0" dy="2" result="offsetblur" />
                    <feFlood floodColor="rgba(0,0,0,0.1)" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g filter="url(#logo-shadow)">
                <path
                    fill="url(#logo-gradient)"
                    d="M50 5L88.97 27.5L88.97 72.5L50 95L11.03 72.5L11.03 27.5L50 5Z"
                />
                <path
                    fill="white"
                    d="M50 15L79.48 32.5L79.48 67.5L50 85L20.52 67.5L20.52 32.5L50 15Z"
                />
                <text
                    x="50"
                    y="62"
                    fontSize="36"
                    fontWeight="800"
                    fill="url(#logo-gradient)"
                    textAnchor="middle"
                    fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    dominantBaseline="middle"
                >
                    B3
                </text>
            </g>
        </svg>
    );
}
