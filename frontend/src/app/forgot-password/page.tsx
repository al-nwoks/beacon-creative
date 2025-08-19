'use client'

import Button from '@/components/ui/Button'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setIsSubmitted(true)
        } catch (err) {
            setError('Failed to send reset instructions. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link href="/" className="text-3xl font-bold text-beacon-purple">
                        B3ACON
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-neutral-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {isSubmitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-green-800 mb-2">Check your email</h3>
                        <p className="text-green-700 mb-4">
                            We've sent password reset instructions to <span className="font-medium">{email}</span>
                        </p>
                        <p className="text-sm text-green-600">
                            Didn't receive the email? Check your spam folder or{' '}
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="font-medium text-green-700 hover:text-green-800 underline"
                            >
                                try again
                            </button>
                        </p>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-neutral-200" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-neutral-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-500 text-neutral-900 rounded-lg focus:outline-none focus:ring-beacon-purple focus:border-beacon-purple focus:z-10 sm:text-sm"
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Reset Instructions'
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                <div className="text-center">
                    <p className="text-sm text-neutral-600">
                        Remember your password?{' '}
                        <Link href="/login" className="font-medium text-beacon-purple hover:text-beacon-purple-dark">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}