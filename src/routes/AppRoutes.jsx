import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'

// Public Pages
import LandingPage from '../pages/public/LandingPage'
import AboutPage from '../pages/public/AboutPage'
import BrowseServicesPage from '../pages/public/BrowseServicesPage'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Customer Pages
import CustomerDashboard from '../pages/customer/CustomerDashboard'
import CustomerServiceDetails from '../pages/customer/CustomerServiceDetails'
import BookingFormPage from '../pages/customer/BookingFormPage'
import MyBookingsPage from '../pages/customer/MyBookingsPage'
import LiveTrackingPage from '../pages/customer/LiveTrackingPage'
import PaymentsPage from '../pages/customer/PaymentsPage'
import ReviewsPage from '../pages/customer/ReviewsPage'
import CustomerProfileSettings from '../pages/customer/CustomerProfileSettings'

// Provider Pages
import ProviderDashboard from '../pages/provider/ProviderDashboard'
import AddServicePage from '../pages/provider/AddServicePage'
import ManageServicesPage from '../pages/provider/ManageServicesPage'
import BookingRequestsPage from '../pages/provider/BookingRequestsPage'
import ActiveJobsPage from '../pages/provider/ActiveJobsPage'
import EarningsPage from '../pages/provider/EarningsPage'
import ProviderProfilePage from '../pages/provider/ProviderProfilePage'
import LiveLocationTogglePage from '../pages/provider/LiveLocationTogglePage'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageUsersPage from '../pages/admin/ManageUsersPage'
import ApproveProvidersPage from '../pages/admin/ApproveProvidersPage'
import AdminManageServicesPage from '../pages/admin/AdminManageServicesPage'
import AllBookingsPage from '../pages/admin/AllBookingsPage'
import PaymentsReportsPage from '../pages/admin/PaymentsReportsPage'
import LiveMonitoringMapPage from '../pages/admin/LiveMonitoringMapPage'

// Authentication check
const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true'
}

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
      <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
      <Route path="/browse-services" element={<MainLayout><BrowseServicesPage /></MainLayout>} />

      {/* Customer Routes */}
      <Route path="/customer/dashboard" element={<ProtectedRoute><DashboardLayout><CustomerDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/service-details/:id" element={<ProtectedRoute><DashboardLayout><CustomerServiceDetails /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/booking/:id" element={<ProtectedRoute><DashboardLayout><BookingFormPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/bookings" element={<ProtectedRoute><DashboardLayout><MyBookingsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/tracking/:id" element={<ProtectedRoute><DashboardLayout><LiveTrackingPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/payments" element={<ProtectedRoute><DashboardLayout><PaymentsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/reviews" element={<ProtectedRoute><DashboardLayout><ReviewsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/customer/settings" element={<ProtectedRoute><DashboardLayout><CustomerProfileSettings /></DashboardLayout></ProtectedRoute>} />

      {/* Provider Routes */}
      <Route path="/provider/dashboard" element={<ProtectedRoute><DashboardLayout><ProviderDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/add-service" element={<ProtectedRoute><DashboardLayout><AddServicePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/manage-services" element={<ProtectedRoute><DashboardLayout><ManageServicesPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/booking-requests" element={<ProtectedRoute><DashboardLayout><BookingRequestsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/active-jobs" element={<ProtectedRoute><DashboardLayout><ActiveJobsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/earnings" element={<ProtectedRoute><DashboardLayout><EarningsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/profile" element={<ProtectedRoute><DashboardLayout><ProviderProfilePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/provider/location-toggle" element={<ProtectedRoute><DashboardLayout><LiveLocationTogglePage /></DashboardLayout></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><DashboardLayout><AdminDashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><DashboardLayout><ManageUsersPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/approve-providers" element={<ProtectedRoute><DashboardLayout><ApproveProvidersPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute><DashboardLayout><AdminManageServicesPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute><DashboardLayout><AllBookingsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute><DashboardLayout><PaymentsReportsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/admin/monitoring" element={<ProtectedRoute><DashboardLayout><LiveMonitoringMapPage /></DashboardLayout></ProtectedRoute>} />
    </Routes>
  )
}

export default AppRoutes
