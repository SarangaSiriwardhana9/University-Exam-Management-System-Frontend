import { AuthGuard } from '@/lib/auth/auth-guard'
import { Sidebar } from '@/components/navigation/sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}