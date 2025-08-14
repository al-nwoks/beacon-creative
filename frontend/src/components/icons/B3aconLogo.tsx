import type { HTMLAttributes } from 'react'

/**
 * B3aconLogo
 *
 * This component now renders the logo asset served from /public.
 * Replacing the inline SVG with an image makes it easy to update the logo in one place:
 * - Put the new raster/vector files into frontend/public/ (e.g. b3acon-logo.svg and b3acon-loader.svg)
 * - The component preserves sizing props via className / style.
 *
 * Usage remains the same: <B3aconLogo className="h-8 w-auto" />
 */
export function B3aconLogo(props: HTMLAttributes<HTMLImageElement>) {
    const { className, style, ...rest } = props
    return (
        // Use a simple <img> so consumers can pass className directly; Next/Image is avoided for
        // simplicity in SSR/static contexts. If you prefer next/image, switch to it and pass width/height.
        // The file expected is /b3acon-logo.svg (place it in frontend/public).
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src="/b3acon-logo.svg"
            alt="B3ACON"
            className={className as string | undefined}
            style={style}
            {...(rest as any)}
        />
    )
}
