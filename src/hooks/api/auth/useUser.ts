import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

import { adminApi } from '@/hooks/adminApi'

/** Request body for POST …/user/super-admin/login */
export type LoginRequest = {
  email: string
  password: string
}

/** User object inside API `data` */
export type AuthUser = {
  id: string
  email: string
  role: string
}

/** Inner `data` — tokens + profile (matches your API) */
export type LoginSuccessData = {
  user: AuthUser
  accessToken: string
  tier: string
  refreshToken?: string
}

/** Full HTTP JSON body */
export type LoginApiResponse = {
  status: number
  message: string
  data: LoginSuccessData
}

/** Normalized value returned by `useUser` mutation (inner `data` only). */
export type LoginResult = LoginSuccessData

export function buildLoginPayload(
  email: string,
  password: string
): LoginRequest {
  return {
    email,
    password,
  }
}

export function useUser() {
  return useMutation<
    LoginResult,
    AxiosError<{ message?: string }>,
    LoginRequest
  >({
    mutationKey: ['auth', 'login'],
    mutationFn: async (payload) => {
      const { data: body } = await adminApi.post<LoginApiResponse>(
        '/user/super-admin/login',
        payload
      )
      if (!body?.data) {
        throw new Error(body?.message ?? 'Login failed')
      }
      return body.data
    },
  })
}

export const useUserMutation = useUser
