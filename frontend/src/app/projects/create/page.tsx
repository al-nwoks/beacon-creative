'use client'

import { MainLayout } from '@/components/layout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useNotification } from '@/components/ui/NotificationProvider'
import { projectsAPI } from '@/lib/api'
import { Listbox, Switch } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Define form schema with Zod
const projectSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    category: z.string().min(1, 'Please select a category'),
    budget_min: z.number().min(1, 'Minimum budget must be greater than 0').optional(),
    budget_max: z.number().min(1, 'Maximum budget must be greater than 0').optional(),
    timeline_weeks: z.number().min(1, 'Timeline must be at least 1 week'),
    required_skills: z.array(z.string()).min(1, 'Please select at least one skill'),
    is_remote: z.boolean(),
    experience_level: z.enum(['entry', 'intermediate', 'expert'])
})

type ProjectFormData = z.infer<typeof projectSchema>

interface Category {
    id: string;
    name: string;
}

interface ExperienceLevel {
    id: 'entry' | 'intermediate' | 'expert';
    name: string;
    description: string;
}

const DEFAULT_CATEGORY: Category = { id: 'design', name: 'Design' };
const DEFAULT_EXPERIENCE: ExperienceLevel = {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Some experience, can work independently'
};

const categories: Category[] = [
    DEFAULT_CATEGORY,
    { id: 'development', name: 'Development' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'writing', name: 'Writing' },
    { id: 'video', name: 'Video & Animation' },
    { id: 'photography', name: 'Photography' },
    { id: 'other', name: 'Other' }
];

const skills = [
    'UI/UX Design', 'Graphic Design', 'Web Development', 'Mobile Development',
    'Frontend Development', 'Backend Development', 'Full Stack Development',
    'Content Writing', 'Copywriting', 'SEO', 'Social Media Marketing',
    'Video Editing', 'Animation', 'Photography', 'Branding',
    'Illustration', '3D Modeling', 'Data Analysis', 'Project Management'
]

const experienceLevels = [
    { id: 'entry', name: 'Entry Level', description: 'Beginner with basic skills' },
    { id: 'intermediate', name: 'Intermediate', description: 'Some experience, can work independently' },
    { id: 'expert', name: 'Expert', description: 'Highly experienced professional' }
]

export default function CreateProjectPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category>(DEFAULT_CATEGORY)
    const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel>(DEFAULT_EXPERIENCE)
    const { showNotification } = useNotification()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            budget_min: undefined,
            budget_max: undefined,
            timeline_weeks: 4,
            is_remote: true,
            experience_level: 'intermediate'
        }
    })

    const onSubmit = async (data: ProjectFormData) => {
        setIsLoading(true)

        if (!selectedCategory || !selectedExperience) {
            showNotification('Please select a category and experience level', 'error')
            setIsLoading(false)
            return
        }

        try {
            const projectData = {
                ...data,
                category: selectedCategory.id,
                required_skills: selectedSkills,
                experience_level: selectedExperience.id
            }

            await projectsAPI.createProject(projectData)
            showNotification('Project created successfully!', 'success')
            router.push('/projects')
        } catch (error) {
            console.error('Error creating project:', error)
            let errorMessage = 'Failed to create project. Please try again.';
            if (error instanceof Error) {
                // Handle axios errors
                if ('response' in error && error.response && typeof error.response === 'object') {
                    const response = error.response as { data?: { detail?: string } };
                    errorMessage = response.data?.detail || errorMessage;
                }
            }
            showNotification(errorMessage, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSkillToggle = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill)
                ? prev.filter(s => s !== skill)
                : [...prev, skill]
        )
    }

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-neutral-900">Create New Project</h1>
                            <p className="text-neutral-600 mt-2">
                                Post your project and connect with talented creatives
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 md:p-8">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Project Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Project Title
                                    </label>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="e.g., Website Redesign for E-commerce Platform"
                                        error={errors.title?.message}
                                        {...register('title')}
                                    />
                                    <p className="mt-1 text-sm text-neutral-500">
                                        A clear, descriptive title helps attract the right creatives
                                    </p>
                                </div>

                                {/* Project Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Project Description
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={5}
                                        placeholder="Describe your project in detail. What are you trying to achieve? What are the key requirements?"
                                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple"
                                        {...register('description')}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-beacon-red">{errors.description.message}</p>
                                    )}
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Include goals, deliverables, and any specific requirements
                                    </p>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        Category
                                    </label>
                                    <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple sm:text-sm">
                                                <span className="block truncate">{selectedCategory.name}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                                {categories.map((category) => (
                                                    <Listbox.Option
                                                        key={category.id}
                                                        value={category}
                                                        className="relative cursor-default select-none py-2 pl-10 pr-4"
                                                    >
                                                        {({ selected }: { selected: boolean }) => (
                                                            <>
                                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                    {category.name}
                                                                </span>
                                                                {selected ? (
                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-beacon-purple">
                                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </div>
                                    </Listbox>
                                </div>

                                {/* Budget Range */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="budget_min" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Minimum Budget (USD)
                                        </label>
                                        <Input
                                            id="budget_min"
                                            type="number"
                                            placeholder="e.g., 500"
                                            error={errors.budget_min?.message}
                                            {...register('budget_min', { valueAsNumber: true })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="budget_max" className="block text-sm font-medium text-neutral-700 mb-1">
                                            Maximum Budget (USD)
                                        </label>
                                        <Input
                                            id="budget_max"
                                            type="number"
                                            placeholder="e.g., 5000"
                                            error={errors.budget_max?.message}
                                            {...register('budget_max', { valueAsNumber: true })}
                                        />
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    <label htmlFor="timeline_weeks" className="block text-sm font-medium text-neutral-700 mb-1">
                                        Project Timeline (weeks)
                                    </label>
                                    <Input
                                        id="timeline_weeks"
                                        type="number"
                                        placeholder="e.g., 4"
                                        error={errors.timeline_weeks?.message}
                                        {...register('timeline_weeks', { valueAsNumber: true })}
                                    />
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Estimated duration for project completion
                                    </p>
                                </div>

                                {/* Required Skills */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        Required Skills
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                                        {skills.map((skill) => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => handleSkillToggle(skill)}
                                                className={`px-3 py-2 text-sm rounded-md text-left transition-colors ${selectedSkills.includes(skill)
                                                    ? 'bg-beacon-purple text-white'
                                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                                    }`}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.required_skills && (
                                        <p className="mt-1 text-sm text-beacon-red">{errors.required_skills.message}</p>
                                    )}
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Select all skills relevant to your project
                                    </p>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        Experience Level
                                    </label>
                                    <Listbox value={selectedExperience} onChange={setSelectedExperience}>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:border-beacon-purple sm:text-sm">
                                                <span className="block truncate">{selectedExperience.name}</span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </span>
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                                {experienceLevels.map((level) => (
                                                    <Listbox.Option
                                                        key={level.id}
                                                        value={level}
                                                        className="relative cursor-default select-none py-3 pl-4 pr-4"
                                                    >
                                                        {({ selected }: { selected: boolean }) => (
                                                            <div className="flex justify-between">
                                                                <div>
                                                                    <span className={`block font-medium ${selected ? 'text-beacon-purple' : ''}`}>
                                                                        {level.name}
                                                                    </span>
                                                                    <span className="block text-sm text-neutral-500">
                                                                        {level.description}
                                                                    </span>
                                                                </div>
                                                                {selected ? (
                                                                    <span className="flex items-center text-beacon-purple">
                                                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </div>
                                    </Listbox>
                                </div>

                                {/* Remote Work */}
                                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-neutral-900">Remote Work</h3>
                                        <p className="text-sm text-neutral-600">
                                            Allow creatives to work remotely
                                        </p>
                                    </div>
                                    <Switch
                                        checked={true}
                                        onChange={(checked) => setValue('is_remote', checked)}
                                        className={`${true ? 'bg-beacon-purple' : 'bg-gray-200'
                                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-beacon-purple focus:ring-offset-2`}
                                    >
                                        <span className="sr-only">Enable remote work</span>
                                        <span
                                            className={`${true ? 'translate-x-5' : 'translate-x-0'
                                                } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                        />
                                    </Switch>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        isLoading={isLoading}
                                        className="px-6 py-3"
                                    >
                                        Create Project
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    )
}