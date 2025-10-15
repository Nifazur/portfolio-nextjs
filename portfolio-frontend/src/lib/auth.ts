/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { cookies } from 'next/headers'
import { LoginInput } from '@/lib/validation'
import { User, LoginResponse } from '@/types'
import { API_URL } from '@/lib/server-api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function loginAction(credentials: LoginInput) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login failed',
        errors: data.errors,
      }
    }

    // Set cookies for auth tokens
    const cookieStore = await cookies()
    cookieStore.set('token', data.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    cookieStore.set('refreshToken', data.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return {
      success: true,
      data: data.data as LoginResponse,
      message: data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    }
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    cookieStore.delete('refreshToken')

    return {
      success: true,
      message: 'Logged out successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Logout failed',
    }
  }
}

export async function getProfileAction() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to fetch profile',
      }
    }

    return {
      success: true,
      data: data.data as User,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch profile',
    }
  }
}

export async function updateProfileAction(profileData: Record<string, any>) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update profile',
      }
    }

    return {
      success: true,
      data: data.data as User,
      message: data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update profile',
    }
  }
}

export async function changePasswordAction(passwords: {
  oldPassword: string
  newPassword: string
}) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return {
        success: false,
        message: 'Not authenticated',
      }
    }

    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to change password',
      }
    }

    return {
      success: true,
      message: data.message,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to change password',
    }
  }
}