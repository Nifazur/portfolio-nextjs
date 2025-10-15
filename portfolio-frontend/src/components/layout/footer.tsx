/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { site } from '@/lib/constants'

const socialIcons: { [key: string]: any } = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              {site.brand}<span className="text-primary">.</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              {site.title} passionate about creating elegant solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-sm text-muted-foreground hover:text-primary">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-sm text-muted-foreground hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${site.email}`} className="text-sm text-muted-foreground hover:text-primary">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                  {site.phone}
                </a>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  {site.location}
                </span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Follow Me</h4>
            <div className="flex space-x-4">
              {site.socials.map((social) => {
                const Icon = socialIcons[social.name] || Mail
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}