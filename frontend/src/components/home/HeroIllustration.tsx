'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface HeroIllustrationProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

export function HeroIllustration(props: HeroIllustrationProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 400"
            className={`w-full max-w-2xl mx-auto ${props.className || ''}`}
        >
            <defs>
                <linearGradient id="hero-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
                <linearGradient id="hero-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="hero-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
                <filter id="hero-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                    <feOffset dx="0" dy="4" result="offsetblur" />
                    <feFlood floodColor="rgba(0,0,0,0.1)" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background elements */}
            <rect width="800" height="400" fill="#F5F3FF" />

            {/* Abstract background shapes */}
            <circle cx="100" cy="100" r="80" fill="url(#hero-gradient-1)" opacity="0.1" />
            <circle cx="700" cy="300" r="100" fill="url(#hero-gradient-2)" opacity="0.1" />
            <rect x="300" y="50" width="200" height="200" rx="20" fill="url(#hero-gradient-3)" opacity="0.05" transform="rotate(15 400 150)" />

            {/* Connection lines */}
            <line x1="200" y1="200" x2="300" y2="150" stroke="url(#hero-gradient-1)" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="500" y1="150" x2="600" y2="200" stroke="url(#hero-gradient-2)" strokeWidth="2" strokeDasharray="5,5" />

            {/* Creative person (left) */}
            <motion.g
                filter="url(#hero-shadow)"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <circle cx="200" cy="200" r="40" fill="url(#hero-gradient-1)" />
                <path
                    d="M185 190 Q190 185 200 190 Q210 185 215 190 Q215 200 200 210 Q185 200 185 190"
                    fill="#EDE9FE"
                />
                <rect x="170" y="240" width="60" height="80" rx="10" fill="url(#hero-gradient-3)" />
                <path
                    d="M170 240 L150 220 Q160 210 170 220 L170 240"
                    fill="url(#hero-gradient-1)"
                />
                <path
                    d="M230 240 L250 220 Q240 210 230 220 L230 240"
                    fill="url(#hero-gradient-1)"
                />
            </motion.g>

            {/* Client person (right) */}
            <motion.g
                filter="url(#hero-shadow)"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                <circle cx="600" cy="200" r="40" fill="url(#hero-gradient-2)" />
                <path
                    d="M585 190 Q590 185 600 190 Q610 185 615 190 Q615 200 600 210 Q585 200 585 190"
                    fill="#DBEAFE"
                />
                <rect x="570" y="240" width="60" height="80" rx="10" fill="url(#hero-gradient-1)" />
                <rect x="550" y="260" width="40" height="30" rx="5" fill="url(#hero-gradient-3)" />
                <rect x="610" y="260" width="40" height="30" rx="5" fill="url(#hero-gradient-3)" />
            </motion.g>

            {/* Central connection point */}
            <g filter="url(#hero-shadow)">
                <circle cx="400" cy="150" r="30" fill="url(#hero-gradient-3)" />
                <path
                    d="M385 140 L415 140 L400 170 Z"
                    fill="white"
                />
                <path
                    d="M390 145 L410 145 L400 165 Z"
                    fill="url(#hero-gradient-3)"
                />
            </g>

            {/* Floating elements */}
            <g className="animate-pulse">
                <circle cx="300" cy="100" r="10" fill="url(#hero-gradient-1)" opacity="0.7" />
                <circle cx="500" cy="80" r="15" fill="url(#hero-gradient-2)" opacity="0.7" />
                <circle cx="450" cy="250" r="8" fill="url(#hero-gradient-3)" opacity="0.7" />
            </g>
        </svg>
    );
}