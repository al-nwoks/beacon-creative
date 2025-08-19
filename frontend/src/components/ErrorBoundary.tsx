'use client'

import Button from '@/components/ui/Button'
import type { ReactNode } from 'react'
import { Component } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined })
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
                    <p className="mt-2 text-red-700">{this.state.error?.message}</p>
                    <Button
                        onClick={this.handleReset}
                        className="mt-4"
                        variant="secondary"
                    >
                        Try Again
                    </Button>
                </div>
            )
        }

        return this.props.children
    }
}