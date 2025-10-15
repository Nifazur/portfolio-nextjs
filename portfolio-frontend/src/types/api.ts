/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  success: boolean
  statusCode: number
  message: string
  data: T
}

export interface ApiError {
  success: false
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  tags?: string[]
  isPublished?: boolean
  isFeatured?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}