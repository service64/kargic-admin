import { useLayoutEffect } from 'react'

import { useAuthStore } from '@/store/authStore'

/** Call once on app mount to read session from localStorage before protected routes render. */
export function AuthHydrator() {
  const hydrateFromStorage = useAuthStore((s) => s.hydrateFromStorage)

  useLayoutEffect(() => {
    hydrateFromStorage()
  }, [hydrateFromStorage])

  return null
}
