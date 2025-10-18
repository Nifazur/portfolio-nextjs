import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero'
import { AboutSection } from '@/components/sections/about'
import { SkillsSection } from '@/components/sections/skills'
import { ProjectsSection } from '@/components/sections/projects'
import { ContactSection } from '@/components/sections/contact'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BlogSection } from '@/components/sections/blog'

export const metadata: Metadata = {
  title: 'Nifazur Rahman - Full Stack Developer Portfolio',
  description: 'Welcome to my portfolio. I am a full-stack developer specializing in React, Next.js, Node.js, and modern web technologies.',
  keywords: 'Nifazur Rahman, Full Stack Developer, Web Developer, React, Next.js, Node.js, Portfolio',
  openGraph: {
    title: 'Nifazur Rahman - Full Stack Developer',
    description: 'Full-stack developer portfolio showcasing projects and skills',
    url: 'https://yourportfolio.com',
    siteName: 'Nifazur Rahman Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nifazur Rahman Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nifazur Rahman - Full Stack Developer',
    description: 'Full-stack developer portfolio showcasing projects and skills',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'AX4B6Y1M1d_cunSJQJQnFFIX2RGygLjHiOjtnt90ufM',
  },
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <HeroSection />
        <AboutSection />
        <SkillsSection/>
        <ProjectsSection />
        <BlogSection/>
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}