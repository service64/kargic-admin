import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

/** localStorage keys — match your login API response fields */
export const AUTH_STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  authUser: 'authUser',
  tier: 'authTier',
} as const

export type StoredAuthUser = {
  id: string
  email: string
  role: string
}

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  ''

/** POST path for refresh (relative to API_BASE). Override via env if needed. */
const REFRESH_PATH =
  (import.meta.env.VITE_AUTH_REFRESH_PATH as string | undefined) ??
  '/auth/refresh'

/** Requests that must not send Authorization (substring match on URL). */
const PUBLIC_PATH_PARTS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/user/login',
  '/user/super-admin/login',
  '/super-admin/login',
]

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

type RefreshResponse = {
  accessToken: string
  refreshToken?: string
}

export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_STORAGE_KEYS.accessToken)
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_STORAGE_KEYS.refreshToken)
}

/** Stores access token (and refresh token when the API returns one). */
export function persistAuthTokens(tokens: {
  accessToken: string
  refreshToken?: string
}): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.accessToken, tokens.accessToken)
  if (tokens.refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.refreshToken, tokens.refreshToken)
  }
}

/** After login — tokens + user + tier from wrapped API `data`. */
export function persistAuthSession(payload: {
  accessToken: string
  refreshToken?: string
  user: StoredAuthUser
  tier: string
}): void {
  persistAuthTokens({
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  })
  localStorage.setItem(AUTH_STORAGE_KEYS.authUser, JSON.stringify(payload.user))
  localStorage.setItem(AUTH_STORAGE_KEYS.tier, payload.tier)
}

export function getStoredAuthUser(): StoredAuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.authUser)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuthUser
  } catch {
    return null
  }
}

export function getStoredTier(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(AUTH_STORAGE_KEYS.tier)
}

export function clearAuthTokens(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.accessToken)
  localStorage.removeItem(AUTH_STORAGE_KEYS.refreshToken)
  localStorage.removeItem(AUTH_STORAGE_KEYS.authUser)
  localStorage.removeItem(AUTH_STORAGE_KEYS.tier)
}

function shouldAttachAuth(url: string): boolean {
  return !PUBLIC_PATH_PARTS.some((p) => url.includes(p))
}

/** Plain axios for refresh — avoids interceptor recursion */
const refreshClient = axios.create({
  baseURL: API_BASE || undefined,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) return null

  const { data } = await refreshClient.post<RefreshResponse>(REFRESH_PATH, {
    refreshToken,
  })

  const access = data.accessToken
  const nextRefresh = data.refreshToken ?? refreshToken
  persistAuthTokens({
    accessToken: access,
    refreshToken: nextRefresh,
  })
  return access
}

function enqueueRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export const adminApi = axios.create({
  baseURL: API_BASE || undefined,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, 
  timeout: 60_000,
})

adminApi.interceptors.request.use((config) => {
  const url = config.url ?? ''
  const fullUrl = `${config.baseURL ?? ''}${url}`
  const token = getStoredAccessToken()
  if (token && shouldAttachAuth(fullUrl)) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequest | undefined
    const status = error.response?.status

    if (status !== 401 || !original) {
      return Promise.reject(error)
    }

    const url = `${original.baseURL ?? ''}${original.url ?? ''}`
    if (!shouldAttachAuth(url)) {
      return Promise.reject(error)
    }

    if (original._retry) {
      clearAuthTokens()
      return Promise.reject(error)
    }

    original._retry = true

    try {
      const newAccess = await enqueueRefresh()
      if (!newAccess) {
        clearAuthTokens()
        return Promise.reject(error)
      }
      original.headers.Authorization = `Bearer ${newAccess}`
      return adminApi(original)
    } catch {
      clearAuthTokens()
      return Promise.reject(error)
    }
  }
)
