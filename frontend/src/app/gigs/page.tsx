import type { Metadata } from 'next'
import GigsClientPage from './GigsClientPage'

export const metadata: Metadata = {
    title: 'Browse Gigs | B3ACON Creative Connect',
    description: 'Find and apply to gigs that match your skills.',
}

export default function GigsPage() {
    return <GigsClientPage />
}