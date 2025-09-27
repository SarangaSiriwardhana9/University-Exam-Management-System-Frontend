import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/features/users/types/users'
import { apiClient } from '@/lib/api/client'

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthActions = {
  login: (token: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  initialize: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (token: string, user: User) => {
        apiClient.setToken(token)
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false
        })
      },

      logout: () => {
        apiClient.setToken(null)
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      setUser: (user: User) => {
        set({ user })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      initialize: () => {
        const { token } = get()
        if (token) {
          apiClient.setToken(token)
          set({ isLoading: false })
        } else {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)