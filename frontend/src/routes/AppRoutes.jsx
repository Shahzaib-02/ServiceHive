import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../hooks/useAuth'
import CustomerDashboardPage from '../pages/customer/CustomerDashboard'
import ProviderDashboardPage from '../pages/provider/ProviderDashboard'
import AdminDashboardPage from '../pages/admin/AdminDashboard'
import AdminManageServicesPage from '../pages/admin/AdminManageServicesPage'
import BrowseServicesPage from '../pages/services/BrowseServicesPage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import AddServicePage from '../pages/provider/AddServicePage'
import {
  ActiveJobsPage,
  AdminProfileSettings,
  AllBookingsPage,
  ApproveProvidersPage,
  BookingFormPage,
  BookingRequestsPage,
  CustomerProfileSettings,
  CustomerServiceDetails,
  EditServicePage,
  EarningsPage,
  LandingPage,
  LiveLocationTogglePage,
  LiveMonitoringMapPage,
  LiveTrackingPage,
  ManageServicesPage,
  ManageUsersPage,
  MyBookingsPage,
  PaymentsPage,
  PaymentsReportsPage,
  ProviderProfilePage,
  ReviewsPage,
  ServiceSubcategoryPage,
  ProviderServiceManagementPage,
} from '../pages/PageLibrary'
import AboutPage from '../pages/public/AboutPage'

const roleHomePath = {
  customer: '/customer/dashboard',
  provider: '/provider/dashboard',
  admin: '/admin/dashboard',
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to={roleHomePath[role] || '/'} replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/browse-services" element={<MainLayout><BrowseServicesPage /></MainLayout>} />
      <Route path="/services/:categoryId" element={<MainLayout><ServiceSubcategoryPage /></MainLayout>} />

      <Route path="/customer/dashboard" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><CustomerDashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/service-details/:id" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><CustomerServiceDetails /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/booking/:id" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><BookingFormPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/bookings" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><MyBookingsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/tracking/:id" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><LiveTrackingPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/payments" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><PaymentsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/reviews" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><ReviewsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/settings" element={<ProtectedRoute allowedRoles={['customer']}><DashboardLayout><CustomerProfileSettings /></DashboardLayout></ProtectedRoute>} />

      <Route path="/provider/dashboard" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><ProviderDashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/add-service" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><AddServicePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/manage-services" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><ManageServicesPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/edit-service/:id" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><EditServicePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/booking-requests" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><BookingRequestsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/active-jobs" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><ActiveJobsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/earnings" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><EarningsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/profile" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><ProviderProfilePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/location-toggle" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><LiveLocationTogglePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/services" element={<ProtectedRoute allowedRoles={['provider']}><DashboardLayout><ProviderServiceManagementPage /></DashboardLayout></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminDashboardPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminProfileSettings /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/approve-providers" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ApproveProvidersPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/manage-users" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><ManageUsersPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AdminManageServicesPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><AllBookingsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><PaymentsReportsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/monitoring" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout><LiveMonitoringMapPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
