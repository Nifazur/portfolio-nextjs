'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Github, Linkedin, Mail, Download, Code, Sparkles, ArrowRight, Twitter } from 'lucide-react'
import { site } from '@/lib/constants'

export function HeroSection() {
  const [currentRole, setCurrentRole] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % site.roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const getIconForSocial = (name: string) => {
    switch (name.toLowerCase()) {
      case 'github':
        return Github
      case 'linkedin':
        return Linkedin
      case 'twitter':
        return Twitter
      default:
        return Mail
    }
  }

  const socialLinks = site.socials.map(social => ({
    ...social,
    icon: getIconForSocial(social.name),
    label: social.name
  }))

  // Add email to social links
  socialLinks.push({
    icon: Mail,
    href: `mailto:${site.email}`,
    label: 'Email',
    name: 'Email'
  })

  return (
    <div>
      <section id="hero" className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>

          {/* Floating Particles */}
          <FloatingParticles count={20} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Main Content */}
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Greeting */}
              <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
                <span className="text-primary text-xs sm:text-sm font-medium tracking-wider uppercase">
                  Hello, I&apos;m
                </span>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse" />
              </div>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight px-2">
                <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  {site.name}
                </span>
              </h1>

              {/* Dynamic Role */}
              <div className="h-16 sm:h-20 flex items-center justify-center mb-6 sm:mb-8 px-2">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground">
                  <span>I&apos;m a </span>
                  <span className="relative">
                    <span className="text-primary font-bold">
                      {site.roles[currentRole]}
                    </span>
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary animate-pulse"></span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
                {site.about.description.split('.')[0]}. Let&apos;s build something amazing together.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
                <button
                  onClick={scrollToProjects}
                  className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full text-base sm:text-lg font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25 w-full sm:w-auto justify-center"
                >
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                  View My Work
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>

                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-border hover:border-primary text-foreground hover:text-primary rounded-full text-base sm:text-lg font-semibold hover:scale-105 transition-all duration-300 w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Resume
                </a>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 mb-12 sm:mb-16 px-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-2.5 sm:p-3 bg-card border border-border hover:border-primary/50 rounded-full hover:scale-110 transition-all duration-300 hover:shadow-lg"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Scroll Indicator - Hidden on mobile */}
            <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 animate-bounce -mt-6">
              <button
                onClick={scrollToProjects}
                className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                <span className="text-sm font-medium">Scroll to explore</span>
                <div className="p-2 border border-border group-hover:border-primary rounded-full transition-colors duration-300">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </section>

      {/* Section Divider */}
      <hr className="bottom-0 border-t border-muted-foreground/20" />
    </div>
  )
}
// FloatingParticles component - hydration-safe random positions
function FloatingParticles({ count }: { count: number }) {
  const [particles, setParticles] = useState<
    { left: string; top: string; animationDelay: string; animationDuration: string }[]
  >([])

  useEffect(() => {
    // Only generate on client
    const generated = Array.from({ length: count }, () => {
      const left = `${Math.random() * 100}%`
      const top = `${Math.random() * 100}%`
      const animationDelay = `${Math.random() * 3}s`
      const animationDuration = `${3 + Math.random() * 2}s`
      return { left, top, animationDelay, animationDuration }
    })
    setParticles(generated)
    // we do not depend on count as it's fixed in this use
    // eslint-disable-next-line
  }, [])

  return (
    <div className="absolute inset-0">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration
          }}
        ></div>
      ))}
    </div>
  )
}