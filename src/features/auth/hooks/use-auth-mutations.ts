
'use client'

import { useMutation } from '@tanstack/react-query'
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

 
const convertLoginUserToUser = (loginUser: LoginUser): User => {
  return {
    _id: loginUser.id,
    username: loginUser.username,
    email: loginUser.email,
    fullName: loginUser.fullName,
    role: loginUser.role,
    isActive: loginUser.isActive,
    profileImage: loginUser.profileImage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export const useLogin = () => {
  const { login } = useAuth()
  const router = useRouter()

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (response) => {
      const user = convertLoginUserToUser(response.user)
      login(response.accessToken, user)
      
 
      const roleRoutes = {
        [USER_ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
        [USER_ROLES.FACULTY]: ROUTES.FACULTY.DASHBOARD,
        [USER_ROLES.STUDENT]: ROUTES.STUDENT.DASHBOARD,
        [USER_ROLES.EXAM_COORDINATOR]: ROUTES.EXAM_COORDINATOR.DASHBOARD,
        [USER_ROLES.INVIGILATOR]: ROUTES.INVIGILATOR.DASHBOARD
      } as const
      
      const redirectRoute = roleRoutes[response.user.role as keyof typeof roleRoutes] || ROUTES.HOME
      
      toast.success('Welcome back!')
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        router.replace(redirectRoute)
      }, 100)
    },
    onError: (error: ApiError) => {
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
    onError: (error: ApiError) => {
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
      toast.success('Logged out successfully')
      router.replace('/login')
    },
    onError: (error: ApiError) => {
      // Even if API call fails, logout locally
      logout()
      router.replace('/login')
      toast.success('Logged out successfully')
    }
  })
}