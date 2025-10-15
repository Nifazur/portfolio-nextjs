import { Code, Palette, Smartphone, Globe, Database, Zap, GraduationCap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { site } from '@/lib/constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getEducations() {
  try {
    const res = await fetch(`${API_URL}/educations`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch educations:', error)
    return []
  }
}

async function getExperiences() {
  try {
    const res = await fetch(`${API_URL}/experiences`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data || []
  } catch (error) {
    console.error('Failed to fetch experiences:', error)
    return []
  }
}

export async function AboutSection() {
  const [educations, experiences] = await Promise.all([
    getEducations(),
    getExperiences()
  ])

  const skills = [
    { name: 'Frontend Development', level: 95, icon: Code },
    { name: 'UI/UX Design', level: 88, icon: Palette },
    { name: 'Mobile Development', level: 82, icon: Smartphone },
    { name: 'Backend Development', level: 90, icon: Database },
    { name: 'Web Development', level: 94, icon: Globe },
    { name: 'Performance Optimization', level: 87, icon: Zap },
  ]

  return (
    <section className="py-20" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
            About Me
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Crafting Digital Excellence
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            I&apos;m a passionate computer science student and aspiring full-stack developer, currently pursuing my BSc while completing specialized web development training.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Left Column - About Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                My Story
              </h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{site.about.description}</p>
              </div>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-foreground font-medium">{site.location}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <a 
                  href={`mailto:${site.email}`}
                  className="text-foreground font-medium hover:text-primary transition-colors"
                >
                  {site.email}
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="text-foreground font-medium">{site.about.specialization}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Languages</p>
                <p className="text-foreground font-medium">{site.about.languages.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-foreground">
              Skills & Expertise
            </h3>
            <div className="space-y-6">
              {skills.map((skill, index) => {
                const Icon = skill.icon
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="text-foreground font-medium">{skill.name}</span>
                      </div>
                      <span className="text-muted-foreground text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Education Timeline */}
        {educations.length > 0 && (
          <div id="education" className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Education
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                My educational journey and continuous learning path in computer science and web development.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-border"></div>

              <div className="space-y-12">
                {educations.map((edu: any, index: number) => (
                  <div key={edu.id} className="relative">
                    <div className="absolute left-2 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-medium">
                              {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-foreground mb-1">{edu.degree}</h4>
                          <p className="text-primary font-medium mb-3">{edu.institution}</p>
                          {edu.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {edu.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}