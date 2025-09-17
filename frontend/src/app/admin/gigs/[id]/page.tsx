import type { Metadata } from 'next'
import { AdminGigDetails } from './AdminGigDetails'

export const metadata: Metadata = {
    title: 'Gig Details | B3ACON Admin',
    description: 'View and manage gig details.',
}

export default async function AdminGigPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <AdminGigDetails id={id} />
}