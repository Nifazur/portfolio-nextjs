/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface Blog {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  thumbnail?: string
  category: string
  tags: string[]
  isPublished: boolean
  isFeatured: boolean
  views: number
  readTime: number
  authorId: number
  author?: {
    id: number
    name: string
    email: string
    picture?: string
    bio?: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateBlogInput {
  title: string
  content: string
  excerpt?: string
  thumbnail?: string
  category: string
  tags: string[]
  isPublished?: boolean
  isFeatured?: boolean
}

export interface UpdateBlogInput extends Partial<CreateBlogInput> {}

export interface BlogsResponse {
  data: Blog[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}