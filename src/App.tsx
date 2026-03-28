import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { DashboardLayout } from '@/components/layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage'
import { DisputePage } from '@/pages/DisputePage/DisputePage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import Subscription from '@/pages/subscription/Subscription'
import { ActivityLogPage } from '@/pages/user-management/ActivityLogPage'
import { UserDirectoryPage } from '@/pages/user-management/UserDirectoryPage'
import { SellerVerificationPage } from '@/pages/seller-verification/SellerVerificationPage'
import { SiteOrders } from '@/pages/SiteOrders'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dispute" element={<DisputePage />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/site-orders" element={<SiteOrders />} />
            <Route
              path="/user-management/activity"
              element={<ActivityLogPage />}
            />
            <Route
              path="/user-management/users"
              element={<UserDirectoryPage />}
            />
            <Route
              path="/seller-verification"
              element={<SellerVerificationPage />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
