/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { site } from '@/lib/constants'
import { apiClient } from '@/lib/api'

const navItems = [
  { name: 'Home', href: '/#hero', section: 'hero' },
  { name: 'About', href: '/#about', section: 'about' },
  { name: 'Skills', href: '/#skills', section: 'skills' },
  { name: 'Projects', href: '/#projects', section: 'projects' },
  { name: 'Blogs', href: '/#blog', section: 'blog' },
  { name: 'Contact', href: '/#contact', section: 'contact' },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const pathname = usePathname()

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true)
      
      // First check if token exists in localStorage
      const token = apiClient.getToken()
      
      if (!token) {
        setIsAuthenticated(false)
        setIsCheckingAuth(false)
        return
      }
      
      // Verify token by calling profile API
      try {
        const response = await apiClient.get('/auth/profile')
        setIsAuthenticated(true)
        console.log('✅ User authenticated')
      } catch (error) {
        console.log('❌ Authentication failed:', error)
        setIsAuthenticated(false)
        // Clear invalid token
        apiClient.clearToken()
      } finally {
        setIsCheckingAuth(false)
      }
    }
    
    checkAuth()
    
    // Check auth status every 60 seconds
    const interval = setInterval(checkAuth, 60000)
    return () => clearInterval(interval)
  }, [])

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)

      // Only track sections on homepage
      if (pathname === '/') {
        const sections = navItems.map(item => item.section)
        
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            // Check if section is in viewport (with offset for navbar)
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(section)
              break
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Determine if a nav item is active
  const isActive = (item: typeof navItems[0]) => {
    // For non-homepage routes
    if (pathname !== '/') {
      return pathname === item.href
    }
    
    // For homepage, check active section
    return activeSection === item.section
  }

  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, section: string) => {
    setIsMenuOpen(false)
    
    // If already on homepage, smooth scroll to section
    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault()
      const element = document.getElementById(section)
      if (element) {
        const offset = 80 // Navbar height
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
        
        setActiveSection(section)
      }
    }
  }

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center"
            onClick={() => {
              if (pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setActiveSection('hero')
              }
            }}
          >
            <span className="text-2xl font-bold text-foreground">
              {site.brand}<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.section)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative",
                  isActive(item)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive(item) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
            
            {/* Dashboard Link - Only show when authenticated */}
            {!isCheckingAuth && isAuthenticated && (
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5 relative",
                  pathname.startsWith('/dashboard')
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Dashboard
                {pathname.startsWith('/dashboard') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )}
          </div>

          {/* Hire Me Button - Desktop */}
          <div className="hidden md:block">
            <Button asChild>
              <a href={`mailto:${site.email}`}>Hire Me</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.section)}
                className={cn(
                  "block px-3 py-2 text-base font-medium transition-colors hover:text-primary rounded-md",
                  isActive(item)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Dashboard Link - Mobile - Only show when authenticated */}
            {!isCheckingAuth && isAuthenticated && (
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-base font-medium transition-colors hover:text-primary rounded-md",
                  pathname.startsWith('/dashboard')
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            
            <div className="px-3 py-2">
              <Button className="w-full" asChild>
                <a href={`mailto:${site.email}`}>Hire Me</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}