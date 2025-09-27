/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from './use-api'
import { useAuth } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { LoginFormData, RegisterFormData } from '../validations/auth-schemas'
import { toast } from 'sonner'

export const useLogin = () => {
  const { login } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      login(response.accessToken, response.user)
      
      // Redirect based on user role
      const roleRoutes = {
        [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
        [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
        [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
        [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
        [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
      } as const
      
      const redirectRoute = roleRoutes[response.user.role as keyof typeof roleRoutes] || ROUTES.HOME
      router.push(redirectRoute)
      
      toast.success('Welcome back!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed')
    }
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data
      return authService.register(registerData)
    },
    onSuccess: () => {
      toast.success('Registration successful! Please log in.')
      router.push('/login')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed')
    }
  })
}

export const useLogout = () => {
  const { logout } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      router.push('/login')
      toast.success('Logged out successfully')
    },
    onError: () => {
      // Even if API call fails, logout locally
      logout()
      router.push('/login')
    }
  })
}