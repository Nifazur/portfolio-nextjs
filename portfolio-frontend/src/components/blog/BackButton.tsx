// src/components/blog/BackButton.tsx
'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  return (
    <Button variant="ghost" className="mb-8" asChild>
      <Link href="/blogs">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Blogs
      </Link>
    </Button>
  )
}