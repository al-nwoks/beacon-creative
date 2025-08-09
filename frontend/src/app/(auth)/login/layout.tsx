import type { Metadata } from 'next'
import { metadata as loginMetadata } from './metadata'

export const metadata: Metadata = loginMetadata

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}