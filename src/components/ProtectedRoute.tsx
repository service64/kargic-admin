import { Navigate, Outlet } from 'react-router-dom'

import { AuthLoadingScreen } from '@/components/AuthLoadingScreen'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute() {
  const isAuthHydrated = useAuthStore((s) => s.isAuthHydrated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (!isAuthHydrated) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
