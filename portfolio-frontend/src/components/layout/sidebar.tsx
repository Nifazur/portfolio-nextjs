'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/actions/auth'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Blogs',
    href: '/dashboard/blogs',
    icon: FileText
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderOpen
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: User
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    try {
      // Call logout action (clears server-side cookies)
      await logoutAction()
      
      // Always clear client-side token
      apiClient.clearToken()
      console.log('✅ Logged out successfully')
      
      toast.success('Logged out successfully')
      
      // Redirect to login
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      // Even on error, clear token and redirect
      apiClient.clearToken()
      router.push('/login')
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border rounded-md"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            {!isCollapsed && (
              <Link href="/dashboard" className="flex items-center">
                <span className="text-xl font-bold">Dashboard</span>
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-1.5 hover:bg-muted rounded-md"
            >
              <ChevronLeft className={cn(
                "h-5 w-5 transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                isCollapsed && "justify-center"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}