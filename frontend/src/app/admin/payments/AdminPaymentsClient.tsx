'use client'

import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { useNotification } from '@/components/ui/NotificationProvider'
import { clientFetcher } from '@/lib/api'
import { CheckCircle, Clock, CreditCard, DollarSign, Download, Eye, Search } from 'lucide-react'
import { useState } from 'react'

interface AdminPaymentsClientProps {
    initialPayments: any[]
    initialStats: any
    error: string | null
}

export default function AdminPaymentsClient({ initialPayments, initialStats, error: initialError }: AdminPaymentsClientProps) {
    const [payments, setPayments] = useState(initialPayments)
    const [stats, setStats] = useState(initialStats)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(initialError)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedPayments, setSelectedPayments] = useState<string[]>([])
    const { showNotification } = useNotification()

    // Filter payments based on search and status
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = !searchTerm ||
            payment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.gig?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.creative?.name?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Refresh data
    const refreshData = async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await clientFetcher('/api/admin/payments?limit=50', { method: 'GET' })

            if (Array.isArray(data)) {
                setPayments(data)

                // Recalculate stats
                const newStats = {
                    total_payments: data.length,
                    total_amount: data.reduce((sum, p) => sum + (p.amount || 0), 0),
                    pending_payments: data.filter(p => p.status === 'pending' || p.status === 'processing').length,
                    completed_payments: data.filter(p => p.status === 'completed' || p.status === 'released').length
                }
                setStats(newStats)
            }

            showNotification('Payments data refreshed successfully', 'success')
        } catch (err: any) {
            console.error('Failed to refresh payments data:', err)
            setError('Failed to refresh payments data')
            showNotification('Failed to refresh payments data', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Release payment
    const handleReleasePayment = async (paymentId: string) => {
        try {
            await clientFetcher(`/api/admin/payments/${paymentId}/release`, { method: 'POST' })

            setPayments(prev => prev.map(p =>
                p.id === paymentId
                    ? { ...p, status: 'released', released_at: new Date().toISOString() }
                    : p
            ))

            showNotification('Payment released successfully', 'success')
        } catch (err: any) {
            console.error('Failed to release payment:', err)
            showNotification('Failed to release payment', 'error')
        }
    }

    // Export payments data
    const exportPayments = () => {
        const csvData = filteredPayments.map(payment => ({
            ID: payment.id,
            Amount: payment.amount,
            Status: payment.status,
            'Gig Title': payment.gig?.title || 'N/A',
            'Client Name': payment.client?.name || 'N/A',
            'Creative Name': payment.creative?.name || 'N/A',
            'Created At': payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'N/A',
            'Released At': payment.released_at ? new Date(payment.released_at).toLocaleDateString() : 'N/A'
        }))

        const csvContent = [
            Object.keys(csvData[0] || {}).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        showNotification('Payments data exported successfully', 'success')
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'released':
                return 'bg-green-100 text-green-800'
            case 'pending':
            case 'processing':
                return 'bg-yellow-100 text-yellow-800'
            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-800'
            case 'refunded':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0)
    }

    if (error && !payments.length) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Unable to load payments</h3>
                    <p className="mt-2 text-sm text-neutral-500">{error}</p>
                    <Button onClick={refreshData} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Payment Management</h1>
                    <p className="text-neutral-600 mt-2">Manage platform payments and transactions</p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={exportPayments}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="outline" onClick={refreshData} disabled={loading}>
                        {loading ? <EnhancedLoadingSpinner size="sm" /> : 'Refresh'}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Total Payments</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.total_payments}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Total Amount</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{formatCurrency(stats.total_amount)}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Pending</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.pending_payments}</p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <Clock className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-600">Completed</p>
                            <p className="text-2xl font-bold text-neutral-900 mt-1">{stats.completed_payments}</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search payments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="released">Released</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                <div className="px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Payments ({filteredPayments.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Payment ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Gig
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Client
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Creative
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-neutral-900">
                                            {payment.id?.slice(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-neutral-900">
                                            {formatCurrency(payment.amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-neutral-900">
                                            {payment.gig?.title || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900">
                                            {payment.client?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900">
                                            {payment.creative?.name || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                            {payment.status || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            {(payment.status === 'pending' || payment.status === 'processing') && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleReleasePayment(payment.id)}
                                                    className="text-green-600 hover:text-green-700"
                                                >
                                                    Release
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPayments.length === 0 && (
                    <div className="text-center py-12">
                        <CreditCard className="mx-auto h-12 w-12 text-neutral-400" />
                        <h3 className="mt-4 text-lg font-medium text-neutral-900">No payments found</h3>
                        <p className="mt-2 text-sm text-neutral-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria.'
                                : 'No payments have been processed yet.'}
                        </p>
                    </div>
                )}
            </div>

            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <EnhancedLoadingSpinner size="lg" message="Loading payments..." />
                </div>
            )}
        </main>
    )
}