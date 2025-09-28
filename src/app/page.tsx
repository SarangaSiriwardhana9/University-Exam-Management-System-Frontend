 
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { UserRole } from '@/constants/roles'

const DASHBOARD_ROUTES: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
  [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
  [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
  [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
  [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
} as const

const HomePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (user?.role) {
      const dashboardRoute = DASHBOARD_ROUTES[user.role]
      if (dashboardRoute) {
        router.replace(dashboardRoute)
      }
    }
  }, [isAuthenticated, isLoading, user?.role, router])

 
  return null
}

export default HomePage