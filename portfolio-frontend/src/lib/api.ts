/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse, ApiError } from '@/types'
import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export class ApiClient {
  private static instance: ApiClient
  private token: string | null = null

  private constructor() {
    this.loadToken()
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = Cookies.get('token') || null
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      Cookies.set('token', token, { expires: 7 })
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      Cookies.remove('token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`
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

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(url: string, body: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(url: string, body: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async patch<T>(url: string, body: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' })
  }
}

export const apiClient = ApiClient.getInstance()