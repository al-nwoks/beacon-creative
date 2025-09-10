import type { Metadata } from 'next'
import MyGigsClientPage from './MyGigsClientPage'

export const metadata: Metadata = {
    title: 'My Gigs | B3ACON Creative Connect',
    description: 'View and manage your gigs.',
}

export default function MyGigsPage() {
    return <MyGigsClientPage />
}