 
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { UserRole } from '@/constants/roles'

const HomePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)


  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || isLoading) return

    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    if (user?.role) {
      const dashboardRoutes: Record<UserRole, string> = {
        [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
        [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
        [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
        [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
        [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
      }

      const dashboardRoute = dashboardRoutes[user.role]
      if (dashboardRoute) {
        router.replace(dashboardRoute)
      }
    }
  }, [isMounted, isAuthenticated, isLoading, user?.role, router])


  if (!isMounted) {
    return null
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          University Management System
        </h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

export default HomePage