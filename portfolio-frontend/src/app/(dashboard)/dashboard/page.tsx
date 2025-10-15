import { cookies } from 'next/headers'
import DashboardClient from './DashboardClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getDashboardData(token: string) {
  try {
    const headers = { Authorization: `Bearer ${token}` }
    
    const [blogsRes, projectsRes, messagesRes, recentBlogsRes, recentMessagesRes] = await Promise.all([
      fetch(`${API_URL}/blogs/stats`, { headers, cache: 'no-store' }),
      fetch(`${API_URL}/projects/stats`, { headers, cache: 'no-store' }),
      fetch(`${API_URL}/contact/stats`, { headers, cache: 'no-store' }),
      fetch(`${API_URL}/blogs?limit=5&sort=-createdAt`, { headers, cache: 'no-store' }),
      fetch(`${API_URL}/contact?limit=5&sort=-createdAt`, { headers, cache: 'no-store' })
    ])

    const [blogs, projects, messages, recentBlogs, recentMessages] = await Promise.all([
      blogsRes.ok ? blogsRes.json() : { data: {} },
      projectsRes.ok ? projectsRes.json() : { data: {} },
      messagesRes.ok ? messagesRes.json() : { data: {} },
      recentBlogsRes.ok ? recentBlogsRes.json() : { data: [] },
      recentMessagesRes.ok ? recentMessagesRes.json() : { data: [] }
    ])

    return {
      stats: {
        blogs: blogs.data || {},
        projects: projects.data || {},
        messages: messages.data || {}
      },
      recentBlogs: Array.isArray(recentBlogs.data) ? recentBlogs.data.slice(0, 5) : [],
      recentMessages: Array.isArray(recentMessages.data) ? recentMessages.data.slice(0, 5) : []
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
  const token = cookieStore.get('token')?.value || ''

  const data = await getDashboardData(token)

  return <DashboardClient initialData={data} token={token} />
}