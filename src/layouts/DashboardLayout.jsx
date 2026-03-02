import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, X, Home, Users, Calendar, DollarSign, Settings, 
  LogOut, Package, MapPin, Star, FileText, TrendingUp,
  UserCheck, Shield, Activity, CreditCard, BarChart3
} from 'lucide-react'

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem('user')
    return userData ? JSON.parse(userData) : null
  }

  const user = getUserData()

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  const getNavigationItems = () => {
    const path = location.pathname
    
    if (path.startsWith('/customer')) {
      return [
        { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
        { name: 'Browse Services', href: '/browse-services', icon: Search },
        { name: 'My Bookings', href: '/customer/bookings', icon: Calendar },
        { name: 'Live Tracking', href: '/customer/tracking/1', icon: MapPin },
        { name: 'Payments', href: '/customer/payments', icon: CreditCard },
        { name: 'Reviews', href: '/customer/reviews', icon: Star },
        { name: 'Profile Settings', href: '/customer/profile', icon: Settings },
      ]
    } else if (path.startsWith('/provider')) {
      return [
        { name: 'Dashboard', href: '/provider/dashboard', icon: Home },
        { name: 'Add Service', href: '/provider/add-service', icon: Package },
        { name: 'Manage Services', href: '/provider/manage-services', icon: FileText },
        { name: 'Booking Requests', href: '/provider/booking-requests', icon: Calendar },
        { name: 'Active Jobs', href: '/provider/active-jobs', icon: Activity },
        { name: 'Earnings', href: '/provider/earnings', icon: DollarSign },
        { name: 'Profile', href: '/provider/profile', icon: UserCheck },
        { name: 'Location Toggle', href: '/provider/location-toggle', icon: MapPin },
      ]
    } else if (path.startsWith('/admin')) {
      return [
        { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
        { name: 'Manage Users', href: '/admin/users', icon: Users },
        { name: 'Approve Providers', href: '/admin/approve-providers', icon: UserCheck },
        { name: 'Manage Services', href: '/admin/manage-services', icon: Package },
        { name: 'All Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Payments & Reports', href: '/admin/payments-reports', icon: BarChart3 },
        { name: 'Live Monitoring', href: '/admin/monitoring', icon: Shield },
      ]
    }
    return []
  }

  const navigation = getNavigationItems()
  const getUserRole = () => {
    const path = location.pathname
    if (path.startsWith('/customer')) return 'Customer'
    if (path.startsWith('/provider')) return 'Provider'
    if (path.startsWith('/admin')) return 'Admin'
    return 'User'
  }

  
  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="gradient-text font-bold text-xl">ServiceHive</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{getUserRole()[0]}</span>
              </div>
              <div>
                <p className="text-white font-medium">{getUserRole()}</p>
                <p className="text-gray-400 text-sm">user@example.com</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Bar */}
        <header className="glass-card border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                <span>Welcome back,</span>
                <span className="text-white font-medium">{user?.name || getUserRole()}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5">
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1 right-1"></div>
                  <span className="sr-only">Notifications</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{user?.name?.charAt(0) || getUserRole()[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardLayout
