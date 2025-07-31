import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('access_token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const formData = new FormData()
        formData.append('username', email)
        formData.append('password', password)
        
        const response = await api.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
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
        const response = await api.post('/auth/register', userData)
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
    
    updateProject: async (projectId: string, projectData: any) => {
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
        const response = await api.post('/applications/', applicationData)
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
    
    updateApplication: async (applicationId: string, applicationData: any) => {
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
        const response = await api.get('/users/me')
        return response.data
    },
    
    updateCurrentUser: async (userData: any) => {
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
        const response = await api.post('/payments/', paymentData)
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