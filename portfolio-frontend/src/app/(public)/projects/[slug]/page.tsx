/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, Github, Calendar, Check, AlertCircle, Lightbulb, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

// ISR Configuration
export const revalidate = 60

// Pre-generate static params at build time
export async function generateStaticParams() {
  try {
    console.log('🔨 Generating static project params...')
    
    const res = await fetch(`${API_URL}/projects?limit=100`, {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.warn(`⚠️ Failed to fetch projects for static generation: ${res.status}`)
      return []
    }

    const data = await res.json()
    const projects = data?.data?.data || []

    if (!Array.isArray(projects)) {
      console.warn('⚠️ Invalid projects data structure')
      return []
    }

    const params = projects.map((project: any) => ({
      slug: String(project.slug),
    }))

    console.log(`✅ Generated static params for ${params.length} projects`)
    return params
  } catch (error) {
    console.error('❌ Error generating static params:', error)
    return []
  }
}

// Fetch project data
async function getProject(slug: string) {
  try {
    const res = await fetch(`${API_URL}/projects/slug/${slug}`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    })

    if (!res.ok) {
      console.warn(`⚠️ Project not found: ${slug}`)
      return null
    }

    const data = await res.json()
    return data?.data
  } catch (error) {
    console.error(`❌ Error fetching project ${slug}:`, error)
    return null
  }
}

// Fetch related projects
async function getRelatedProjects(category: string, currentSlug: string) {
  try {
    const res = await fetch(
      `${API_URL}/projects?category=${encodeURIComponent(category)}&limit=3`,
      { next: { revalidate: 60 } }
    )
    
    if (!res.ok) return []
    
    const data = await res.json()
    const projects = data?.data?.data || []
    
    return projects.filter((p: any) => p.slug !== currentSlug)
  } catch (error) {
    console.error('❌ Error fetching related projects:', error)
    return []
  }
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The project you are looking for does not exist.',
    }
  }

  return {
    title: `${project.title} | My Portfolio`,
    description: project.description || 'Check out this amazing project',
    keywords: [...(project.technologies || []), project.category].join(', '),
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
      images: project.thumbnail
        ? [
            {
              url: project.thumbnail,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  const relatedProjects = await getRelatedProjects(project.category, project.slug)

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-8" asChild>
          <Link href="/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{project.category}</Badge>
            {project.isFeatured && <Badge variant="secondary">Featured</Badge>}
            <Badge variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">
            {project.description}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            {project.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {formatDate(project.startDate)}
                  {project.endDate && ` - ${formatDate(project.endDate)}`}
                  {!project.endDate && ' - Present'}
                </span>
              </div>
            )}
          </div>

          {/* Project Links */}
          <div className="flex gap-4">
            {project.liveUrl && (
              <Button asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Main Image */}
        {project.thumbnail && (
          <div className="relative h-96 mb-12 rounded-lg overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((image: string, index: number) => (
                <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${project.title} screenshot ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabbed Content */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tech">Tech Stack</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Category</h4>
                  <p className="text-muted-foreground">{project.category}</p>
                </div>

                {project.startDate && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Timeline</h4>
                    <p className="text-muted-foreground">
                      {formatDate(project.startDate)}
                      {project.endDate ? ` - ${formatDate(project.endDate)}` : ' - Present'}
                    </p>
                  </div>
                )}

                {project.status && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Status</h4>
                    <Badge variant={project.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4">
            {project.features && project.features.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-primary" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No features listed for this project
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tech Stack Tab */}
          <TabsContent value="tech" className="space-y-4">
            {project.technologies && project.technologies.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No technologies listed for this project
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.challenges && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.challenges}</p>
                  </CardContent>
                </Card>
              )}

              {project.learnings && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Learnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{project.learnings}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Projects */}
        {relatedProjects && relatedProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((relatedProject: any) => (
                <Card key={relatedProject.id} className="group hover:shadow-lg transition-all">
                  <div className="relative h-40 overflow-hidden rounded-t-lg">
                    {relatedProject.thumbnail ? (
                      <Image
                        src={relatedProject.thumbnail}
                        alt={relatedProject.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <Badge className="mb-2">{relatedProject.category}</Badge>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {relatedProject.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {relatedProject.description}
                    </p>

                    <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" asChild>
                      <Link href={`/projects/${relatedProject.slug}`}>
                        View Project →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}