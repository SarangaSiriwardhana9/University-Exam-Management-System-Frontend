 
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from './use-api'
import { useAuth } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { LoginFormData, RegisterFormData } from '../validations/auth-schemas'
import type { LoginUser } from '../types/auth'
import type { User } from '@/features/users/types/users'
import type { ApiError } from '@/types/common'
import { toast } from 'sonner'

const convertLoginUserToUser = (loginUser: LoginUser): User => ({
  _id: loginUser.id,
  username: loginUser.username,
  email: loginUser.email,
  fullName: loginUser.fullName,
  role: loginUser.role,
  isActive: loginUser.isActive,
  profileImage: loginUser.profileImage,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

const DASHBOARD_ROUTES = {
  [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
  [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
  [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
  [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
  [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
} as const

export const useLogin = () => {
  const { login } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await authService.login(data)
      return response
    },
    onSuccess: (response) => {
      const user = convertLoginUserToUser(response.user)
      login(response.accessToken, user)
      
      // Clear any cached data
      queryClient.clear()
      
      const redirectRoute = DASHBOARD_ROUTES[response.user.role as keyof typeof DASHBOARD_ROUTES] || ROUTES.HOME
      
      toast.success(`Welcome back, ${response.user.fullName}!`, {
        description: 'You have been successfully logged in.'
      })
      
      // Small delay to ensure state is updated
      setTimeout(() => {
        router.replace(redirectRoute)
      }, 100)
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || 'Login failed. Please check your credentials.'
      toast.error('Login Failed', {
        description: errorMessage
      })
    }
  })
}

export const useRegister = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data
      return authService.register(registerData)
    },
    onSuccess: () => {
      toast.success('Account Created Successfully!', {
        description: 'Please sign in with your new account.'
      })
      router.push('/login')
    },
    onError: (error: ApiError) => {
      const errorMessage = error.message || 'Registration failed. Please try again.'
      toast.error('Registration Failed', {
        description: errorMessage
      })
    }
  })
}

export const useLogout = () => {
  const { logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      queryClient.clear()
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.'
      })
      router.replace('/login')
    },
    onError: () => {
      // Even if API call fails, logout locally
      logout()
      queryClient.clear()
      router.replace('/login')
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.'
      })
    }
  })
}