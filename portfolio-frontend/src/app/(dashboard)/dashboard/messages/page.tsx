// src/app/(dashboard)/dashboard/messages/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import MessagesClient from './MessagesClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getInitialMessages(token: string) {
  try {
    const response = await fetch(`${API_URL}/contact?sortBy=createdAt&sortOrder=desc`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error('Failed to fetch messages:', response.status)
      return []
    }

    const data = await response.json()
    return data?.data?.data || data?.data || []
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

export default async function MessagesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  const initialMessages = await getInitialMessages(token)

  return <MessagesClient initialMessages={initialMessages} token={token} />
}