import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profile | B3ACON Creative Connect',
    description: 'Manage your profile information.',
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <SimplifiedLayout userType="creative" showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile card */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-beacon-purple text-white flex items-center justify-center text-2xl font-bold">
                                    U
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-neutral-900">Your Name</h2>
                                    <p className="text-sm text-neutral-600">Creative • UI/UX Designer</p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <p className="text-sm text-neutral-700">you@example.com</p>
                                <p className="text-sm text-neutral-700">Location: Lagos, NG</p>
                                <p className="text-sm text-neutral-700">Hourly rate: $75/hr</p>
                            </div>

                            <div className="mt-6">
                                <a href="/profile/edit" className="inline-block bg-beacon-purple text-white px-4 py-2 rounded-md hover:bg-purple-700">
                                    Edit Profile
                                </a>
                            </div>
                        </div>

                        {/* Main profile content */}
                        <div className="lg:col-span-2 space-y-6">
                            <section className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-3">About</h3>
                                <p className="text-neutral-600">Your bio, portfolio links, and highlighted work appear here. Use this space to succinctly describe your specialties and experience.</p>
                            </section>

                            <section className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                                <h3 className="text-lg font-semibold text-neutral-900 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-beacon-purple-light/20 text-beacon-purple text-sm">UI/UX Design</span>
                                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-sm">Figma</span>
                                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-sm">Illustration</span>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}