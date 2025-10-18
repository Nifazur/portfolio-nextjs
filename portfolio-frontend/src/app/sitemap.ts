export const dynamic = 'force-static' 
export const revalidate = 3600

import { Blog, Project } from '@/types'
import { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portfolio-backend-smoky-five.vercel.app/api/v1'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nifazur.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/#about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#projects`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#skills`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/#blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/#contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Fetch all blogs
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const blogsRes = await fetch(`${API_URL}/blogs?limit=100&isPublished=true`, {
      next: { revalidate: 3600 }
    })
    if (blogsRes.ok) {
      const blogsData = await blogsRes.json()
      const blogs = blogsData?.data?.data || blogsData?.data || []
      
      blogRoutes = blogs.map((blog: Blog) => ({
        url: `${SITE_URL}/blogs/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        changeFrequency: 'weekly' as const,
        priority: blog.isFeatured ? 0.9 : 0.7,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch blogs for sitemap:', error)
  }

  // Fetch all projects
  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const projectsRes = await fetch(`${API_URL}/projects?limit=100`, {
      next: { revalidate: 3600 }
    })
    if (projectsRes.ok) {
      const projectsData = await projectsRes.json()
      const projects = projectsData?.data?.data || projectsData?.data || []
      
      projectRoutes = projects.map((project: Project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: new Date(project.updatedAt || project.createdAt),
        changeFrequency: 'monthly' as const,
        priority: project.isFeatured ? 0.9 : 0.7,
      }))
    }
  } catch (error) {
    console.error('Failed to fetch projects for sitemap:', error)
  }

  return [...routes, ...blogRoutes, ...projectRoutes]
}