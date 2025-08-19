'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import api, { authAPI, projectsAPI, usersAPI } from '@/lib/api'
import { useState } from 'react'

export default function TestApiPage() {
    const [testResults, setTestResults] = useState<Record<string, { status: string; data?: unknown; error?: string }>>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { showNotification } = useNotification()

    const runTest = async (testName: string, testFn: () => Promise<unknown>) => {
        try {
            setLoading(true)
            const result = await testFn()
            setTestResults(prev => ({
                ...prev,
                [testName]: { status: 'success', data: result }
            }))
            showNotification(`${testName} test completed successfully!`, 'success')
        } catch (err: unknown) {
            console.error(`${testName} error:`, err)
            let errorMessage = 'Unknown error';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setTestResults(prev => ({
                ...prev,
                [testName]: { status: 'error', error: errorMessage }
            }))
            showNotification(`${testName} test failed: ${errorMessage}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    const testApiConnection = async () => {
        const response = await api.get('/health')
        return response.data
    }

    const testAuthLogin = async () => {
        // This is a mock test - in a real scenario, you'd use valid credentials
        try {
            const response = await authAPI.login('test@example.com', 'password123')
            return response
        } catch (error: unknown) {
            // For testing purposes, we'll return a mock success if it's a 401 (which means the endpoint exists)
            if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401) {
                return { message: 'Auth endpoint exists (401 Unauthorized is expected with invalid credentials)' }
            }
            throw error
        }
    }

    const testGetProjects = async () => {
        const response = await projectsAPI.getProjects()
        return response
    }

    const testGetCurrentUser = async () => {
        try {
            const response = await usersAPI.getCurrentUser()
            return response
        } catch (error: unknown) {
            // For testing purposes, we'll return a mock success if it's a 401 (which means the endpoint exists)
            if (error instanceof Error && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401) {
                return { message: 'User endpoint exists (401 Unauthorized is expected without valid token)' }
            }
            throw error
        }
    }

    const tests = [
        { name: 'API Connection', fn: testApiConnection },
        { name: 'Auth Login', fn: testAuthLogin },
        { name: 'Get Projects', fn: testGetProjects },
        { name: 'Get Current User', fn: testGetCurrentUser },
    ]

    return (
        <SimplifiedLayout userType="creative" showSearch={false}>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">API Integration Test</h1>
                        <p className="text-neutral-600 mt-2">
                            Test the connection and functionality of the backend API
                        </p>
                    </div>

                    <ErrorBoundary>
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <h2 className="text-xl font-semibold text-neutral-900">Test Results</h2>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            setTestResults({})
                                            tests.forEach(test => {
                                                runTest(test.name, test.fn)
                                            })
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Running Tests...' : 'Run All Tests'}
                                    </Button>
                                </div>

                                {loading && (
                                    <div className="flex justify-center my-8">
                                        <EnhancedLoadingSpinner size="lg" message="Running tests..." />
                                    </div>
                                )}

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                        <h3 className="text-lg font-medium text-red-800">Error</h3>
                                        <p className="text-red-600">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {tests.map((test) => {
                                        const result = testResults[test.name]
                                        return (
                                            <div
                                                key={test.name}
                                                className="border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-neutral-900">{test.name}</h3>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => runTest(test.name, test.fn)}
                                                        disabled={loading}
                                                    >
                                                        Run Test
                                                    </Button>
                                                </div>

                                                {result && (
                                                    <div className={`mt-3 p-3 rounded-lg ${result.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                                        <div className="flex items-center">
                                                            <div className={`flex-shrink-0 h-5 w-5 ${result.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                                                {result.status === 'success' ? (
                                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className={`text-sm font-medium ${result.status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                                                                    {result.status === 'success' ? 'Success' : 'Failed'}
                                                                </p>
                                                                <p className={`text-sm ${result.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {result.status === 'success'
                                                                        ? typeof result.data === 'object'
                                                                            ? JSON.stringify(result.data, null, 2)
                                                                            : result.data?.toString() || 'Test completed successfully'
                                                                        : result.error}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-8 pt-6 border-t border-neutral-200">
                                    <h3 className="text-lg font-medium text-neutral-900 mb-4">API Configuration</h3>
                                    <div className="bg-neutral-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-neutral-600">API Base URL</p>
                                                <p className="font-mono text-sm text-neutral-900 break-all">
                                                    {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-neutral-600">Current Environment</p>
                                                <p className="font-mono text-sm text-neutral-900">
                                                    {process.env.NODE_ENV}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
        </SimplifiedLayout>
    )
}