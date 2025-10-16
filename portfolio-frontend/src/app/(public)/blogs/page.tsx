/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, Eye, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// ISR Configuration
export const revalidate = 60 // Revalidate every 60 seconds

async function getBlogs(page = 1, limit = 9) {
  try {
    const url = new URL(`${API_URL}/blogs`)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('limit', limit.toString())
    url.searchParams.set('isPublished', 'true')
    url.searchParams.set('sortBy', 'createdAt')
    url.searchParams.set('sortOrder', 'desc')

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // ISR revalidation
    })

    if (!res.ok) {
      console.warn(`⚠️ Failed to fetch blogs: ${res.status}`)
      return { data: [], pagination: null }
    }

    const response = await res.json()
    return response?.data || { data: [], pagination: null }
  } catch (error) {
    console.error('❌ Error fetching blogs:', error)
    return { data: [], pagination: null }
  }
}

function BlogsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-20 w-full mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || '1')
  const result = await getBlogs(page)
  const blogs = result.data || []
  const pagination = result.pagination

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Blog & Articles
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Thoughts, tutorials, and insights about web development, programming, and technology.
          </p>
        </div>

        {/* Blogs Grid */}
        <Suspense fallback={<BlogsLoadingSkeleton />}>
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogs.map((blog: any) => (
                  <Card 
                    key={blog.id} 
                    className="group overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Blog Image */}
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
                          No image
                        </div>
                      )}
                      {blog.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-primary">Featured</Badge>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                          {blog.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{blog.readTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{blog.views}</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {blog.excerpt || blog.content?.substring(0, 150)}...
                      </p>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button variant="ghost" className="group/btn p-0 h-auto font-medium" asChild>
                        <Link href={`/blogs/${blog.slug}`}>
                          Read more
                          <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  {page > 1 && (
                    <Button variant="outline" asChild>
                      <Link href={`/blogs?page=${page - 1}`}>Previous</Link>
                    </Button>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, i) => {
                      const pageNum = i + 1
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === page ? 'default' : 'outline'}
                            size="sm"
                            asChild
                          >
                            <Link href={`/blogs?page=${pageNum}`}>{pageNum}</Link>
                          </Button>
                        )
                      }
                      if (pageNum === page - 2 || pageNum === page + 2) {
                        return <span key={pageNum}>...</span>
                      }
                      return null
                    })}
                  </div>

                  {page < pagination.totalPages && (
                    <Button variant="outline" asChild>
                      <Link href={`/blogs?page=${page + 1}`}>Next</Link>
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No blogs found.</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}