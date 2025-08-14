export type User = {
  id: string
  name: string
  email: string
  role: 'creative' | 'client' | 'admin'
  avatar?: string
  createdAt: string
}