'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { createBlogSchema, type CreateBlogInput } from '@/lib/validation'
import { createBlogAction } from '@/actions/blog'
import { BLOG_CATEGORIES } from '@/lib/constants'
import toast from 'react-hot-toast'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamic import for TipTap (client-side only)
const DynamicEditor = dynamic(() => 
  import('@/components/editor/TipTapEditor').then(mod => ({ default: mod.TipTapEditor })),
  { 
    ssr: false,
    loading: () => <div className="h-80 bg-muted rounded-md flex items-center justify-center text-muted-foreground">Loading editor...</div>
  }
)

export default function CreateBlogPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [content, setContent] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateBlogInput>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      excerpt: '',
      thumbnail: '',
      tags: [],
      isPublished: false,
      isFeatured: false
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: CreateBlogInput) => {
    // Validate content
    if (!content || content.length < 50) {
      toast.error('Content must be at least 50 characters')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createBlogAction({
        ...data,
        content, // Use rich editor content
        tags
      })

      if (result.success) {
        toast.success('Blog created successfully!')
        router.push('/dashboard/blogs')
      } else {
        toast.error(result.message || 'Failed to create blog')
      }
    } catch (error) {
      console.error('Create Blog Error:', error)
      toast.error('An error occurred while creating blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()]
      setTags(newTags)
      setValue('tags', newTags)
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    setValue('tags', newTags)
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
          <h1 className="text-3xl font-bold tracking-tight">Create Blog</h1>
          <p className="text-muted-foreground">
            Write a new blog post with rich formatting
          </p>
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
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                placeholder="Brief description of the blog"
                {...register('excerpt')}
                className={errors.excerpt ? 'border-destructive' : ''}
              />
              {errors.excerpt && (
                <p className="text-xs text-destructive">{errors.excerpt.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={watchedValues.category || ''}
                  onValueChange={(value) => setValue('category', value)}
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
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  placeholder="https://example.com/image.jpg"
                  {...register('thumbnail')}
                  className={errors.thumbnail ? 'border-destructive' : ''}
                />
                {errors.thumbnail && (
                  <p className="text-xs text-destructive">{errors.thumbnail.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rich Text Editor */}
        <Card>
          <CardHeader>
            <CardTitle>Content *</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Write your blog content with rich formatting options
            </p>
          </CardHeader>
          <CardContent>
            <DynamicEditor
              value={content}
              onChangeAction={setContent}
              placeholder="Start writing your blog post..."
            />
            {!content && errors.content && (
              <p className="text-xs text-destructive mt-2">{errors.content.message}</p>
            )}
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {content ? `${content.replace(/<[^>]*>/g, '').length} characters` : '0 characters'}
              </p>
              <p className={`text-xs ${content && content.length < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                Minimum: 50 characters
              </p>
            </div>
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
                <p className="text-sm text-muted-foreground">
                  Make this blog visible to the public
                </p>
              </div>
              <Switch
                id="isPublished"
                checked={watchedValues.isPublished || false}
                onCheckedChange={(checked) => setValue('isPublished', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isFeatured">Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Show this blog in featured section
                </p>
              </div>
              <Switch
                id="isFeatured"
                checked={watchedValues.isFeatured || false}
                onCheckedChange={(checked) => setValue('isFeatured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/blogs">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Blog
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}