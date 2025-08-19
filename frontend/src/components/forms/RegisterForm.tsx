'use client'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useNotification } from '@/components/ui/NotificationProvider'
import { usersAPI } from '@/lib/api'
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
    const { showNotification } = useNotification()
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

        try {
            // Submit to secure server-side route handler
            const resp = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    confirm_password: data.confirm_password,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role: data.user_type,      // backend expects "role"
                    bio: data.bio || undefined,
                    location: data.location || undefined,
                }),
            })

            if (resp.status === 201) {
                // Cookie set by server after auto-login; optionally fetch user to route precisely
                let role = data.user_type
                try {
                    const me = await usersAPI.getCurrentUser()
                    role = (me?.role as 'creative' | 'client') || role
                } catch { /* ignore if unavailable; fall back to selected type */ }

                if (role === 'creative') {
                    router.push('/creative-dashboard')
                } else {
                    router.push('/dashboard')
                }
                return
            }

            // Parse and surface error message
            let msg = 'An error occurred during registration. Please try again.'
            try {
                const body = await resp.json()
                const detail = body?.detail || body?.message
                if (typeof detail === 'string' && detail.length > 0) msg = detail
            } catch { }
            if (resp.status === 400) {
                // heuristic for duplicate email
                if (msg.toLowerCase().includes('already')) {
                    msg = 'An account with this email already exists. Please try logging in instead.'
                }
            }
            showNotification(msg, 'error')
        } catch (error) {
            console.error('Registration error:', error)
            showNotification('An error occurred during registration. Please try again.', 'error')
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* User Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        I want to:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all duration-200 ${selectedUserType === 'creative'
                            ? 'border-beacon-purple bg-beacon-purple/10 ring-2 ring-beacon-purple/20'
                            : 'border-neutral-300 hover:border-neutral-400'
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

                        <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all duration-200 ${selectedUserType === 'client'
                            ? 'border-beacon-purple bg-beacon-purple/10 ring-2 ring-beacon-purple/20'
                            : 'border-neutral-300 hover:border-neutral-400'
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-transparent resize-none transition-all duration-200"
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