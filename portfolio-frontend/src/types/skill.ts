export interface Skill {
  id: number
  name: string
  category: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'TOOLS' | 'DESIGN' | 'OTHER'
  level: number
  icon?: string
  color?: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface SkillsByCategory {
  [key: string]: Skill[]
}