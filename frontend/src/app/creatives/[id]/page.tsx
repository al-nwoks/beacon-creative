import type { PageProps } from '@/types/common';
import { CreativeProfile } from './CreativeProfile';

export default async function CreativeProfilePage({
    params,
    searchParams
}: PageProps) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
        throw new Error('Creative ID is required');
    }

    return <CreativeProfile id={id} />;
}