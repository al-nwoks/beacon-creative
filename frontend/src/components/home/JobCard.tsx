import { JobTypeIcon } from '@/components/icons/JobTypeIcons';
import Button from '@/components/ui/Button';
import { Clock, MapPin } from 'lucide-react';

interface Job {
    id: string;
    title: string;
    company: string;
    tags: string[];
    location: string;
    salary: string;
    deadline: string;
    jobType: 'design' | 'development' | 'marketing' | 'writing' | 'video' | 'other';
}

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    // Map tag names to job types for icons
    const getJobType = (tag: string): 'design' | 'development' | 'marketing' | 'writing' | 'video' | 'other' => {
        const tagLower = tag.toLowerCase();
        if (tagLower.includes('design')) return 'design';
        if (tagLower.includes('develop') || tagLower.includes('program')) return 'development';
        if (tagLower.includes('market') || tagLower.includes('advert')) return 'marketing';
        if (tagLower.includes('write') || tagLower.includes('content')) return 'writing';
        if (tagLower.includes('video') || tagLower.includes('film')) return 'video';
        return 'other';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900">{job.title}</h3>
                    <p className="text-neutral-600">{job.company}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                    <Clock className="h-4 w-4" />
                    <span>Deadline: {job.deadline}</span>
                </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
                {job.tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs font-medium">
                        <JobTypeIcon
                            type={getJobType(tag)}
                            className="w-4 h-4 mr-1 text-beacon-purple"
                        />
                        <span>{tag}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                </div>
                <p className="font-semibold">{job.salary}</p>
            </div>
            <Button className="w-full mt-6">Apply Now</Button>
        </div>
    );
}
