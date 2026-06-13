import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { AuthHydrator } from '@/components/AuthHydrator'
import { DashboardLayout } from '@/components/layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { DashboardPage } from '@/pages/DashboardPage/DashboardPage'
import { DisputePage } from '@/pages/DisputePage/DisputePage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import Subscription from '@/pages/subscription/Subscription' 
import { SellerVerificationPage } from '@/pages/seller-verification/SellerVerificationPage'
import { SiteOrders } from '@/pages/SiteOrders'
import Messages from '@/pages/Messages/Messages'
import ProductConfig from './pages/ProductConfig/ProductConfig'
import AllUserPage from './pages/user-management/all-users-page'
import { ExportersPage } from './pages/user-management/ExportersPage'
import { ImpotersPage } from './pages/user-management/ImpotersPage'
import SingleUserDetails from './pages/user-management/single-user-details'
import { ContactsPage } from './pages/Contacts/ContactsPage'
import { ContactDetailsPage } from './pages/Contacts/ContactDetailsPage'
import { ExportBlogListPage } from './pages/ExportBlog/ExportBlogListPage'
import { ExportBlogFormPage } from './pages/ExportBlog/ExportBlogFormPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthHydrator />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dispute" element={<DisputePage />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/site-orders" element={<SiteOrders />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/:id" element={<ContactDetailsPage />} />
            <Route path="/export-blog" element={<ExportBlogListPage />} />
            <Route path="/export-blog/new" element={<ExportBlogFormPage />} />
            <Route path="/export-blog/:id/edit" element={<ExportBlogFormPage />} />
            <Route path="/product-config" element={<ProductConfig />} />
            <Route
              path="/user-management/impoters"
              element={<ImpotersPage />}
            />
            <Route
              path="/user-management/exporters"
              element={<ExportersPage />}
            />
            <Route
              path="/user-management/users"
              element={<AllUserPage />}
            />
            <Route
              path="/user-management/users/:id"
              element={<SingleUserDetails />}
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
