import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient } from '@/lib/api/client'
import type { User } from '@/features/users/types/users'

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean
}

type AuthActions = {
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  initialize: () => void
  setInitialized: (initialized: boolean) => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      login: (token: string, user: User) => {
        apiClient.setToken(token)
        set({
          user,
          token,
          isAuthenticated: true,
          isInitialized: true
        })
      },

      logout: () => {
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isInitialized: true
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      initialize: () => {
        const { token, isInitialized } = get()
        
        if (isInitialized) return
        
        if (token) {
          apiClient.setToken(token)
          set({ 
            isAuthenticated: true,
            isInitialized: true 
          })
        } else {
          set({ 
            isInitialized: true 
          })
        }
      },

      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized })
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          apiClient.setToken(state.token)
        }
      }
    }
  )
)