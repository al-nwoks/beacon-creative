'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Payment {
    id: string
    projectId: string
    projectName: string
    creativeId: string
    creativeName: string
    amount: number
    status: 'pending' | 'completed' | 'cancelled' | 'released'
    createdAt: string
    updatedAt: string
    releasedAt?: string
    milestoneDescription?: string
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()
    const [filterStatus, setFilterStatus] = useState('all')

    // Mock data for demonstration
    const mockPayments: Payment[] = [
        {
            id: '1',
            projectId: '101',
            projectName: 'Fashion Editorial Photography',
            creativeId: '201',
            creativeName: 'Sarah Johnson',
            amount: 2000,
            status: 'released',
            createdAt: '2023-06-01T10:30:00Z',
            updatedAt: '2023-06-01T10:30:00Z',
            releasedAt: '2023-06-15T14:20:00Z',
            milestoneDescription: 'Completion of fashion editorial shoot'
        },
        {
            id: '2',
            projectId: '102',
            projectName: 'Brand Identity Design',
            creativeId: '202',
            creativeName: 'Michael Chen',
            amount: 3500,
            status: 'pending',
            createdAt: '2023-06-05T09:15:00Z',
            updatedAt: '2023-06-05T09:15:00Z',
            milestoneDescription: 'Initial brand identity concepts'
        },
        {
            id: '3',
            projectId: '103',
            projectName: 'Website Copywriting',
            creativeId: '203',
            creativeName: 'Emma Rodriguez',
            amount: 1200,
            status: 'completed',
            createdAt: '2023-05-20T16:45:00Z',
            updatedAt: '2023-06-10T11:30:00Z',
            releasedAt: '2023-06-10T11:30:00Z',
            milestoneDescription: 'Final website copy delivery'
        },
        {
            id: '4',
            projectId: '104',
            projectName: 'Product Video Animation',
            creativeId: '204',
            creativeName: 'David Kim',
            amount: 2800,
            status: 'cancelled',
            createdAt: '2023-05-15T11:20:00Z',
            updatedAt: '2023-05-25T14:15:00Z',
            milestoneDescription: 'First draft of product animation'
        }
    ]

    // Simulate loading
    setTimeout(() => {
        setPayments(mockPayments)
        setLoading(false)
    }, 500)

    const filteredPayments = payments.filter(payment => {
        return filterStatus === 'all' || payment.status === filterStatus
    })

    const getStatusInfo = (status: Payment['status']) => {
        switch (status) {
            case 'pending':
                return {
                    text: 'Pending',
                    icon: <Clock className="h-4 w-4" />,
                    color: 'text-yellow-600 bg-yellow-100'
                }
            case 'completed':
                return {
                    text: 'Completed',
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: 'text-blue-600 bg-blue-100'
                }
            case 'released':
                return {
                    text: 'Released',
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: 'text-green-600 bg-green-100'
                }
            case 'cancelled':
                return {
                    text: 'Cancelled',
                    icon: <XCircle className="h-4 w-4" />,
                    color: 'text-red-600 bg-red-100'
                }
            default:
                return {
                    text: status,
                    icon: null,
                    color: 'text-gray-600 bg-gray-100'
                }
        }
    }

    const handleReleasePayment = async (paymentId: string) => {
        try {
            // In a real implementation, this would call the API
            // await paymentsAPI.releasePayment(paymentId)

            setPayments(prev =>
                prev.map(payment =>
                    payment.id === paymentId
                        ? { ...payment, status: 'released', releasedAt: new Date().toISOString() }
                        : payment
                )
            )

            showNotification('Payment released successfully!', 'success')
        } catch (err) {
            console.error('Error releasing payment:', err)
            showNotification('Failed to release payment. Please try again.', 'error')
        }
    }

    if (loading) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search payments...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Loading payments..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    if (error) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search payments...">
                <div className="container mx-auto px-4 py-8">
                    <ErrorBoundary>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Payments</h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button variant="primary" onClick={() => {
                                setPayments(mockPayments)
                                setLoading(false)
                            }}>
                                Try Again
                            </Button>
                        </div>
                    </ErrorBoundary>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search payments...">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900">Payments</h1>
                        <p className="text-neutral-600 mt-2">
                            Manage and track your project payments
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                        >
                            <option value="all">All Payments</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="released">Released</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <ErrorBoundary>
                    {filteredPayments.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-neutral-200">
                                    <thead className="bg-neutral-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Project
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Creative
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-neutral-200">
                                        {filteredPayments.map((payment) => {
                                            const statusInfo = getStatusInfo(payment.status)

                                            return (
                                                <tr key={payment.id} className="hover:bg-neutral-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-neutral-900">
                                                            {payment.projectName}
                                                        </div>
                                                        {payment.milestoneDescription && (
                                                            <div className="text-sm text-neutral-500">
                                                                {payment.milestoneDescription}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-neutral-900">
                                                            {payment.creativeName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-neutral-900">
                                                            {formatCurrency(payment.amount)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-neutral-900">
                                                            {formatDate(payment.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                                            {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
                                                            {statusInfo.text}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {payment.status === 'pending' ? (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => handleReleasePayment(payment.id)}
                                                            >
                                                                Release Payment
                                                            </Button>
                                                        ) : payment.status === 'released' ? (
                                                            <span className="text-green-600">Released</span>
                                                        ) : payment.status === 'completed' ? (
                                                            <span className="text-blue-600">Completed</span>
                                                        ) : (
                                                            <span className="text-red-600">Cancelled</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <DollarSign className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                                {filterStatus === 'all' ? 'No Payments Found' : `No ${filterStatus} Payments`}
                            </h3>
                            <p className="text-neutral-600 mb-6">
                                {filterStatus === 'all'
                                    ? 'You don\'t have any payments yet.'
                                    : `You don't have any ${filterStatus} payments.`}
                            </p>
                            <Button variant="primary" onClick={() => setFilterStatus('all')}>
                                View All Payments
                            </Button>
                        </div>
                    )}
                </ErrorBoundary>
            </div>
        </SimplifiedLayout>
    )
}