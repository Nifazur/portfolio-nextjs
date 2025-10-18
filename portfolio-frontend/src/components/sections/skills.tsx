/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Code, Server, Database, Wrench, Palette, Monitor } from 'lucide-react'
import { SkillsClient } from './skills-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const categoryIcons: { [key: string]: any } = {
  FRONTEND: Monitor,
  BACKEND: Server,
  DATABASE: Database,
  TOOLS: Wrench,
  DESIGN: Palette,
  OTHER: Code,
}

// Server-side data fetching with ISR
async function getSkillsByCategory() {
  try {
    console.log('🔍 Fetching skills from:', `${API_URL}/skills/by-category`)
    
    const res = await fetch(`${API_URL}/skills/by-category`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      // Add timeout and better error handling
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    
    if (!res.ok) {
      console.warn('⚠️ Failed to fetch skills, status:', res.status)
      return {}
    }
    
    const data = await res.json()
    console.log('✅ Skills fetched successfully')
    return data.data || {}
  } catch (error) {
    console.error('❌ Error fetching skills:', error)
    // Return empty object instead of failing
    return {}
  }
}

export async function SkillsSection() {
  const skillsByCategory = await getSkillsByCategory()
  
  // If no skills, show a placeholder message instead of hiding
  // ✅ FIX: Don't pass React components, only serialize-able data
  const categories = Object.keys(skillsByCategory).map(key => ({
    name: key,
    skills: skillsByCategory[key] || []
  }))

  const hasSkills = categories.length > 0 && categories.some(cat => cat.skills.length > 0)

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

        {/* Show content or placeholder */}
        {hasSkills ? (
          <>
            {/* Client Component for Interactivity */}
            <SkillsClient 
              categories={categories}
            />

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
          </>
        ) : (
          /* Placeholder when skills are not available */
          <div className="text-center py-16 bg-card border border-border rounded-xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Code className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Skills Loading...</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load skills at the moment. Please ensure the backend API is running.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto text-left">
              <p className="text-sm text-muted-foreground">
                <strong>Troubleshooting:</strong><br/>
                1. Check if backend is running on <code className="bg-background px-2 py-1 rounded">http://localhost:5000</code><br/>
                2. Verify <code className="bg-background px-2 py-1 rounded">NEXT_PUBLIC_API_URL</code> in .env.local<br/>
                3. Check backend skills endpoint: <code className="bg-background px-2 py-1 rounded">/api/v1/skills/by-category</code>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section Divider */}
      <hr className="mt-20 sm:mt-40 bottom-0 border-t border-muted-foreground/20" />
    </section>
  )
}