import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nifazur Rahman - Full Stack Developer',
  description: 'Full-stack developer portfolio showcasing projects and skills in web development',
  keywords: 'web developer, full stack, react, nextjs, nodejs, portfolio',
  authors: [{ name: 'Nifazur Rahman' }],
  openGraph: {
    title: 'Nifazur Rahman - Full Stack Developer',
    description: 'Full-stack developer portfolio',
    type: 'website',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nifazur Rahman',
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: 'AX4B6Y1M1d_cunSJQJQnFFIX2RGygLjHiOjtnt90ufM',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}