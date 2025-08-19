import LoginForm from '@/components/forms/LoginForm'

export const metadata = {
    title: 'Log In | B3ACON Creative Connect',
    description: 'Log in to your B3ACON account to access your projects, messages, and more.',
}

export default async function LoginPage() {
    // Render only the login content — header/footer handled by the global Shell to avoid duplicate chrome.
    return (
        <main className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </main>
    )
}