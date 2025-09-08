import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Payment } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'View Payments | B3ACON Admin',
    description: 'View platform payments.',
}

export default async function AdminPaymentsPage() {
    // Fetch real data from the API
    let payments: Payment[] = []

    try {
        // Fetch data directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            const paymentsResp = await fetch(`${apiBase}/admin/payments`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (paymentsResp.ok) {
                const paymentsData = await paymentsResp.json()
                if (Array.isArray(paymentsData)) {
                    payments = paymentsData as Payment[]
                }
            }
        }
    } catch (err) {
        console.error('Failed to fetch payments', err)
    }

    // Calculate total amount
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)
    const releasedAmount = payments
        .filter(payment => payment.status === 'released')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0)
    const pendingAmount = payments
        .filter(payment => payment.status === 'pending' || payment.status === 'held_in_escrow')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0)

    return (
        <ProtectedRoute requiredRole="admin">
            <SimplifiedLayout userType="admin" showSearch={true} searchPlaceholder="Search payments...">
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-8">Platform Payments</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Total Payments</h3>
                            <p className="text-3xl font-bold text-neutral-900">${totalAmount.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Released</h3>
                            <p className="text-3xl font-bold text-green-600">${releasedAmount.toFixed(2)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Pending/Held</h3>
                            <p className="text-3xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                        <div className="divide-y divide-neutral-200">
                            {payments.map((payment) => (
                                <div key={payment.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-neutral-900">Payment #{payment.id}</h2>
                                            <p className="text-neutral-600">{payment.milestone_description || 'Payment'}</p>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-neutral-900">${payment.amount?.toFixed(2)}</p>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${payment.status === 'released' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'held_in_escrow' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {payment.status || 'pending'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="text-beacon-purple hover:underline text-sm font-medium">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-3 text-sm text-neutral-500">
                                        <span className="mr-4">
                                            Created {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'Unknown date'}
                                        </span>
                                        {payment.released_at && (
                                            <span>
                                                Released {new Date(payment.released_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Previous
                            </button>
                            <button className="px-3 py-1 rounded-md bg-beacon-purple text-white text-sm font-medium">
                                1
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                2
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                3
                            </button>
                            <button className="px-3 py-1 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                                Next
                            </button>
                        </nav>
                    </div>
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}