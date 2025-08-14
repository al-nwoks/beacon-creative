export default function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'creative' | 'client' | 'admin' }) {
    // ProtectedRoute guard removed — pages should rely on the login flow to redirect
    // after successful authentication. This component now acts as a simple passthrough.
    // `requiredRole` prop is accepted for backward compatibility with existing usages.
    return <>{children}</>
}