import { Code, Server, Database, Wrench, Palette, Monitor } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

async function getSkills() {
  try {
    const res = await fetch(`${API_URL}/skills/by-category`, {
      next: { revalidate: 3600 } // Revalidate every hour
    })
    if (!res.ok) return {}
    const data = await res.json()
    return data.data || {}
  } catch (error) {
    console.error('Failed to fetch skills:', error)
    return {}
  }
}

const categoryIcons: { [key: string]: any } = {
  FRONTEND: Monitor,
  BACKEND: Server,
  DATABASE: Database,
  TOOLS: Wrench,
  DESIGN: Palette,
  OTHER: Code,
}

export async function SkillsSection() {
  const skillsByCategory = await getSkills()
  
  const categories = Object.keys(skillsByCategory).map(key => ({
    name: key,
    icon: categoryIcons[key] || Code,
    skills: skillsByCategory[key] || []
  }))

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-muted/30" id="skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium tracking-wider uppercase mb-4">
            Skills & Technologies
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Technical Expertise
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            A comprehensive overview of my technical skills, organized by technology stack.
          </p>
        </div>

        <Tabs defaultValue={categories[0]?.name} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <TabsTrigger key={cat.name} value={cat.name} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat.name} value={cat.name}>
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <cat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{cat.name} Skills</h3>
                      <p className="text-muted-foreground">{cat.skills.length} technologies</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cat.skills.map((skill: any) => (
                      <div
                        key={skill.id}
                        className="group p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {skill.color && (
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: skill.color }}
                              />
                            )}
                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                              {skill.name}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground font-medium">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}