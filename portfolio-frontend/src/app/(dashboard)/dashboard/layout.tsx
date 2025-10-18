import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sidebar } from '@/components/layout/sidebar'
import { ErrorBoundary } from '@/components/error-boundary'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64 transition-all duration-300">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}