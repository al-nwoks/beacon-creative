'use client'

import Button from '@/components/ui/Button'
import React from 'react'

interface ErrorBoundaryProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h2>
                    <p className="text-red-600 mb-4">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => {
                            this.setState({ hasError: false, error: undefined })
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}