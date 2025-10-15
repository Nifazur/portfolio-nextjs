/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { ContactInput } from '@/lib/validation'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export async function sendContactMessageAction(data: ContactInput) {
  try {
    const response = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to send message',
        errors: result.errors,
      }
    }

    return {
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    }
  }
}