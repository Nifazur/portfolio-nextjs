// src/app/(dashboard)/dashboard/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getDashboardData(token: string) {
  try {
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
    
    const [blogsRes, projectsRes, messagesRes, recentBlogsRes, recentMessagesRes] = await Promise.all([
      fetch(`${API_URL}/blogs/stats`, { 
        headers, 
        cache: 'no-store'
      }),
      fetch(`${API_URL}/projects/stats`, { 
        headers, 
        cache: 'no-store'
      }),
      fetch(`${API_URL}/contact/stats`, { 
        headers, 
        cache: 'no-store'
      }),
      fetch(`${API_URL}/blogs?limit=5&sortBy=createdAt&sortOrder=desc`, { 
        headers, 
        cache: 'no-store'
      }),
      fetch(`${API_URL}/contact?limit=5&sortBy=createdAt&sortOrder=desc`, { 
        headers, 
        cache: 'no-store'
      })
    ])

    // Check for auth errors
    if (blogsRes.status === 401 || projectsRes.status === 401 || messagesRes.status === 401) {
      redirect('/login')
    }

    const [blogs, projects, messages, recentBlogs, recentMessages] = await Promise.all([
      blogsRes.ok ? blogsRes.json() : { data: {} },
      projectsRes.ok ? projectsRes.json() : { data: {} },
      messagesRes.ok ? messagesRes.json() : { data: {} },
      recentBlogsRes.ok ? recentBlogsRes.json() : { data: { data: [] } },
      recentMessagesRes.ok ? recentMessagesRes.json() : { data: { data: [] } }
    ])

    return {
      stats: {
        blogs: blogs.data || {},
        projects: projects.data || {},
        messages: messages.data || {}
      },
      recentBlogs: Array.isArray(recentBlogs.data?.data) ? recentBlogs.data.data.slice(0, 5) : 
                    Array.isArray(recentBlogs.data) ? recentBlogs.data.slice(0, 5) : [],
      recentMessages: Array.isArray(recentMessages.data?.data) ? recentMessages.data.data.slice(0, 5) : 
                      Array.isArray(recentMessages.data) ? recentMessages.data.slice(0, 5) : []
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    return {
      stats: { blogs: {}, projects: {}, messages: {} },
      recentBlogs: [],
      recentMessages: []
    }
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) {
    redirect('/login')
  }

  const data = await getDashboardData(token)

  return <DashboardClient initialData={data} token={token} />
}