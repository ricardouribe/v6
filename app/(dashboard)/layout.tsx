import { MOCK_USER } from '@/lib/mock/user'
import { redirect } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock authentication check
  const user = MOCK_USER

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}