import RegisterForm from '@/components/forms/RegisterForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Account | B3ACON Creative Connect',
    description: 'Join B3ACON to connect with creative professionals and clients. Create your account today.',
}

import type { PageProps } from '@/types/common';

export default async function RegisterPage({
    searchParams,
}: PageProps) {
    // Get the user type from the URL query parameter
    const params = await searchParams;
    const userType = params && typeof params.type === 'string'
        ? (params.type === 'client' ? 'client' : 'creative')
        : undefined

    // For auth pages we rely on the global Shell to provide header/footer.
    // Render only the registration content so chrome isn't duplicated.
    return (
        <main className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
            <div className="w-full max-w-md">
                <RegisterForm defaultUserType={userType} />
            </div>
        </main>
    )
}