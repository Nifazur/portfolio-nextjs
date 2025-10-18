/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      // httpOnly cookies are automatically sent with this request
      const response = await apiClient.get<User>('/auth/profile')
      setState({ user: response.data, loading: false, error: null })
    } catch (error: any) {
      setState({ user: null, loading: false, error: error.message })
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      // Login will set httpOnly cookies automatically via server action
      const response = await apiClient.post('/auth/login', { email, password })

      if (response.data) {
        // Fetch user profile after successful login
        await checkAuth()
        toast.success('Login successful!')
        router.push('/dashboard')
        return true
      }
      return false
    } catch (error: any) {
      setState(prev => ({ ...prev, loading: false, error: error.message }))
      toast.error(error.message || 'Login failed')
      return false
    }
  }, [router, checkAuth])

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to clear httpOnly cookies
      await apiClient.post('/auth/logout')
    } catch (error) {
      // Ignore logout errors
    } finally {
      setState({ user: null, loading: false, error: null })
      router.push('/login')
      toast.success('Logged out successfully')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    login,
    logout,
    checkAuth
  }
}