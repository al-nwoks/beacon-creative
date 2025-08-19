
// Next.js 15 specific types
export type SearchParams = { [key: string]: string | string[] | undefined };

// Dynamic route params
export type DynamicRouteParams = { [key: string]: string };

// Page Props for Next.js 15 App Router
export type PageProps<Params = {}, SearchParams = {}> = {
    params: Params;
    searchParams: SearchParams;
};

// Common API response type
export type ApiResponse<T = unknown> = {
  data: T;
  error?: string;
  message?: string;
  status: number;
};

// User related types
export type UserRole = 'creative' | 'client' | 'admin';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  bio?: string;
  location?: string;
  profileImageUrl?: string;
  isActive: boolean;
  isVerified: boolean;
};

// Project related types
export type ProjectStatus = 'draft' | 'active' | 'hired' | 'completed' | 'cancelled';

export type Project = {
  id: string;
  title: string;
  description: string;
  clientId: number;
  status: ProjectStatus;
  budget?: {
    min: number;
    max: number;
  };
  timelineWeeks?: number;
  requiredSkills?: string[];
  createdAt: string;
  updatedAt: string;
};

// Form event handlers
export type FormSubmitHandler<T = Record<string, unknown>> = (data: T) => Promise<void> | void;

// Generic types for API functions
export type ApiFunction<T = unknown, P = void> = P extends void 
  ? () => Promise<ApiResponse<T>>
  : (params: P) => Promise<ApiResponse<T>>;

// Error handler type
export type ErrorHandler = (error: Error | string) => void;
