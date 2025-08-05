'use client'

import { SimplifiedLayout } from '@/components/layout/SimplifiedLayout'
import Button from '@/components/ui/Button'
import { EnhancedLoadingSpinner } from '@/components/ui/EnhancedLoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { useNotification } from '@/components/ui/NotificationProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const projectSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    category: z.string().min(1, 'Please select a category'),
    budgetMin: z.number().min(1, 'Minimum budget must be greater than 0').optional(),
    budgetMax: z.number().min(1, 'Maximum budget must be greater than 0').optional(),
    timelineWeeks: z.number().min(1, 'Timeline must be at least 1 week').optional(),
    requiredSkills: z.array(z.string()).optional()
})

type ProjectFormData = z.infer<typeof projectSchema>

const CATEGORIES = [
    'Design',
    'Photography',
    'Writing',
    'Video',
    'Marketing',
    'Development',
    'Music',
    'Other'
]

const SKILLS = [
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe InDesign',
    'Figma',
    'UI/UX Design',
    'Brand Identity',
    'Logo Design',
    'Typography',
    'Fashion Photography',
    'Portrait Photography',
    'Product Photography',
    'Event Photography',
    'Lighting',
    'Copywriting',
    'Content Writing',
    'Technical Writing',
    'SEO Writing',
    'Script Writing',
    'Video Editing',
    'Motion Graphics',
    'Animation',
    'Videography',
    'Drone Videography',
    'Social Media',
    'Content Creation',
    'Digital Marketing',
    'Email Marketing',
    'PPC Advertising',
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile App Development',
    'WordPress',
    'E-commerce',
    'Singing',
    'Instrumental',
    'Music Production',
    'Sound Design',
    'Voice Over'
]

export default function NewProjectPage() {
    const [loading, setLoading] = useState(false)
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [newSkill, setNewSkill] = useState('')
    const { showNotification } = useNotification()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            budgetMin: undefined,
            budgetMax: undefined,
            timelineWeeks: undefined,
            requiredSkills: []
        }
    })

    const budgetMin = watch('budgetMin')
    const budgetMax = watch('budgetMax')

    const onSubmit = async (data: ProjectFormData) => {
        try {
            setLoading(true)
            // In a real implementation, this would call the API
            // await projectsAPI.createProject({
            //     ...data,
            //     requiredSkills: selectedSkills
            // })

            showNotification('Project created successfully!', 'success')
            router.push('/dashboard')
        } catch (err) {
            console.error('Error creating project:', err)
            showNotification('Failed to create project. Please try again.', 'error')
        } finally {
            setLoading(false)
        }
    }

    const addSkill = () => {
        if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
            setSelectedSkills([...selectedSkills, newSkill.trim()])
            setNewSkill('')
        }
    }

    const removeSkill = (skill: string) => {
        setSelectedSkills(selectedSkills.filter(s => s !== skill))
    }

    if (loading) {
        return (
            <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search...">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <EnhancedLoadingSpinner size="lg" message="Creating project..." />
                    </div>
                </div>
            </SimplifiedLayout>
        )
    }

    return (
        <SimplifiedLayout userType="client" showSearch={true} searchPlaceholder="Search...">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900">Create New Project</h1>
                        <p className="text-neutral-600 mt-2">
                            Post a new project and start connecting with creative professionals
                        </p>
                    </div>

                    <ErrorBoundary>
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                            <div className="p-6">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                    {/* Project Title */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Project Title
                                        </label>
                                        <input
                                            id="title"
                                            {...register('title')}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${errors.title ? 'border-red-500' : 'border-neutral-300'}`}
                                            placeholder="e.g., Brand Identity Design for Tech Startup"
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                        )}
                                    </div>

                                    {/* Project Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Project Description
                                        </label>
                                        <textarea
                                            id="description"
                                            {...register('description')}
                                            rows={6}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${errors.description ? 'border-red-500' : 'border-neutral-300'}`}
                                            placeholder="Describe your project in detail. Include goals, requirements, and any specific deliverables..."
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                        )}
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Category
                                        </label>
                                        <Controller
                                            name="category"
                                            control={control}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${errors.category ? 'border-red-500' : 'border-neutral-300'}`}
                                                >
                                                    <option value="">Select a category</option>
                                                    {CATEGORIES.map((category) => (
                                                        <option key={category} value={category}>
                                                            {category}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        />
                                        {errors.category && (
                                            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                        )}
                                    </div>

                                    {/* Budget */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="budgetMin" className="block text-sm font-medium text-neutral-700 mb-2">
                                                Minimum Budget (USD)
                                            </label>
                                            <input
                                                id="budgetMin"
                                                type="number"
                                                {...register('budgetMin', { valueAsNumber: true })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${errors.budgetMin ? 'border-red-500' : 'border-neutral-300'}`}
                                                placeholder="e.g., 1000"
                                            />
                                            {errors.budgetMin && (
                                                <p className="mt-1 text-sm text-red-600">{errors.budgetMin.message}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="budgetMax" className="block text-sm font-medium text-neutral-700 mb-2">
                                                Maximum Budget (USD)
                                            </label>
                                            <input
                                                id="budgetMax"
                                                type="number"
                                                {...register('budgetMax', { valueAsNumber: true })}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${errors.budgetMax ? 'border-red-500' : 'border-neutral-300'}`}
                                                placeholder="e.g., 5000"
                                            />
                                            {errors.budgetMax && (
                                                <p className="mt-1 text-sm text-red-600">{errors.budgetMax.message}</p>
                                            )}
                                            {budgetMin && budgetMax && budgetMin > budgetMax && (
                                                <p className="mt-1 text-sm text-red-600">Maximum budget must be greater than minimum budget</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div>
                                        <label htmlFor="timelineWeeks" className="block text-sm font-medium text-neutral-700 mb-2">
                                            Project Timeline (weeks)
                                        </label>
                                        <input
                                            id="timelineWeeks"
                                            type="number"
                                            {...register('timelineWeeks', { valueAsNumber: true })}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple ${errors.timelineWeeks ? 'border-red-500' : 'border-neutral-300'}`}
                                            placeholder="e.g., 4"
                                        />
                                        {errors.timelineWeeks && (
                                            <p className="mt-1 text-sm text-red-600">{errors.timelineWeeks.message}</p>
                                        )}
                                    </div>

                                    {/* Required Skills */}
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                                            Required Skills
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {selectedSkills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-beacon-purple-light/20 text-beacon-purple"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="ml-2 text-beacon-purple hover:text-beacon-purple-dark"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex">
                                            <input
                                                type="text"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-neutral-300 rounded-l-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                                placeholder="Add a required skill"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        addSkill()
                                                    }
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={addSkill}
                                                className="px-4 py-2 bg-beacon-purple text-white rounded-r-lg hover:bg-beacon-purple-dark focus:outline-none focus:ring-2 focus:ring-beacon-purple"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            <select
                                                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                                onChange={(e) => {
                                                    if (e.target.value && !selectedSkills.includes(e.target.value)) {
                                                        setSelectedSkills([...selectedSkills, e.target.value])
                                                    }
                                                    e.target.value = ''
                                                }}
                                            >
                                                <option value="">Select from popular skills...</option>
                                                {SKILLS.filter(skill => !selectedSkills.includes(skill)).map((skill) => (
                                                    <option key={skill} value={skill}>
                                                        {skill}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-200">
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push('/dashboard')}
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating...' : 'Create Project'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
        </SimplifiedLayout>
    )
}