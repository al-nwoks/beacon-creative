export interface Creative {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio?: string;
    location?: string;
    hourlyRate?: number;
    skills?: string[];
    portfolioLinks?: string[];
    profileImageUrl?: string;
    isVerified: boolean;
    rating?: number;
    reviewCount?: number;
    totalGigs?: number;
    joinDate: string;
    languages?: string[];
}

export interface Review {
    id: string;
    clientId: string;
    clientName: string;
    clientAvatar?: string;
    rating: number;
    comment: string;
    gigId: string;
    gigName: string;
    date: string;
}
