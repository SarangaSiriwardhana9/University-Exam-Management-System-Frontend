 
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from './use-api'
import { useAuth } from '@/lib/auth/auth-provider'
import { ROUTES } from '@/constants/routes'
import { USER_ROLES } from '@/constants/roles'
import type { LoginFormData, RegisterFormData } from '../validations/auth-schemas'
import type { LoginUser, RegisterDto } from '../types/auth'
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
  departmentId: loginUser.departmentId,
  year: loginUser.year,
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
      
      queryClient.clear()
      
      const redirectRoute = DASHBOARD_ROUTES[response.user.role as keyof typeof DASHBOARD_ROUTES] || ROUTES.HOME
      
      toast.success(`Welcome back, ${response.user.fullName}!`, {
        description: 'You have been successfully logged in.'
      })
      
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
      // Remove confirmPassword and prepare the registration data
      const { confirmPassword, ...restData } = data
      
      const registerData: RegisterDto = {
        email: restData.email,
        fullName: restData.fullName,
        password: restData.password,
        year: restData.year,
        username: restData.username && restData.username.trim() !== '' ? restData.username : undefined,
        contactPrimary: restData.contactPrimary && restData.contactPrimary.trim() !== '' ? restData.contactPrimary : undefined,
        addressLine1: restData.addressLine1 && restData.addressLine1.trim() !== '' ? restData.addressLine1 : undefined,
        addressLine2: restData.addressLine2 && restData.addressLine2.trim() !== '' ? restData.addressLine2 : undefined,
        city: restData.city && restData.city.trim() !== '' ? restData.city : undefined,
        state: restData.state && restData.state.trim() !== '' ? restData.state : undefined,
        postalCode: restData.postalCode && restData.postalCode.trim() !== '' ? restData.postalCode : undefined,
      }
      
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
      logout()
      queryClient.clear()
      router.replace('/login')
      toast.success('Logged Out', {
        description: 'You have been successfully logged out.'
      })
    }
  })
}