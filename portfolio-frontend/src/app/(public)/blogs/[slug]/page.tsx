/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Eye, User, ArrowLeft, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// ISR Configuration
export const revalidate = 60 // Revalidate every 60 seconds

// Pre-generate static params at build time
export async function generateStaticParams() {
  try {
    console.log('🔨 Generating static blog params...')
    
    const res = await fetch(`${API_URL}/blogs?limit=100&isPublished=true`, {
      // Cache this for 1 hour during build
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.warn(`⚠️ Failed to fetch blogs for static generation: ${res.status}`)
      return [] // Fallback to on-demand ISR
    }

    const data = await res.json()
    
    // Safely access nested data structure
    const blogs = data?.data?.data || []
    
    if (!Array.isArray(blogs)) {
      console.warn('⚠️ Invalid blogs data structure')
      return []
    }

    const params = blogs.map((blog: any) => ({
      slug: String(blog.slug),
    }))

    console.log(`✅ Generated static params for ${params.length} blogs`)
    return params
  } catch (error) {
    console.error('❌ Error generating static params:', error)
    return [] // Fallback - pages will be generated on-demand
  }
}

// Fetch blog data
async function getBlog(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blogs/slug/${slug}`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    })

    if (!res.ok) {
      console.warn(`⚠️ Blog not found: ${slug}`)
      return null
    }

    const data = await res.json()
    return data?.data // Safely access data
  } catch (error) {
    console.error(`❌ Error fetching blog ${slug}:`, error)
    return null
  }
}

// Fetch related blogs
async function getRelatedBlogs(category: string, currentSlug: string) {
  try {
    const res = await fetch(
      `${API_URL}/blogs?category=${encodeURIComponent(category)}&limit=3&isPublished=true`,
      { next: { revalidate: 60 } }
    )
    
    if (!res.ok) return []
    
    const data = await res.json()
    const blogs = data?.data?.data || []
    
    return blogs.filter((blog: any) => blog.slug !== currentSlug)
  } catch (error) {
    console.error('❌ Error fetching related blogs:', error)
    return []
  }
}

// Generate metadata dynamically
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug)
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The blog post you are looking for does not exist.',
    }
  }

  return {
    title: `${blog.title} | My Portfolio`,
    description: blog.excerpt || blog.content?.substring(0, 160) || 'Read my latest blog post',
    keywords: blog.tags?.join(', ') || '',
    authors: blog.author ? [{ name: blog.author.name }] : [],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160),
      type: 'article',
      publishedTime: blog.createdAt,
      authors: blog.author?.name ? [blog.author.name] : [],
      images: blog.thumbnail 
        ? [
            {
              url: blog.thumbnail,
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160),
      images: blog.thumbnail ? [blog.thumbnail] : [],
    },
  }
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug)

  // Show 404 if blog not found
  if (!blog) {
    notFound()
  }

  const relatedBlogs = await getRelatedBlogs(blog.category, blog.slug)

  return (
    <article className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-8" asChild>
          <Link href="/blogs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
        </Button>

        {/* Blog Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{blog.category}</Badge>
            {blog.isFeatured && <Badge variant="secondary">Featured</Badge>}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {blog.author && (
              <div className="flex items-center gap-2">
                {blog.author.picture ? (
                  <Image
                    src={blog.author.picture}
                    alt={blog.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="font-medium">{blog.author.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{blog.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string, index: number) => (
                <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {blog.thumbnail && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={blog.thumbnail}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Blog Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Author Bio */}
        {blog.author && blog.author.bio && (
          <Card className="mb-12">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {blog.author.picture ? (
                  <Image
                    src={blog.author.picture}
                    alt={blog.author.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground mb-1">About the Author</h3>
                  <p className="font-medium text-foreground mb-2">{blog.author.name}</p>
                  <p className="text-sm text-muted-foreground">{blog.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Blogs */}
        {relatedBlogs && relatedBlogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.slice(0, 3).map((relatedBlog: any) => (
                <Card key={relatedBlog.id} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <Badge className="mb-2">{relatedBlog.category}</Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {relatedBlog.excerpt || relatedBlog.content?.substring(0, 100)}
                    </p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                      <Link href={`/blogs/${relatedBlog.slug}`}>
                        Read more →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}