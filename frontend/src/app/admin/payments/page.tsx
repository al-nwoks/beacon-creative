import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import type { Payment } from '@/types/api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'View Payments | B3ACON Admin',
    description: 'View platform payments.',
}

export default function AdminPaymentsPage() {
    // Mock data for payments
    const payments: Payment[] = [
        {
            id: 1,
            amount: 3000,
            currency: 'USD',
            status: 'released',
            created_at: '2023-06-15T10:30:00Z',
            project_id: 1,
            client_id: 1,
            creative_id: 2,
            milestone_description: 'Website redesign milestone 1',
            released_at: '2023-06-20T14:45:00Z',
        },
        {
            id: 2,
            amount: 5000,
            currency: 'USD',
            status: 'held_in_escrow',
            created_at: '2023-06-20T14:45:00Z',
            project_id: 2,
            client_id: 4,
            creative_id: 5,
            milestone_description: 'Mobile app development milestone 1',
        },
        {
            id: 3,
            amount: 2000,
            currency: 'USD',
            status: 'released',
            created_at: '2023-06-25T09:15:00Z',
            project_id: 3,
            client_id: 1,
            creative_id: 3,
            milestone_description: 'Brand identity package',
            released_at: '2023-06-30T11:20:00Z',
        },
        {
            id: 4,
            amount: 1500,
            currency: 'USD',
            status: 'pending',
            created_at: '2023-07-01T16:20:00Z',
            project_id: 4,
            client_id: 4,
            creative_id: 5,
            milestone_description: 'Content marketing strategy',
        },
    ]

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