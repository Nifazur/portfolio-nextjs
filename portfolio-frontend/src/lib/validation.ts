import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters'),
  excerpt: z
    .string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
})

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  images: z.array(z.string().url()).optional().default([]),
  liveUrl: z.string().url('Invalid live URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  technologies: z
    .array(z.string())
    .min(1, 'At least one technology is required'),
  category: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().optional().default(false),
  status: z
    .enum(['COMPLETED', 'IN_PROGRESS', 'PLANNED'])
    .optional()
    .default('COMPLETED'),
  features: z.array(z.string()).optional().default([]),
  challenges: z.string().optional(),
  learnings: z.string().optional(),
  order: z.number().optional().default(0),
})

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  subject: z
    .string()
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
})

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type CreateBlogInput = z.input<typeof createBlogSchema>
export type CreateProjectInput = z.input<typeof createProjectSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type ChangePasswordInput = z.input<typeof changePasswordSchema>