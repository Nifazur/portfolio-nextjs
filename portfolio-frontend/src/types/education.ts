export interface Education {
  id: number
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
  achievements: string[]
  grade?: string
  order: number
  createdAt: string
  updatedAt: string
}