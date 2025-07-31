'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { authAPI } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Define the form validation schema using Zod
const registerSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Please confirm your password'),
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    user_type: z.enum(['creative', 'client'], {
        required_error: 'Please select your account type',
    }),
    bio: z.string().optional(),
    location: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
})

// Infer the type from the schema
type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
    defaultUserType?: 'creative' | 'client'
}

export default function RegisterForm({ defaultUserType }: RegisterFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const router = useRouter()

    // Initialize react-hook-form with zod validation
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirm_password: '',
            first_name: '',
            last_name: '',
            user_type: defaultUserType || 'creative',
            bio: '',
            location: '',
        },
    })

    const selectedUserType = watch('user_type')

    // Handle form submission
    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true)
        setServerError(null)

        try {
            // Call the register API
            await authAPI.register(data)

            // After successful registration, log the user in
            const loginResponse = await authAPI.login(data.email, data.password)

            // Store the access token
            localStorage.setItem('access_token', loginResponse.access_token)

            // Redirect based on user type
            if (data.user_type === 'creative') {
                router.push('/creative-dashboard')
            } else {
                router.push('/dashboard')
            }
        } catch (error: any) {
            console.error('Registration error:', error)

            // Handle different error types
            if (error.response?.status === 400) {
                if (error.response.data?.detail?.includes('email already exists')) {
                    setServerError('An account with this email already exists. Please try logging in instead.')
                } else {
                    setServerError(error.response.data?.detail || 'Please check your information and try again.')
                }
            } else if (error.response?.data?.detail) {
                setServerError(error.response.data.detail)
            } else {
                setServerError('An error occurred during registration. Please try again.')
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Create your account</h1>
                <p className="text-neutral-600 mt-2">
                    Join B3ACON to connect with creative professionals and exciting opportunities.
                </p>
            </div>

            {serverError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-beacon-red rounded-md text-sm">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* User Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${selectedUserType === 'creative'
                                ? 'border-beacon-blue bg-beacon-blue/5'
                                : 'border-neutral-300'
                            }`}>
                            <input
                                type="radio"
                                value="creative"
                                className="sr-only"
                                {...register('user_type')}
                            />
                            <div className="flex flex-col">
                                <span className="block text-sm font-medium text-neutral-900">
                                    Find Work
                                </span>
                                <span className="block text-sm text-neutral-500">
                                    I'm a creative professional
                                </span>
                            </div>
                        </label>

                        <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${selectedUserType === 'client'
                                ? 'border-beacon-blue bg-beacon-blue/5'
                                : 'border-neutral-300'
                            }`}>
                            <input
                                type="radio"
                                value="client"
                                className="sr-only"
                                {...register('user_type')}
                            />
                            <div className="flex flex-col">
                                <span className="block text-sm font-medium text-neutral-900">
                                    Hire Talent
                                </span>
                                <span className="block text-sm text-neutral-500">
                                    I need creative services
                                </span>
                            </div>
                        </label>
                    </div>
                    {errors.user_type && (
                        <p className="mt-1 text-sm text-beacon-red">{errors.user_type.message}</p>
                    )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="First Name"
                        type="text"
                        id="first_name"
                        placeholder="John"
                        error={errors.first_name?.message}
                        {...register('first_name')}
                    />
                    <Input
                        label="Last Name"
                        type="text"
                        id="last_name"
                        placeholder="Doe"
                        error={errors.last_name?.message}
                        {...register('last_name')}
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Password"
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    helperText="Must be at least 8 characters"
                    {...register('password')}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    id="confirm_password"
                    placeholder="••••••••"
                    error={errors.confirm_password?.message}
                    {...register('confirm_password')}
                />

                {/* Optional Fields */}
                <Input
                    label="Location (Optional)"
                    type="text"
                    id="location"
                    placeholder="New York, NY"
                    error={errors.location?.message}
                    {...register('location')}
                />

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">
                        Bio (Optional)
                    </label>
                    <textarea
                        id="bio"
                        rows={3}
                        placeholder={selectedUserType === 'creative'
                            ? "Tell us about your creative skills and experience..."
                            : "Tell us about your business and what kind of creative services you need..."
                        }
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-blue focus:border-transparent resize-none"
                        {...register('bio')}
                    />
                    {errors.bio && (
                        <p className="mt-1 text-sm text-beacon-red">{errors.bio.message}</p>
                    )}
                </div>

                <Button type="submit" fullWidth={true} isLoading={isLoading}>
                    Create Account
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-neutral-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-beacon-blue hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}
