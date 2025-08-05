import { PageTransitionLayout } from '@/components/layout/PageTransitionLayout'
import { NotificationProvider } from '@/components/ui/NotificationProvider'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'B3ACON Creative Connect',
  description: 'Connect with top creative talent and clients through a seamless platform for project management, collaboration, and discovery.',
  keywords: ['creative', 'freelance', 'project management', 'collaboration', 'talent'],
  authors: [{ name: 'B3ACON Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <NotificationProvider>
          <PageTransitionLayout>
            {children}
          </PageTransitionLayout>
        </NotificationProvider>
      </body>
    </html>
  )
}
