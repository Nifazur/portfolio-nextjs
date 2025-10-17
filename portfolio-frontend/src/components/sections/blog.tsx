/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Eye, ArrowRight, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// Fetch recent blogs with ISR
async function getRecentBlogs() {
  try {
    console.log('🔍 Fetching blogs from:', `${API_URL}/blogs?limit=6&isPublished=true`)
    
    const res = await fetch(`${API_URL}/blogs?limit=6&isPublished=true&sortBy=createdAt&sortOrder=desc`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    })

    console.log('📡 Response status:', res.status)

    if (!res.ok) {
      console.warn('⚠️ Failed to fetch recent blogs, status:', res.status)
      return []
    }

    const data = await res.json()
    console.log('📦 Raw API response:', data)
    
    // Handle nested data structure from API
    const blogs = data?.data?.data || data?.data || []
    console.log('✅ Extracted blogs:', blogs.length)
    
    return blogs
  } catch (error) {
    console.error('❌ Error fetching recent blogs:', error)
    return []
  }
}

// Format date helper
function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  } catch {
    return 'Unknown date'
  }
}

export async function BlogSection() {
  const blogs = await getRecentBlogs()

  console.log('🎨 Rendering BlogSection, blogs count:', blogs.length)

  // Don't return null - always show the section
  return (
    <section className="py-20 bg-muted/30" id="blog">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <p className="text-primary text-sm font-medium tracking-wider uppercase">
              Latest Insights
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Recent Blog Posts
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            Explore my latest thoughts, tutorials, and insights about web development, 
            programming, and technology.
          </p>
        </div>

        {/* Blogs Grid or Empty State */}
        {blogs && blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog: any) => (
                <Card 
                  key={blog.id} 
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Blog Image */}
                  <Link href={`/blogs/${blog.slug}`}>
                    <div className="relative h-48 overflow-hidden bg-muted">
                      {blog.thumbnail ? (
                        <Image
                          src={blog.thumbnail}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <BookOpen className="w-12 h-12" />
                        </div>
                      )}

                      {/* Overlays */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary">
                          {blog.category}
                        </Badge>
                      </div>

                      {blog.isFeatured && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>

                  <CardContent className="p-6">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{blog.readTime || 5} min read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{blog.views || 0} views</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href={`/blogs/${blog.slug}`}>
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {blog.excerpt || blog.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Read More Link */}
                    <Link 
                      href={`/blogs/${blog.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Button size="lg" asChild className="group">
                <Link href="/blogs">
                  View All Blog Posts
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Blog Posts Yet</h3>
            <p className="text-muted-foreground">Check back soon for exciting content!</p>
          </div>
        )}
      </div>
    </section>
  )
}