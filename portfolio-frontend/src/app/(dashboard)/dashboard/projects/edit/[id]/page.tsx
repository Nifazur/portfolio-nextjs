/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createProjectSchema, type CreateProjectInput } from '@/lib/validation'
import { updateProjectAction } from '@/actions/project'
import { PROJECT_CATEGORIES, PROJECT_STATUS } from '@/lib/constants'
import { apiClient } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState('')
  const [images, setImages] = useState<string[]>([])
  const projectId = parseInt(params.id)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema)
  })

  const watchedValues = watch()

  useEffect(() => {
    fetchProject()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await apiClient.get(`/projects/${projectId}`)
      const project = response.data as CreateProjectInput
      
      reset({
        title: project.title,
        description: project.description,
        thumbnail: project.thumbnail,
        liveUrl: project.liveUrl || '',
        githubUrl: project.githubUrl || '',
        category: project.category,
        status: project.status,
        technologies: project.technologies || [],
        features: project.features || [],
        images: project.images || [],
        challenges: project.challenges || '',
        learnings: project.learnings || '',
        order: project.order || 0,
        isFeatured: project.isFeatured
      })
      
      setTechnologies(project.technologies || [])
      setFeatures(project.features || [])
      setImages(project.images || [])
    } catch (error) {
      toast.error('Failed to fetch project')
      router.push('/dashboard/projects')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreateProjectInput) => {
    if (technologies.length === 0) {
      toast.error('Please add at least one technology')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await updateProjectAction(projectId, {
        ...data,
        technologies,
        features,
        images
      })

      if (result.success) {
        toast.success('Project updated successfully!')
        router.push('/dashboard/projects')
      } else {
        toast.error(result.message || 'Failed to update project')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      const newTechs = [...technologies, techInput.trim()]
      setTechnologies(newTechs)
      setValue('technologies', newTechs)
      setTechInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    const newTechs = technologies.filter(t => t !== tech)
    setTechnologies(newTechs)
    setValue('technologies', newTechs)
  }

  const handleAddFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      const newFeatures = [...features, featureInput.trim()]
      setFeatures(newFeatures)
      setValue('features', newFeatures)
      setFeatureInput('')
    }
  }

  const handleRemoveFeature = (feature: string) => {
    const newFeatures = features.filter(f => f !== feature)
    setFeatures(newFeatures)
    setValue('features', newFeatures)
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">
            Update project details
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
                placeholder="Project title"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your project"
                rows={4}
                {...register('description')}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map((category) => (
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
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watchedValues.status}
                  onValueChange={(value: 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED') => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUS.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL *</Label>
              <Input
                id="thumbnail"
                placeholder="https://example.com/thumbnail.jpg"
                {...register('thumbnail')}
                className={errors.thumbnail ? 'border-destructive' : ''}
              />
              {errors.thumbnail && (
                <p className="text-xs text-destructive">{errors.thumbnail.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <CardTitle>Technologies *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a technology"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTech()
                  }
                }}
              />
              <Button type="button" onClick={handleAddTech}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    {tech}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
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
                <Label htmlFor="isFeatured">Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Show this project in featured section
                </p>
              </div>
              <Switch
                id="isFeatured"
                checked={watchedValues.isFeatured}
                onCheckedChange={(checked) => setValue('isFeatured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/projects">Cancel</Link>
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
                Update Project
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}