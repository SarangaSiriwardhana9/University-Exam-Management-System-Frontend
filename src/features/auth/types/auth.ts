 
import type { UserRole } from '@/constants/roles'

export type LoginDto = {
  usernameOrEmail: string
  password: string
}

export type RegisterDto = {
  email: string
  username?: string
  password: string
  fullName: string
  contactPrimary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  year?: number 
}

export type LoginUser = {
  id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  profileImage?: string
  year?: number   
  departmentId?: string 
}

export type LoginResponse = {
  user: LoginUser
  accessToken: string
}

export type ForgotPasswordDto = {
  email: string
}

export type ResetPasswordDto = {
  token: string
  password: string
  confirmPassword: string
}