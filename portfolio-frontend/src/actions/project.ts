/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { CreateProjectInput } from '@/lib/validation'
import { Project } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function createProjectAction(data: CreateProjectInput) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/projects`, {
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
        message: result.message || 'Failed to create project',
      }
    }

    revalidatePath('/dashboard/projects')
    revalidatePath('/projects')
    revalidatePath('/')
    revalidateTag('projects')

    return {
      success: true,
      data: result.data as Project,
      message: result.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create project',
    }
  }
}

export async function updateProjectAction(id: number, data: Partial<CreateProjectInput>) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/projects/${id}`, {
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
        message: result.message || 'Failed to update project',
      }
    }

    revalidatePath('/dashboard/projects')
    revalidatePath('/projects')
    revalidatePath(`/projects/${result.data.slug}`)
    revalidatePath('/')
    revalidateTag('projects')
    revalidateTag(`project-${id}`)

    return {
      success: true,
      data: result.data as Project,
      message: result.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update project',
    }
  }
}

export async function deleteProjectAction(id: number) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to delete project',
      }
    }

    revalidatePath('/dashboard/projects')
    revalidatePath('/projects')
    revalidatePath('/')
    revalidateTag('projects')

    return {
      success: true,
      message: 'Project deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete project',
    }
  }
}