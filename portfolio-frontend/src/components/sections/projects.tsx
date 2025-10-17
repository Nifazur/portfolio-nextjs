/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExternalLink, Github, Calendar, Filter, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// ISR: Fetch featured projects with dynamic revalidation
async function getFeaturedProjects() {
  try {
    const res = await fetch(`${API_URL}/projects/featured?limit=6`, {
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
    <section className="bg-background py-20" id="projects">
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
              <div
                key={project.id}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300"
              >
                {/* Project Image */}
                <div className="relative overflow-hidden">
                  {project.thumbnail ? (
                    <div className="relative w-full h-48">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 filter brightness-80"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-muted text-muted-foreground">
                      No image available
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Globe className="w-3 h-3 text-primary" />
                      <span className="text-xs text-muted-foreground">{project.category}</span>
                    </div>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      project.status === 'COMPLETED' 
                        ? 'bg-green-100/90 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                        : 'bg-yellow-100/90 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6">
                  {project.createdAt && (
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(project.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies && project.technologies.slice(0, 3).map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs font-medium">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors duration-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors duration-200"
                      >
                        <Github className="w-3 h-3" />
                        Code
                      </a>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="block w-full text-center px-3 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors duration-200"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Projects Found</h3>
              <p className="text-muted-foreground">No projects available yet.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        {projects && projects.length > 0 && (
          <div className="text-center bg-card border border-border rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Want to See More?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              These are just a few highlights from my portfolio. I&apos;m always working on new projects 
              and experimenting with the latest technologies. Let&apos;s connect and discuss your next project!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors duration-300"
              >
                Get In Touch
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-2 px-8 py-3 border border-border text-foreground rounded-full font-medium hover:border-primary/50 hover:text-primary transition-colors duration-300"
              >
                <Github className="w-4 h-4" />
                View All Projects
              </Link>
            </div>
          </div>
        )}
      </div>
      
      {/* Section Divider */}
      <hr className="mt-20 border-t border-muted-foreground/20" />
    </section>
  )
}