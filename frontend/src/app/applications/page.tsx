import type { Metadata } from 'next'
import ApplicationsClientPage from './ApplicationsClientPage'

export const metadata: Metadata = {
    title: 'My Applications | B3ACON Creative Connect',
    description: 'View and manage your gig applications.',
}

export default function ApplicationsPage() {
    return <ApplicationsClientPage />
}