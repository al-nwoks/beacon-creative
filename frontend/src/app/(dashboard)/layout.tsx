export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Dashboard routes opt-out of the global PublicHeader/PublicFooter chrome
    return <>{children}</>
}