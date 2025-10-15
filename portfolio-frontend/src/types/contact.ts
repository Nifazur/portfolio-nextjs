export interface ContactMessage {
  id: number
  name: string
  email: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContactMessageInput {
  name: string
  email: string
  subject?: string
  message: string
}