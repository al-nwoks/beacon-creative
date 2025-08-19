'use client'

/**
 * LoginModal — simplified placeholder
 *
 * The previous in-page modal and guarded flow have been removed per request.
 * Keep a minimal component here for any imports that reference LoginModal.
 * The login flow now uses the login form endpoints which set a JWT cookie and
 * the post-login redirect logic in the login form to route users to their
 * appropriate dashboard.
 */


interface LoginModalProps {
    redirect?: string
    onClose?: () => void
}

export default function LoginModal(_: LoginModalProps) {
    // Intentionally renders nothing. The previous modal implementation was removed.
    return null
}