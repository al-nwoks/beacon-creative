import { SkillIcon } from '@/components/icons/SkillIcons';
import Image from 'next/image';

interface Creator {
    id: string;
    name: string;
    avatarUrl: string;
    featured?: boolean;
    skills: string[];
}

interface CreatorCardProps {
    creator: Creator;
}

export function CreatorCard({ creator }: CreatorCardProps) {
    // Map skill names to skill types for icons
    const getSkillType = (skill: string): 'design' | 'development' | 'marketing' | 'writing' | 'video' | 'photography' | 'animation' | 'music' | 'other' => {
        const skillLower = skill.toLowerCase();
        if (skillLower.includes('design')) return 'design';
        if (skillLower.includes('develop') || skillLower.includes('program')) return 'development';
        if (skillLower.includes('market') || skillLower.includes('advert')) return 'marketing';
        if (skillLower.includes('write') || skillLower.includes('content')) return 'writing';
        if (skillLower.includes('video') || skillLower.includes('film')) return 'video';
        if (skillLower.includes('photo')) return 'photography';
        if (skillLower.includes('animate')) return 'animation';
        if (skillLower.includes('music') || skillLower.includes('audio')) return 'music';
        return 'other';
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="relative">
                <Image
                    src={creator.avatarUrl}
                    alt={creator.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                />
                {creator.featured && (
                    <span className="absolute top-0 right-0 bg-beacon-purple text-white text-xs font-semibold px-2 py-1 rounded-full">
                        Featured
                    </span>
                )}
            </div>
            <p className="font-semibold text-neutral-900">{creator.name}</p>
            {creator.skills && creator.skills.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {creator.skills.slice(0, 3).map((skill, index) => (
                        <div key={index} className="flex items-center bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
                            <SkillIcon
                                skill={getSkillType(skill)}
                                className="w-3 h-3 mr-1 text-beacon-purple"
                            />
                            <span>{skill}</span>
                        </div>
                    ))}
                    {creator.skills.length > 3 && (
                        <div className="flex items-center bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full text-xs">
                            <span>+{creator.skills.length - 3}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
