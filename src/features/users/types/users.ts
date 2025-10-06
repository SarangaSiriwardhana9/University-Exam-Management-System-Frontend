 
import type { UserRole } from '@/constants/roles'

export type User = {
  _id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  isActive: boolean
  contactPrimary?: string
  contactSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  profileImage?: string
  departmentId?: string
  year?: number   
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export type CreateUserDto = {
  username: string
  password: string
  email: string
  fullName: string
  role: UserRole
  contactPrimary?: string
  contactSecondary?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  departmentId?: string
  year?: number 
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, 'username' | 'password'>> & {
  isActive?: boolean
}

export type ChangePasswordDto = {
  currentPassword: string
  newPassword: string
}

export type UserStats = {
  totalUsers: number
  activeUsers: number
  usersByRole: Record<string, number>
}

export type GetUsersParams = {
  role?: UserRole
  isActive?: boolean
  departmentId?: string
  year?: number   
  limit?: number
  page?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type BackendUsersListResponse = {
  users: User[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type BackendUserResponse = {
  user: User
}