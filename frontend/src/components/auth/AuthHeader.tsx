
interface AuthHeaderProps {
    title: string
    subtitle: string
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <div className="auth-header">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    )
}