import type { PageProps } from '@/types/common';
import { ProjectDetails } from './ProjectDetails';

export default async function ProjectDetailsPage({
    params
}: PageProps) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
        throw new Error('Project ID is required');
    }

    return <ProjectDetails id={id} />;
}