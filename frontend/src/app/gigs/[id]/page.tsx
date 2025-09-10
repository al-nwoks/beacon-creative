import type { Metadata } from 'next'
import { GigDetails } from './GigDetails'

export const metadata: Metadata = {
    title: 'Gig Details | B3ACON Creative Connect',
    description: 'View gig details.',
}

export default async function GigPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <GigDetails id={id} />
}