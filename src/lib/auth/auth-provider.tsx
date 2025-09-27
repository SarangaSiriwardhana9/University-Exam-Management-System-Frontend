'use client'

import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { usersService } from '@/features/users/hooks/use-users'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import type { User } from '@/features/users/types/users'

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading, login, logout, setUser, setLoading, initialize } = useAuthStore()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        initialize()
        
        if (isAuthenticated && !user) {
          // Try to fetch user profile if we have a token but no user data
          const response = await usersService.getProfile()
          setUser(response.data)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        logout()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}