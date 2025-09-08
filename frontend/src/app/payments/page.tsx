import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Payment } from '@/types/api'
import { DollarSign } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Payments | B3ACON Creative Connect',
    description: 'View and manage your payments.',
}

export default async function PaymentsPage() {
    let payments: Payment[] = []

    try {
        // Fetch user's payments directly from backend API
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()
        const token = cookieStore.get('access_token')?.value

        if (token) {
            const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000'
            const base = rawBase.replace(/\/+$/, '')
            const apiBase = /\/api\/v\d+$/i.test(base) ? base : `${base}/api/v1`

            const paymentsResp = await fetch(`${apiBase}/payments/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                },
                cache: 'no-store',
            })

            if (paymentsResp.ok) {
                const data = await paymentsResp.json()
                if (Array.isArray(data)) {
                    payments = data as Payment[]
                }
            }
        }
    } catch (err) {
        console.error('Failed to fetch payments', err)
    }

    // Calculate total amount
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0)

    return (
        <ProtectedRoute>
            <SimplifiedLayout showSearch={false}>
                <main className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Payments</h1>
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                            <div className="flex items-center">
                                <DollarSign className="h-8 w-8 text-green-500 mr-2" />
                                <div>
                                    <p className="text-sm text-neutral-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-neutral-900">${totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {payments.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                            <div className="divide-y divide-neutral-200">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h2 className="text-lg font-semibold text-neutral-900">Payment #{payment.id}</h2>
                                                <p className="text-neutral-600">{payment.milestone_description || 'Payment'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-semibold text-neutral-900">${payment.amount?.toFixed(2)}</p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${payment.status === 'released' ? 'bg-green-100 text-green-800' :
                                                    payment.status === 'held_in_escrow' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {payment.status || 'pending'}
                                                </span>
                                            </div>
                                        </div>
                                        {payment.created_at && (
                                            <p className="text-sm text-neutral-500 mt-2">
                                                Created {new Date(payment.created_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-4">No payments yet</h2>
                            <p className="text-neutral-600">Your payments will appear here once you start working on projects.</p>
                        </div>
                    )}
                </main>
            </SimplifiedLayout>
        </ProtectedRoute>
    )
}