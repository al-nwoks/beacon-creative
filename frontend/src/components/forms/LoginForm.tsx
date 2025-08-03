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

export default function LoginForm() {
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
        } catch (error: any) {
            console.error('Login error:', error)

            // Handle different error types
            if (error.response?.status === 401) {
                showNotification('Invalid email or password. Please try again.', 'error')
            } else if (error.response?.status === 403) {
                showNotification('Your account has been deactivated. Please contact support.', 'error')
            } else if (error.response?.data?.detail) {
                showNotification(error.response.data.detail, 'error')
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
                    <Input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                </div>

                <Button type="submit" fullWidth={true} isLoading={isLoading}>
                    Log in
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-neutral-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-beacon-blue hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}