'use client'

import Button from '@/components/ui/Button'
import { clientFetcher } from '@/lib/api'
import type { User } from '@/types/api'
import { X } from 'lucide-react'
import { useState } from 'react'

interface ProfileEditModalProps {
    user: User
    isOpen: boolean
    onClose: () => void
    onSave: (updatedUser: User) => void
}

export default function ProfileEditModal({ user, isOpen, onClose, onSave }: ProfileEditModalProps) {
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        location: user.location || '',
        creative_type: user.creative_type || '',
        hourly_rate: user.hourly_rate?.toString() || '',
        skills: user.skills?.join(', ') || '',
    })
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        try {
            // Prepare the data for submission
            const submitData: any = {
                ...formData,
                hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
                skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []
            }

            // Remove empty string fields
            Object.keys(submitData).forEach(key => {
                if (submitData[key] === '') {
                    delete submitData[key]
                }
            })

            const updatedUser = await clientFetcher('/api/users/me', {
                method: 'PUT',
                body: JSON.stringify(submitData),
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            onSave(updatedUser)
            onClose()
        } catch (err: any) {
            console.error('Failed to update profile', err)
            setError(err.message || 'Failed to update profile. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        disabled={isSaving}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isSaving}
                            />
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="creative_type" className="block text-sm font-medium text-gray-700 mb-1">
                                Creative Type
                            </label>
                            <input
                                type="text"
                                id="creative_type"
                                name="creative_type"
                                value={formData.creative_type}
                                onChange={handleChange}
                                placeholder="e.g., Photographer, Designer, Writer"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isSaving}
                            />
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isSaving}
                            />
                        </div>

                        <div>
                            <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-1">
                                Hourly Rate ($)
                            </label>
                            <input
                                type="number"
                                id="hourly_rate"
                                name="hourly_rate"
                                value={formData.hourly_rate}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                                Skills (comma separated)
                            </label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="e.g., Photography, Editing, Photoshop"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isSaving}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                disabled={isSaving}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}