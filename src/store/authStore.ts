import { create } from 'zustand'

import {
  clearAuthTokens,
  getStoredAccessToken,
  getStoredAuthUser,
  getStoredTier,
  type StoredAuthUser,
} from '@/hooks/adminApi'

export type AuthUserSnapshot = StoredAuthUser

type AuthState = {
  /** False until client runs `hydrateFromStorage()` (reads localStorage). */
  isAuthHydrated: boolean
  isAuthenticated: boolean
  user: StoredAuthUser | null
  tier: string | null
  hydrateFromStorage: () => void
  login: (session: { user: StoredAuthUser; tier: string }) => void
  logout: () => void
}

function readPersistedSession(): Pick<
  AuthState,
  'isAuthenticated' | 'user' | 'tier'
> {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null, tier: null }
  }

  const token = getStoredAccessToken()
  let user = getStoredAuthUser()
  const tier = getStoredTier()

  if (token && !user) {
    clearAuthTokens()
    user = null
  }

  const nextToken = getStoredAccessToken()
  const nextUser = getStoredAuthUser()
  const ok = Boolean(nextToken && nextUser)

  return {
    isAuthenticated: ok,
    user: ok ? nextUser : null,
    tier: ok ? tier : null,
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthHydrated: false,
  isAuthenticated: false,
  user: null,
  tier: null,

  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return
    set({
      isAuthHydrated: true,
      ...readPersistedSession(),
    })
  },

  login: ({ user, tier }) =>
    set({
      isAuthenticated: true,
      user,
      tier,
    }),

  logout: () => {
    clearAuthTokens()
    set({
      isAuthenticated: false,
      user: null,
      tier: null,
    })
  },
}))
