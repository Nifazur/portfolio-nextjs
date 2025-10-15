/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'


import { createBlogSchema, type CreateBlogInput } from '@/lib/validation'
import { updateBlogAction } from '@/actions/blog'
import { BLOG_CATEGORIES } from '@/lib/constants'
import { apiClient } from '@/lib/api'
import { type Blog } from '@/types'

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const blogId = Number(resolvedParams.id)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      thumbnail: '',
      category: '',
      tags: [],
      isPublished: false,
      isFeatured: false,
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (!Number.isFinite(blogId)) {
      toast.error('Invalid blog id')
      router.push('/dashboard/blogs')
      return
    }

    let isMounted = true

    const fetchBlog = async () => {
      try {
        const response = await apiClient.get<Blog>(`/blogs/${blogId}`)
        const blog = response.data

        if (!isMounted) return
        reset({
          title: blog.title,
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          thumbnail: blog.thumbnail || '',
          category: blog.category,
          tags: blog.tags || [],
          isPublished: blog.isPublished,
          isFeatured: blog.isFeatured,
        })

        setTags(blog.tags || [])
      } catch (error) {
        toast.error('Failed to fetch blog')
        router.push('/dashboard/blogs')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchBlog()
    return () => {
      isMounted = false
    }
  }, [blogId, reset, router])

  const onSubmit = async (data: CreateBlogInput) => {


    setIsSubmitting(true)
    try {
      const result = await updateBlogAction(blogId, {
        ...data,
        tags,
      })

      if (result.success) {
        toast.success('Blog updated successfully!')
        router.push('/dashboard/blogs')
      } else {
        toast.error(result.message || 'Failed to update blog')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    const value = tagInput.trim()
    if (!value) return
    if (tags.includes(value)) {
      setTagInput('')
      return
    }
    const newTags = [...tags, value]
    setTags(newTags)
    setValue('tags', newTags, { shouldValidate: true })
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(newTags)
    setValue('tags', newTags, { shouldValidate: true })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog</h1>
          <p className="text-muted-foreground">Update your blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter blog title"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief description of the blog"
                rows={3}
                {...register('excerpt')}
                className={errors.excerpt ? 'border-destructive' : ''}
              />
              {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={watchedValues.category ?? undefined}
                  onValueChange={(value) => setValue('category', value, { shouldValidate: true, shouldDirty: true })}
                >
                  <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  {...register('thumbnail')}
                  className={errors.thumbnail ? 'border-destructive' : ''}
                />
                {errors.thumbnail && <p className="text-xs text-destructive">{errors.thumbnail.message}</p>}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                      title="Click to remove"
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Editor (Textarea) */}
        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="content"
              placeholder="Write your content..."
              {...register('content')}
              rows={16}
              className={errors.content ? 'border-destructive' : ''}
            />
            {errors.content && <p className="text-xs text-destructive mt-2">{errors.content.message}</p>}
          </CardContent>
        </Card>

        {/* Publishing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublished">Publish</Label>
                <p className="text-sm text-muted-foreground">Make this blog visible to the public</p>
              </div>
              <Switch
                id="isPublished"
                checked={!!watchedValues.isPublished}
                onCheckedChange={(checked) => setValue('isPublished', checked, { shouldDirty: true })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured</Label>
                <p className="text-sm text-muted-foreground">Show this blog in featured section</p>
              </div>
              <Switch
                id="isFeatured"
                checked={!!watchedValues.isFeatured}
                onCheckedChange={(checked) => setValue('isFeatured', checked, { shouldDirty: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild disabled={isSubmitting}>
            <Link href="/dashboard/blogs">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Blog
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}