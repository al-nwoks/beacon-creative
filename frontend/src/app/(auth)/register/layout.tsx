import type { Metadata } from 'next'
import { metadata as registerMetadata } from './metadata'

export const metadata: Metadata = registerMetadata

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}