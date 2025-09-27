'use client'

import { useAuth } from './auth-provider'
import type { UserRole } from '@/constants/roles'

type RoleGuardProps = {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RoleGuard = ({ allowedRoles, children, fallback }: RoleGuardProps) => {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don&rsquo;t have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}