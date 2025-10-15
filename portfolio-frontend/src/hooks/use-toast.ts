'use client'

import { useCallback } from 'react'
import toast from 'react-hot-toast'

export function useToast() {
  const success = useCallback((message: string) => {
    toast.success(message, {
      style: {
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
      },
    })
  }, [])

  const error = useCallback((message: string) => {
    toast.error(message, {
      style: {
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--destructive))',
      },
    })
  }, [])

  const loading = useCallback((message: string) => {
    return toast.loading(message, {
      style: {
        background: 'hsl(var(--background))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--border))',
      },
    })
  }, [])

  const promise = useCallback(
    <T,>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string
        error: string
      }
    ) => {
      return toast.promise(promise, messages, {
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      })
    },
    []
  )

  const dismiss = useCallback((toastId?: string) => {
    toast.dismiss(toastId)
  }, [])

  return {
    success,
    error,
    loading,
    promise,
    dismiss,
    toast,
  }
}