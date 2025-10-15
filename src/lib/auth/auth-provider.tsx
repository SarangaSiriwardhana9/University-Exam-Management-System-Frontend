'use client'

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { usersService } from '@/features/users/hooks/use-users'
import type { User } from '@/features/users/types/users'

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refetchUser: () => Promise<void>
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
  const store = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isFetchingUser, setIsFetchingUser] = useState(false)

  const isLoading = !store.isInitialized || isFetchingUser

const refetchUser = useCallback(async () => {
  if (!store.isAuthenticated || !store.token) return
  
  setIsFetchingUser(true)
  try {
    const response = await usersService.getProfile()
    console.log('🔍 FETCHED USER FROM API:', JSON.stringify(response.data, null, 2))
    store.setUser(response.data)
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    store.logout()
  } finally {
    setIsFetchingUser(false)
  }
}, [store.isAuthenticated, store.token, store.setUser, store.logout])

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated || store.isInitialized) return

    const initializeAuth = async () => {
      try {
        store.initialize()
        
        if (store.isAuthenticated && !store.user) {
          await refetchUser()
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
        store.logout()
      }
    }

    initializeAuth()
  }, [isHydrated, store.isInitialized, store.isAuthenticated, store.user, store.initialize, store.logout, refetchUser])

  useEffect(() => {
    if (store.user) {
      console.log('🔍 CURRENT USER FROM AUTH PROVIDER:', JSON.stringify(store.user, null, 2))
    }
  }, [store.user])

  const contextValue = useMemo(() => ({
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading,
    login: store.login,
    logout: store.logout,
    refetchUser
  }), [store.user, store.isAuthenticated, isLoading, store.login, store.logout, refetchUser])

  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">University Management System</h2>
            <p className="text-muted-foreground">Initializing application...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}