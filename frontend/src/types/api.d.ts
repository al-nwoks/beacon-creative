/**
 * Shared API types used across the frontend.
 * Keep these in sync with backend schemas in backend/app/schemas/.
 *
 * NOTE: This is a lightweight typing surface — extend as needed per endpoint.
 */

/* User */
export interface User {
  id: number | string
  email: string
  name?: string
  first_name?: string
  last_name?: string
  role?: 'creative' | 'client' | 'admin'
  bio?: string | null
  location?: string | null
  profile_image_url?: string | null
  avatar_url?: string | null
  created_at?: string
  updated_at?: string
  last_login?: string | null
  hourly_rate?: number | null
  skills?: string[]
  portfolio_links?: string[]
  portfolio_images?: string[]
  company_name?: string | null
  // Profile stats
  gigs_count?: number
  followers_count?: number
  reviews_count?: number
  rating?: number
  creative_type?: string | null
  notification_settings?: NotificationSetting | null
  // Account status
  is_active?: boolean
  is_verified?: boolean
}

/* Gig */
export interface Gig {
  id: number | string
  title: string
  company?: string
  description?: string
  category?: string
  budget_min?: number | null
  budget_max?: number | null
  timeline_weeks?: number | null
  required_skills?: string[]
  created_at?: string
  updated_at?: string
  status?: string
  client_id?: number | string
  hired_creative_id?: number | string
  // Additional properties that may be included in responses
  applications_count?: number
  deadline?: string
  client?: {
    id: number | string
    name: string
    email: string
    location?: string
    company_name?: string
  }
  // add other fields returned by backend as needed
}

/* Application */
export interface Application {
  id: number | string
  gig: Gig | string | number
  gig_id?: number | string
  applicant_id?: number | string
  creative_id?: number | string
  status?: string
  applied_at?: string
  created_at?: string
  cover_letter?: string
  proposed_budget?: number
  proposed_timeline_weeks?: number
  // other application fields
}

/* Message / Conversation summary */
export interface MessageSummary {
  id: number | string
  name: string
  preview?: string
  time?: string
  unread?: boolean
  unread_count?: number
  // Backend conversation structure
  user?: User
  last_message?: Message
  updated_at?: string
}

/* Message with sender */
export interface MessageWithSender extends Message {
  sender: User
}

/* Full Message */
export interface Message {
  id: number | string
  content: string
  sender_id: number | string
  recipient_id: number | string
  is_read: boolean
  is_pinned: boolean
  is_favorite: boolean
  created_at: string
  read_at?: string
  reactions?: {
    [emoji: string]: number[] // user IDs who reacted with this emoji
  }
  forwarded_from_id?: string | null
  forwarded_from?: Message | null
  gig_id?: string
  application_id?: string
  sender?: User
  recipient?: User
}

/* Payment */
export interface Payment {
  id: number | string
  amount: number
  currency?: string
  status?: string
  created_at?: string
  gig_id?: number | string
  client_id?: number | string
  creative_id?: number | string
  milestone_description?: string
  released_at?: string
  stripe_payment_intent_id?: string
  // other payment metadata
}

/* Dashboard summary used by /dashboard/summary or similar endpoints */
export interface DashboardSummary {
  activeGigs?: number
  totalSpent?: number
  recentActivity?: { action: string; gig?: string; time?: string }[]
  // other aggregate fields
}

/* Notification */
export interface Notification {
  id: number | string
  title?: string
  body?: string
  read?: boolean
  created_at?: string
  // target, data payload etc.
}

export interface NotificationList {
  items: Notification[]
  total: number
  page: number
  pageSize: number
}

/* Notification Settings */
export interface NotificationSetting {
  id: string
  user_id: number
  email_gig_updates?: boolean
  email_messages?: boolean
  email_application_status?: boolean
  email_payment_updates?: boolean
  email_newsletter?: boolean
  in_app_gig_updates?: boolean
  in_app_messages?: boolean
  in_app_application_status?: boolean
  in_app_payment_updates?: boolean
  push_gig_updates?: boolean
  push_messages?: boolean
  push_application_status?: boolean
  push_payment_updates?: boolean
  created_at?: string
  updated_at?: string
}

/* Generic paginated response */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pages: number
  limit: number
  has_more: boolean
}

/* Gigs paginated response */
export interface GigsPaginatedResponse extends Paginated<Gig> {}

/* API Error shape (normalized) */
export interface APIError {
  status?: number
  message?: string
  errors?: Record<string, any>
  data?: any
}