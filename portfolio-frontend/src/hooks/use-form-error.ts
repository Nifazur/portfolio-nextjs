'use client'

import { useState, useCallback } from 'react'

interface FormErrors {
  [key: string]: string | string[]
}

export function useFormError() {
  const [errors, setErrors] = useState<FormErrors>({})

  const setFieldError = useCallback((field: string, message: string | string[]) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setApiErrors = useCallback((apiErrors: FormErrors) => {
    setErrors(apiErrors)
  }, [])

  const getFieldError = useCallback((field: string): string | undefined => {
    const error = errors[field]
    if (Array.isArray(error)) {
      return error[0]
    }
    return error
  }, [errors])

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setApiErrors,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0,
  }
}