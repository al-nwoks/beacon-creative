'use client'

import { Switch } from '@/components/headless/Switch'
import type { NotificationSetting } from '@/types/api'
import { useState } from 'react'

export function NotificationSettingsPanel({
    settings,
    onUpdate
}: {
    settings: NotificationSetting,
    onUpdate: (updates: Partial<NotificationSetting>) => Promise<void>
}) {
    const [isUpdating, setIsUpdating] = useState(false)

    const handleToggle = async (field: keyof NotificationSetting, value: boolean) => {
        setIsUpdating(true)
        try {
            await onUpdate({ [field]: value })
        } catch (error) {
            console.error('Failed to update notification settings', error)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
            <div className="space-y-4">
                <Switch
                    checked={settings.email_gig_updates || false}
                    onChange={(checked) => handleToggle('email_gig_updates', checked)}
                    disabled={isUpdating}
                    label="Gig Updates"
                    description="Email notifications for gig updates"
                />
                <Switch
                    checked={settings.email_messages || false}
                    onChange={(checked) => handleToggle('email_messages', checked)}
                    disabled={isUpdating}
                    label="Messages"
                    description="Email notifications for new messages"
                />
                <Switch
                    checked={settings.email_application_status || false}
                    onChange={(checked) => handleToggle('email_application_status', checked)}
                    disabled={isUpdating}
                    label="Application Status"
                    description="Email notifications for application updates"
                />
                <Switch
                    checked={settings.email_payment_updates || false}
                    onChange={(checked) => handleToggle('email_payment_updates', checked)}
                    disabled={isUpdating}
                    label="Payment Updates"
                    description="Email notifications for payments"
                />
            </div>
        </div>
    )
}