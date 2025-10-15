export interface Experience {
  id: number
  company: string
  position: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
  achievements: string[]
  technologies: string[]
  order: number
  createdAt: string
  updatedAt: string
}