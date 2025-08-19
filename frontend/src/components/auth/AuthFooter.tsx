import Link from 'next/link'

interface AuthFooterProps {
    text: string
    link: string
    linkText: string
}

export default function AuthFooter({ text, link, linkText }: AuthFooterProps) {
    return (
        <div className="auth-footer">
            <span className="text-gray-600">{text}</span>
            <Link href={link} className="text-beacon-purple hover:underline ml-1">
                {linkText}
            </Link>
        </div>
    )
}