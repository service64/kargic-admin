import { create } from 'zustand'

import { clearAuthTokens } from '@/hooks/adminApi'

type AuthState = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    clearAuthTokens()
    set({ isAuthenticated: false })
  },
}))
