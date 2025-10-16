'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Filter, Search, ExternalLink, Github } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { apiClient } from '@/lib/api'
import { Project } from '@/types'


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'featured'>('newest')

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<{ data: Project[] }>('/projects?limit=50')
      if (Array.isArray(response.data?.data)) {
        setProjects(response.data.data)
      } else if (Array.isArray(response.data)) {
        setProjects(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get<{ data: { name: string }[] }>('/projects/categories')
      const categoryNames = response.data?.data?.map((cat) => cat.name) || []
      setCategories(categoryNames)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = 
        selectedCategory === 'all' || project.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  if (loading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            My Projects
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            A complete showcase of all my projects, showcasing various technologies and approaches
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'newest' | 'featured')}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="featured">Featured First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Card 
                key={project.id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                    {project.isFeatured && (
                      <Badge className="bg-primary">Featured</Badge>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge 
                      variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                    </h3>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies && project.technologies.slice(0, 4).map((tech: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies && project.technologies.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 4}
                      </Badge>
                    )}
                  </div>

                  {/* Features Preview */}
                  {project.features && project.features.length > 0 && (
                    <div className="mb-4 pb-4 border-b border-border">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Features:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {project.features.slice(0, 2).map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-2 mb-4">
                    {project.liveUrl && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Live
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-3 h-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* View Details */}
                  <Button variant="ghost" size="sm" className="w-full" asChild>
                    <Link href={`/projects/${project.slug}`}>
                      View Details →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">No projects found matching your criteria.</p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-center text-sm text-muted-foreground mb-8">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>
    </div>
  )
}