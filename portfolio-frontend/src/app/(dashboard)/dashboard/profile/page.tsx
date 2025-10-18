// src/app/(dashboard)/dashboard/profile/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getProfile(token: string) {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      console.error('Failed to fetch profile:', response.status)
      return null
    }

    const data = await response.json()
    return data?.data || null
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  const profile = await getProfile(token)

  if (!profile) {
    redirect('/login')
  }

  return <ProfileClient initialProfile={profile} token={token} />
}