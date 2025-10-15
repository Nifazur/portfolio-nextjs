/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { CreateBlogInput } from '@/lib/validation'
import { Blog } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function createBlogAction(data: CreateBlogInput) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to create blog',
      }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath('/blogs')
    revalidateTag('blogs')

    return {
      success: true,
      data: result.data as Blog,
      message: result.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create blog',
    }
  }
}

export async function updateBlogAction(id: number, data: Partial<CreateBlogInput>) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to update blog',
      }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath('/blogs')
    revalidatePath(`/blogs/${result.data.slug}`)
    revalidateTag('blogs')
    revalidateTag(`blog-${id}`)

    return {
      success: true,
      data: result.data as Blog,
      message: result.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update blog',
    }
  }
}

export async function deleteBlogAction(id: number) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to delete blog',
      }
    }

    revalidatePath('/dashboard/blogs')
    revalidatePath('/blogs')
    revalidateTag('blogs')

    return {
      success: true,
      message: 'Blog deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete blog',
    }
  }
}