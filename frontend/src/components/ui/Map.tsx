'use client'

import { useEffect, useRef } from 'react'

interface MapProps {
    center: {
        lat: number
        lng: number
    }
    zoom: number
    markerText: string
}

export default function Map({ center, zoom, markerText }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (typeof window !== 'undefined' && mapRef.current) {
            // Map initialization will be handled by the actual implementation
            console.log(`Map would render at ${center.lat},${center.lng}`)
        }
    }, [center, zoom])

    return (
        <div
            ref={mapRef}
            className="w-full h-full bg-neutral-100 flex items-center justify-center"
        >
            <div className="text-center">
                <p className="text-neutral-700">Map would display here</p>
                <p className="text-sm text-neutral-500">{markerText}</p>
            </div>
        </div>
    )
}