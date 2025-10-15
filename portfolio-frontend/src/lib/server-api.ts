import { cookies } from 'next/headers'
import { ApiResponse, ApiError } from '@/types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function serverFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    const data = await response.json()

    if (!response.ok) {
      throw {
        success: false,
        statusCode: response.status,
        message: data.message || 'Request failed',
        errors: data.errors,
      } as ApiError
    }

    return data
  } catch (error) {
    if ((error as ApiError).statusCode) {
      throw error
    }
    throw {
      success: false,
      statusCode: 500,
      message: 'Network error',
    } as ApiError
  }
}