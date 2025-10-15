/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { apiClient } from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      setLoading(true)
      const token = apiClient.getToken()
      
      if (!token) {
        setUser(null)
        return
      }

      const response = await apiClient.get<User>('/auth/profile')
      setUser(response.data)
    } catch (error) {
      setUser(null)
      apiClient.clearToken()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}