/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface Project {
  id: number
  title: string
  slug: string
  description: string
  thumbnail: string
  images: string[]
  liveUrl?: string
  githubUrl?: string
  technologies: string[]
  category: string
  isFeatured: boolean
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED'
  startDate?: string
  endDate?: string
  features: string[]
  challenges?: string
  learnings?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateProjectInput {
  title: string
  description: string
  thumbnail: string
  images?: string[]
  liveUrl?: string
  githubUrl?: string
  technologies: string[]
  category: string
  isFeatured?: boolean
  status?: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED'
  startDate?: string
  endDate?: string
  features?: string[]
  challenges?: string
  learnings?: string
  order?: number
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface ProjectsResponse {
  data: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}