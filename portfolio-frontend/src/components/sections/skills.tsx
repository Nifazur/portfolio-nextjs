/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { Code, Server, Database, Wrench, Palette, Monitor } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const categoryIcons: { [key: string]: any } = {
  FRONTEND: Monitor,
  BACKEND: Server,
  DATABASE: Database,
  TOOLS: Wrench,
  DESIGN: Palette,
  OTHER: Code,
}

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [skillsByCategory, setSkillsByCategory] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  // Load skills on component mount
  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch(`${API_URL}/skills/by-category`)
        if (!res.ok) {
          setIsLoading(false)
          return
        }
        const data = await res.json()
        const skills = data.data || {}
        setSkillsByCategory(skills)
        
        // Set first category as active
        if (Object.keys(skills).length > 0) {
          setActiveCategory(Object.keys(skills)[0])
        }
      } catch (error) {
        console.error('Failed to fetch skills:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadSkills()
  }, [])

  const categories = Object.keys(skillsByCategory).map(key => ({
    name: key,
    icon: categoryIcons[key] || Code,
    skills: skillsByCategory[key] || []
  }))

  const activeSkills = skillsByCategory[activeCategory] || []
  const ActiveIcon = categoryIcons[activeCategory] || Code

  if (isLoading) {
    return (
      <section className="bg-background py-20" id="skills">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading skills...</p>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="bg-background py-20" id="skills">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-primary text-xs sm:text-sm font-medium tracking-wider uppercase mb-3 sm:mb-4">
            Skills & Technologies
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 px-2">
            Technical Expertise
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            A comprehensive overview of my technical skills, organized by technology stack.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar - Horizontal scroll on mobile */}
          <div className="w-full lg:col-span-1">
            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        activeCategory === cat.name
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-card text-foreground border border-border'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Desktop: Vertical stack */}
            <div className="hidden lg:block space-y-2 sticky top-24">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg text-left transition-all duration-300 ${
                      activeCategory === cat.name
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-card hover:bg-card/80 text-foreground border border-border'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{cat.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Skills */}
          <div className="w-full lg:col-span-3">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ActiveIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate">{activeCategory} Skills</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{activeSkills.length} technologies</p>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 overflow-x-auto">
                {activeSkills.map((skill: any, i: number) => (
                  <div
                    key={skill.id}
                    className="group p-3 sm:p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 min-w-[250px]"
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {skill.color && (
                          <div 
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: skill.color }}
                          />
                        )}
                        <span className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground font-medium flex-shrink-0">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 sm:h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${skill.level}%`,
                          animationDelay: `${i * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-12 sm:mt-16 bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4 px-2">
            Continuous Learning Journey
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-3xl mx-auto px-4">
            Technology evolves rapidly, and I&apos;m committed to staying current with industry trends.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
              Currently Learning: PostgreSQL
            </span>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
              Next Goal: Docker
            </span>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <hr className="mt-20 sm:mt-40 bottom-0 border-t border-muted-foreground/20" />
    </section>
  )
}