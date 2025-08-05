'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useNotification } from '@/components/ui/NotificationProvider'
import { authAPI, usersAPI } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Define the form validation schema using Zod
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginSchema>

import { Switch } from '@headlessui/react'
export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { showNotification } = useNotification()
    const router = useRouter()

    // Initialize react-hook-form with zod validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    // Handle form submission
    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true)

        try {
            // Call the login API
            const response = await authAPI.login(data.email, data.password)

            // Store the access token
            localStorage.setItem('access_token', response.access_token)

            // Get user information to determine redirect
            const user = await usersAPI.getCurrentUser()

            // Redirect based on user role
            switch (user.role) {
                case 'creative':
                    router.push('/creative-dashboard')
                    break
                case 'client':
                    router.push('/dashboard')
                    break
                case 'admin':
                    router.push('/admin')
                    break
                default:
                    router.push('/creative-dashboard')
            }
        } catch (error) {
            console.error('Login error:', error)

            // Handle different error types
            if (error instanceof Error) {
                // Handle axios errors
                if ('response' in error && error.response && typeof error.response === 'object') {
                    const response = error.response as { status?: number; data?: { detail?: string } };
                    if (response.status === 401) {
                        showNotification('Invalid email or password. Please try again.', 'error')
                    } else if (response.status === 403) {
                        showNotification('Your account has been deactivated. Please contact support.', 'error')
                    } else if (response.data?.detail) {
                        showNotification(response.data.detail, 'error')
                    } else {
                        showNotification('An error occurred during login. Please try again.', 'error')
                    }
                } else {
                    showNotification('An error occurred during login. Please try again.', 'error')
                }
            } else {
                showNotification('An error occurred during login. Please try again.', 'error')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Log in to your account</h1>
                <p className="text-neutral-600 mt-2">
                    Welcome back! Please enter your credentials to access your account.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                            Password
                        </label>
                        <Link href="/forgot-password" className="text-sm text-beacon-blue hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <Switch
                                checked={showPassword}
                                onChange={setShowPassword}
                                className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="sr-only">Show password</span>
                                <span
                                    aria-hidden="true"
                                    className={`${showPassword ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                                />
                            </Switch>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Button type="submit" fullWidth={true} isLoading={isLoading}>
                        Log in
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-neutral-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-beacon-blue hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}