import axios from 'axios';

// Resolve backend API base URL from a single source of truth (.env at repo root)
// and normalize it to avoid double/missing slashes when joining with endpoint paths.
const resolveApiBaseURL = () => {
    const raw = (process.env.NEXT_PUBLIC_API_URL || '').trim();
    const base = raw.length > 0 ? raw : 'http://backend:8000/api/v1';
    // Normalize:
    // - force a single trailing slash
    // - ensure we have the /api/v1 prefix present (backend is mounted under settings.API_V1_STR)
    let url = base.replace(/\/+$/, '');
    // If user supplied origin only (e.g., http://localhost:8000), append /api/v1
    // Accept either with or without trailing slash
    if (!/\/api\/v\d+$/i.test(url)) {
        url = `${url}/api/v1`;
    }
    // Return with trailing slash removed; axios will handle paths starting with /
    return url;
};

// Create axios instance with base configuration
const api = axios.create({
    baseURL: resolveApiBaseURL(), // resolves to http://backend:8000/api/v1 when running inside Docker container
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
    validateStatus: (status) => status >= 200 && status < 500,
})

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        // Force server-side calls only: when running in the browser, route through Next.js API
        const isBrowser = typeof window !== 'undefined';
        if (isBrowser) {
            const url = (config.url || '').toString();
            // Normalize to start-with checks for top-level resource groups
            const rewrite = (from: string, to: string) => {
                if (url === from || url.startsWith(from + '/') || url.startsWith(from + '?')) {
                    config.baseURL = '';
                    config.url = to + url.slice(from.length);
                    return true;
                }
                return false;
            };
            // Auth
            if (rewrite('/auth/login', '/api/auth/login')) { /* no-op */ }
            else if (rewrite('/auth/register', '/api/auth/register')) { /* no-op */ }
            // Users
            else if (rewrite('/users/me', '/api/users/me')) { /* browser -> Next proxy */ }
            // Projects
            else if (rewrite('/projects', '/api/projects')) { /* list/detail CRUD via Next proxies */ }
            // Applications
            else if (rewrite('/applications', '/api/applications')) { /* CRUD via Next */ }
            // Messages
            else if (rewrite('/messages', '/api/messages')) { /* CRUD via Next */ }
            // Files
            else if (rewrite('/files', '/api/files')) { /* upload/list/delete via Next (multipart aware) */ }
            // Payments
            else if (rewrite('/payments', '/api/payments')) { /* via Next */ }
            // otherwise leave as-is (SSR or server route handlers)
        } else {
            // Server-side (Next API routes / server components) -> use backend base
            config.baseURL = resolveApiBaseURL(); // normalized to include /api/v1
        }
        // Token is handled automatically via HttpOnly cookies for browser requests
        // Server-side requests will use cookies passed through Next.js API routes
        return config;
    },
    (error) => Promise.reject(error)
)

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        if (status === 401) {
            // Redirect to login on unauthorized responses
            if (typeof window !== 'undefined') {
                // Avoid loops: only navigate if not already on /login
                if (!window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login'
                }
            }
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const params = new URLSearchParams()
        params.append('username', email)
        params.append('password', password)

        // Important: ensure URL is absolute against normalized backend baseURL
        // baseURL: http(s)://host:port/api/v1 + path '/auth/login' => http(s)://host:port/api/v1/auth/login
        const response = await api.post('/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        if (response.status === 404) {
            // Provide a clearer error for misconfigured baseURL
            throw new Error(`Login endpoint not found at ${api.defaults.baseURL}/auth/login. Check NEXT_PUBLIC_API_URL or backend server.`);
        }
        return response.data
    },

    register: async (userData: {
        email: string
        password: string
        confirm_password: string
        first_name: string
        last_name: string
        user_type: string
        bio?: string
        location?: string
    }) => {
        const backendData = {
            ...userData,
            role: userData.user_type
        };
        delete (backendData as any).user_type;

        const response = await api.post('/auth/register', backendData)
        if (response.status === 404) {
            throw new Error(`Register endpoint not found at ${api.defaults.baseURL}/auth/register. Check NEXT_PUBLIC_API_URL or backend server.`);
        }
        return response.data
    },
}

// Projects API
export const projectsAPI = {
    getProjects: async (params?: {
        skip?: number
        limit?: number
        status?: string
        category?: string
        search?: string
    }) => {
        const response = await api.get('/projects/', { params })
        return response.data
    },
    
    getProject: async (projectId: string) => {
        const response = await api.get(`/projects/${projectId}`)
        return response.data
    },
    
    createProject: async (projectData: {
        title: string
        description: string
        category: string
        budget_min?: number
        budget_max?: number
        timeline_weeks?: number
        required_skills?: string[]
    }) => {
        const response = await api.post('/projects/', projectData)
        return response.data
    },
    
    updateProject: async (projectId: string, projectData: Partial<{
        title: string
        description: string
        category: string
        budget_min?: number
        budget_max?: number
        timeline_weeks?: number
        required_skills?: string[]
    }>) => {
        const response = await api.put(`/projects/${projectId}`, projectData)
        return response.data
    },
    
    deleteProject: async (projectId: string) => {
        const response = await api.delete(`/projects/${projectId}`)
        return response.data
    },
    
    getMyProjects: async (status?: string) => {
        const response = await api.get('/projects/my-projects', {
            params: status ? { status } : {}
        })
        return response.data
    },
}

// Applications API
export const applicationsAPI = {
    createApplication: async (applicationData: {
        project_id: string
        cover_letter: string
        proposed_budget?: number
        proposed_timeline_weeks?: number
    }) => {
        // Convert project_id to UUID format if needed
        const formattedData = {
            ...applicationData,
            project_id: applicationData.project_id
        };
        const response = await api.post('/applications/', formattedData)
        return response.data
    },
    
    getMyApplications: async (status?: string) => {
        const response = await api.get('/applications/me', {
            params: status ? { status } : {}
        })
        return response.data
    },
    
    getProjectApplications: async (projectId: string) => {
        const response = await api.get(`/applications/project/${projectId}`)
        return response.data
    },
    
    getApplication: async (applicationId: string) => {
        const response = await api.get(`/applications/${applicationId}`)
        return response.data
    },
    
    updateApplication: async (applicationId: string, applicationData: Partial<{
        project_id: string
        cover_letter: string
        proposed_budget?: number
        proposed_timeline_weeks?: number
    }>) => {
        const response = await api.put(`/applications/${applicationId}`, applicationData)
        return response.data
    },
    
    deleteApplication: async (applicationId: string) => {
        const response = await api.delete(`/applications/${applicationId}`)
        return response.data
    },
}

// Users API
export const usersAPI = {
    getCurrentUser: async () => {
        // In the browser, call our Next.js API proxy to avoid hitting backend hostnames directly
        if (typeof window !== 'undefined') {
            const resp = await fetch('/api/users/me', {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                cache: 'no-store',
            });
            if (!resp.ok) {
                const text = await resp.text().catch(() => '');
                let data: any = null;
                try { data = text ? JSON.parse(text) : null; } catch {}
                throw new Error(data?.message || data?.detail || `Failed to fetch current user (${resp.status})`);
            }
            return resp.json();
        }
        // On the server (SSR/Next API), use direct backend call via axios baseURL
        const response = await api.get('/users/me')
        return response.data
    },
    
    updateCurrentUser: async (userData: Partial<{
        email: string
        first_name: string
        last_name: string
        bio?: string
        location?: string
    }>) => {
        const response = await api.put('/users/me', userData)
        return response.data
    },
    
    getUser: async (userId: string) => {
        const response = await api.get(`/users/${userId}`)
        return response.data
    },
    
    uploadAvatar: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await api.post('/users/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },
}

// Messages API
export const messagesAPI = {
    getMessages: async (params?: {
        skip?: number
        limit?: number
        project_id?: string
        application_id?: string
    }) => {
        const response = await api.get('/messages/', { params })
        return response.data
    },
    
    sendMessage: async (messageData: {
        recipient_id: string
        content: string
        project_id?: string
        application_id?: string
    }) => {
        const response = await api.post('/messages/', messageData)
        return response.data
    },
    
    markAsRead: async (messageId: string) => {
        const response = await api.put(`/messages/${messageId}/read`)
        return response.data
    },
}

// Files API
export const filesAPI = {
    uploadFile: async (file: File, projectId: string) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('project_id', projectId)
        
        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },
    
    getProjectFiles: async (projectId: string) => {
        const response = await api.get(`/files/project/${projectId}`)
        return response.data
    },
    
    deleteFile: async (fileId: string) => {
        const response = await api.delete(`/files/${fileId}`)
        return response.data
    },
}

// Payments API
export const paymentsAPI = {
    createPayment: async (paymentData: {
        project_id: string
        creative_id: string
        amount: number
        milestone_description?: string
    }) => {
        // Convert project_id to UUID format if needed
        const formattedData = {
            ...paymentData,
            project_id: paymentData.project_id
        };
        const response = await api.post('/payments/', formattedData)
        return response.data
    },
    
    getPayments: async (projectId?: string) => {
        const response = await api.get('/payments/', {
            params: projectId ? { project_id: projectId } : {}
        })
        return response.data
    },
    
    releasePayment: async (paymentId: string) => {
        const response = await api.put(`/payments/${paymentId}/release`)
        return response.data
    },
}

export default api