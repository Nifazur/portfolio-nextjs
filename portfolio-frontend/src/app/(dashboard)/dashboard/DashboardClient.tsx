/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboard)/dashboard/DashboardClient.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FolderOpen, MessageSquare, Eye, Clock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

interface DashboardData {
  stats: {
    blogs: any
    projects: any
    messages: any
  }
  recentBlogs: any[]
  recentMessages: any[]
}

export default function DashboardClient({ 
  initialData, 
  token 
}: { 
  initialData: DashboardData
  token: string 
}) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchUpdates = async () => {
    try {
      setLoading(true)
      const headers = { Authorization: `Bearer ${token}` }
      
      const [statsRes, blogsRes, messagesRes] = await Promise.all([
        fetch(`${API_URL}/contact/stats`, { headers }),
        fetch(`${API_URL}/blogs?limit=5&sortBy=createdAt&sortOrder=desc`, { headers }),
        fetch(`${API_URL}/contact?limit=5&sortBy=createdAt&sortOrder=desc`, { headers })
      ])

      const [stats, blogs, messages] = await Promise.all([
        statsRes.ok ? statsRes.json() : { data: null },
        blogsRes.ok ? blogsRes.json() : { data: null },
        messagesRes.ok ? messagesRes.json() : { data: null }
      ])

      setData(prev => ({
        stats: {
          ...prev.stats,
          messages: stats?.data || prev.stats.messages
        },
        recentBlogs: Array.isArray(blogs?.data?.data) ? blogs.data.data.slice(0, 5) : 
                     Array.isArray(blogs?.data) ? blogs.data.slice(0, 5) : prev.recentBlogs,
        recentMessages: Array.isArray(messages?.data?.data) ? messages.data.data.slice(0, 5) : 
                        Array.isArray(messages?.data) ? messages.data.slice(0, 5) : prev.recentMessages
      }))
    } catch (error) {
      console.error('Failed to fetch updates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Set up interval for polling
    intervalRef.current = setInterval(fetchUpdates, 30000)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const statsCards = [
    {
      title: 'Total Blogs',
      value: data.stats.blogs.totalBlogs || 0,
      description: `${data.stats.blogs.publishedBlogs || 0} published`,
      icon: FileText,
      href: '/dashboard/blogs',
      color: 'text-blue-500'
    },
    {
      title: 'Total Projects',
      value: data.stats.projects.totalProjects || 0,
      description: `${data.stats.projects.featuredProjects || 0} featured`,
      icon: FolderOpen,
      href: '/dashboard/projects',
      color: 'text-green-500'
    },
    {
      title: 'Messages',
      value: data.stats.messages.total || 0,
      description: `${data.stats.messages.unread || 0} unread`,
      icon: MessageSquare,
      href: '/dashboard/messages',
      color: 'text-purple-500'
    },
    {
      title: 'Total Views',
      value: data.stats.blogs.totalViews || 0,
      description: 'Blog views',
      icon: Eye,
      href: '/dashboard',
      color: 'text-orange-500'
    }
  ]

  const formatDate = (date: string) => {
    if (!date) return 'Unknown'
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your portfolio.
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Updating...
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/dashboard/blogs/create">
                <FileText className="mr-2 h-4 w-4" />
                New Blog Post
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/projects/create">
                <FolderOpen className="mr-2 h-4 w-4" />
                Add Project
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Messages
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Blogs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Blogs</CardTitle>
                <CardDescription>Your latest blog posts</CardDescription>
              </div>
              <Link href="/dashboard/blogs">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentBlogs && data.recentBlogs.length > 0 ? (
                data.recentBlogs.map((blog: any) => (
                  <Link 
                    key={blog._id || blog.id} 
                    href={`/dashboard/blogs/${blog._id || blog.id}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="mt-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                          {truncateText(blog.title || 'Untitled', 50)}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant={blog.isPublished ? "default" : "secondary"} 
                            className="text-xs h-5"
                          >
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(blog.createdAt || blog.publishedAt)}
                          </span>
                          {(blog.views !== undefined) && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {blog.views}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No recent blogs to display
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/blogs/create">
                      <FileText className="mr-2 h-4 w-4" />
                      Create Your First Blog
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest contact form submissions</CardDescription>
              </div>
              <Link href="/dashboard/messages">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentMessages && data.recentMessages.length > 0 ? (
                data.recentMessages.map((message: any) => (
                  <Link 
                    key={message._id || message.id} 
                    href="/dashboard/messages"
                    className="block group"
                  >
                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                      <div className="mt-1">
                        <Mail className={cn(
                          "h-4 w-4",
                          !message.isRead ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <h4 className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                            {message.name || 'Anonymous'}
                          </h4>
                          {!message.isRead && (
                            <Badge variant="default" className="text-xs h-5">
                              New
                            </Badge>
                          )}
                        </div>
                        {message.subject && (
                          <p className="text-xs font-medium text-muted-foreground">
                            {truncateText(message.subject, 40)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {truncateText(message.message || '', 80)}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          {message.email && (
                            <span className="text-xs text-muted-foreground">
                              {truncateText(message.email, 30)}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    No recent messages to display
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Messages from your contact form will appear here
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}