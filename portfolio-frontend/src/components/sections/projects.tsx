/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink, Github, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// ISR: Fetch featured projects with dynamic revalidation
async function getFeaturedProjects() {
  try {
    const res = await fetch(`${API_URL}/projects/featured?limit=6`, {
      // ✅ FIXED: Use ISR with proper revalidation
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!res.ok) {
      console.warn('⚠️ Failed to fetch featured projects')
      return []
    }

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('❌ Error fetching featured projects:', error)
    return []
  }
}

// Get project categories for filtering
async function getProjectCategories() {
  try {
    const res = await fetch(`${API_URL}/projects/categories`, {
      next: { revalidate: 3600 } // Cache categories for 1 hour
    })

    if (!res.ok) return []

    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return []
  }
}

export async function ProjectsSection() {
  // Fetch projects and categories in parallel
  const [projects, categories] = await Promise.all([
    getFeaturedProjects(),
    getProjectCategories()
  ])

  return (
    <section className="py-20" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
            Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            A showcase of my recent work across different domains. From web applications to mobile apps,
            each project represents a unique challenge and learning experience.
          </p>
        </div>

        {/* Category Filter Info */}
        {categories && categories.length > 0 && (
          <div className="mb-12 p-4 bg-muted/50 rounded-lg border border-border text-center">
            <p className="text-sm text-muted-foreground">
              <Filter className="w-4 h-4 inline mr-2" />
              View all projects by category on the projects page
            </p>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects && projects.length > 0 ? (
            projects.map((project: any) => (
              <Card
                key={project.id}
                className="group overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Project Image */}
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
                      No image available
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}
                      className="backdrop-blur-sm"
                    >
                      {project.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies && project.technologies.slice(0, 3).map((tech: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  {project.features && project.features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground font-medium mb-2">Key Features:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {project.features.slice(0, 2).map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    {project.liveUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Preview
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
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

                  {/* View Details Button */}
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
              <p className="text-muted-foreground">No projects available yet.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {projects && projects.length > 0 && (
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/projects">
                View All Projects
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}