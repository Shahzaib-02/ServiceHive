// // import React, { useEffect, useMemo, useState } from 'react'
// // import logo from '../images/ServiceHive1.png';
// // import { Link, useLocation, useNavigate } from 'react-router-dom'
// // import {
// //   Activity,
// //   BarChart3,
// //   Bell,
// //   Calendar,
// //   CreditCard,
// //   DollarSign,
// //   Home,
// //   LogOut,
// //   MapPin,
// //   Menu,
// //   Package,
// //   Search,
// //   Settings,
// //   Shield,
// //   Star,
// //   UserCheck,
// //   Users,
// //   X,
// // } from 'lucide-react'
// // import Button from '../components/ui/Button'
// // import { useAuth } from '../hooks/useAuth'
// // import { useRealtime } from '../hooks/useRealtime'
// // import { useServices } from '../hooks/useServices'
// // import { displayUserAvatarUrl } from '../utils/displayAvatar'

// // const roleNavigation = {
// //   customer: [
// //     { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
// //     { name: 'Browse', href: '/browse-services', icon: Search },
// //     { name: 'Bookings', href: '/customer/bookings', icon: Calendar },
// //     { name: 'Tracking', href: '/customer/bookings', icon: MapPin },
// //     { name: 'Payments', href: '/customer/payments', icon: CreditCard },
// //     { name: 'Reviews', href: '/customer/reviews', icon: Star },
// //     { name: 'Profile', href: '/customer/settings', icon: Settings },
// //   ],
// //   provider: [
// //     { name: 'Dashboard', href: '/provider/dashboard', icon: Home },
// //     { name: 'Add Service', href: '/provider/add-service', icon: Package },
// //     { name: 'Manage Services', href: '/provider/manage-services', icon: BarChart3 },
// //     { name: 'Requests', href: '/provider/booking-requests', icon: Calendar },
// //     { name: 'Active Jobs', href: '/provider/active-jobs', icon: Activity },
// //     { name: 'Earnings', href: '/provider/earnings', icon: DollarSign },
// //     { name: 'Profile', href: '/provider/profile', icon: UserCheck },
// //     { name: 'Location', href: '/provider/location-toggle', icon: MapPin },
// //   ],
// //   admin: [
// //     { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
// //     { name: 'Profile', href: '/admin/profile', icon: Settings },
// //     { name: 'Users', href: '/admin/users', icon: Users },
// //     { name: 'Registrations', href: '/admin/approve-providers', icon: UserCheck },
// //     { name: 'Services', href: '/admin/services', icon: Package },
// //     { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
// //     { name: 'Reports', href: '/admin/payments', icon: CreditCard },
// //     { name: 'Monitoring', href: '/admin/monitoring', icon: Shield },
// //   ],
// // }

// // const roleSummary = {
// //   customer: { title: 'Customer workspace', subtitle: 'Bookings, tracking, and service discovery' },
// //   provider: { title: 'Provider workspace', subtitle: 'Operations, earnings, and job flow' },
// //   admin: { title: 'Admin workspace', subtitle: 'Monitoring, approvals, and platform health' },
// // }

// // const roleHomePath = {
// //   customer: '/customer/dashboard',
// //   provider: '/provider/dashboard',
// //   admin: '/admin/dashboard',
// // }

// // const DashboardLayout = ({ children }) => {
// //   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
// //   const location = useLocation()
// //   const navigate = useNavigate()
// //   const { user, logout } = useAuth()
// //   const { notifications } = useRealtime()
// //   const { services, fetchServices } = useServices()

// //   // Use user's actual role, not pathname
// //   const role = user?.role || 'customer'

// //   useEffect(() => {
// //     if (user?.role === 'provider' || user?.role === 'admin') {
// //       fetchServices({ search: '', category: '', group: '' })
// //     }
// //   }, [user?.role, fetchServices])

// //   // Redirect to correct dashboard if user is on wrong path
// //   useEffect(() => {
// //     if (!user) return

// //     // Check if current path matches user's role
// //     const isCorrectPath = 
// //       (role === 'customer' && location.pathname.startsWith('/customer')) ||
// //       (role === 'provider' && location.pathname.startsWith('/provider')) ||
// //       (role === 'admin' && location.pathname.startsWith('/admin'))

// //     if (!isCorrectPath) {
// //       navigate(roleHomePath[role], { replace: true })
// //     }
// //   }, [user, role, location.pathname, navigate])

// //   const providerListingCount = user?.role === 'provider'
// //     ? services.filter((s) => s.providerId === user.id).length
// //     : 0

// //   const profileSettingsHref = useMemo(() => {
// //     if (role === 'provider') {
// //       return '/provider/profile'
// //     }
// //     if (role === 'admin') {
// //       return '/admin/profile'
// //     }
// //     return '/customer/settings'
// //   }, [role])

// //   const navigation = useMemo(() => {
// //     const items = roleNavigation[role]
// //     if (role !== 'provider') {
// //       return items
// //     }
// //     return items.filter((item) => {
// //       if (item.href === '/provider/add-service' && providerListingCount >= 1) {
// //         return false
// //       }
// //       return true
// //     })
// //   }, [role, providerListingCount])

// //   const summary = roleSummary[role]
// //   const displayName = user?.name || summary.title
// //   const displayEmail = user?.email || summary.subtitle
// //   const profileInitial = displayName.charAt(0).toUpperCase()
// //   const avatarSrc = user ? displayUserAvatarUrl(user) : ''

// //   const handleLogout = () => {
// //     logout()
// //     navigate('/login')
// //   }

// //   return (
// //     <div className="min-h-screen lg:flex">
// //       <aside className={`fixed inset-y-0 left-0 z-50 w-[290px] border-r border-white/10 bg-black px-5 py-5 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
// //         <div className="flex h-full flex-col">
// //           <div className="flex items-center justify-between">
// //             <Link to="/" className="flex items-center gap-3">
// //                <div className="relative flex h-11 w-11 items-center justify-center">
// //                 <img src={logo} alt="servicehive logo" srcSet="" className='rounded-md w-10 h-10 transition-transform duration-300 group-hover:scale-110'/>
// //               </div>
// //               <div>
// //                 <p className="font-['Space_Grotesk'] text-lg font-bold text-white">Service Hive</p>
// //                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{role}</p>
// //               </div>
// //             </Link>
// //             <button
// //               type="button"
// //               onClick={() => setIsSidebarOpen(false)}
// //               className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
// //             >
// //               <X className="h-5 w-5" />
// //             </button>
// //           </div>

// //           <Link
// //             to={profileSettingsHref}
// //             onClick={() => setIsSidebarOpen(false)}
// //             className="mt-8 block rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/25 hover:bg-white/[0.06]"
// //           >
// //             <div className="flex items-center gap-3">
// //               <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900">
// //                 {user ? (
// //                   <img 
// //                     src={avatarSrc} 
// //                     alt="" 
// //                     className="h-full w-full object-cover"
// //                     onError={(e) => {
// //                       e.target.style.display = 'none'
// //                       e.target.parentElement.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">${profileInitial}</div>`
// //                     }}
// //                   />
// //                 ) : (
// //                   <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">
// //                     {profileInitial}
// //                   </div>
// //                 )}
// //               </div>
// //               <div className="min-w-0 flex-1">
// //                 <p className="font-semibold text-white">{displayName}</p>
// //                 <p className="truncate text-sm text-slate-400">{displayEmail}</p>
// //                 <p className="mt-2 text-xs font-medium text-cyan-200/90">Profile &amp; photo — tap to edit</p>
// //               </div>
// //             </div>
// //           </Link>

// //           <nav className="mt-8 flex-1 space-y-2">
// //             {navigation.map((item) => {
// //               const Icon = item.icon
// //               const isActive = location.pathname === item.href || (item.href.includes('/tracking/') && location.pathname.startsWith('/customer/tracking'))

// //               return (
// //                 <Link
// //                   key={item.name}
// //                   to={item.href}
// //                   className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
// //                     isActive
// //                       ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border border-yellow-400/30 shadow-lg shadow-yellow-400/20 '
// //                       : 'text-slate-300 hover:bg-white/6 hover:text-yellow-400 hover:shadow-lg'
// //                   }`}
// //                 >
// //                   <Icon className="h-4 w-4" />
// //                   {item.name}
// //                 </Link>
// //               )
// //             })}
// //           </nav>

// //           <div className="space-y-3 border-t border-white/10 pt-5">
// //             <Link to="/browse-services">
// //               <Button variant="secondary" className="w-full">
// //                 Explore services
// //               </Button>
// //             </Link>
// //             <Button variant="outline" className="w-full justify-start text-slate-300" onClick={handleLogout}>
// //               <LogOut className="h-4 w-4" />
// //               Logout
// //             </Button>
// //           </div>
// //         </div>
// //       </aside>

// //       <div className="flex min-h-screen flex-1 flex-col">
// //         <header className="border-b border-white/10 bg-black backdrop-blur-2xl">
// //           <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
// //             <div className="flex items-center gap-3">
// //               <button
// //                 type="button"
// //                 onClick={() => setIsSidebarOpen(true)}
// //                 className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
// //               >
// //                 <Menu className="h-5 w-5" />
// //               </button>
// //               <div>
// //                 <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{summary.title}</p>
// //                 <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white">{summary.subtitle}</h1>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         <main className="flex-1">
// //           <div className="app-content-shell">{children}</div>
// //         </main>
// //       </div>

// //       {isSidebarOpen ? (
// //         <button
// //           type="button"
// //           aria-label="Close navigation overlay"
// //           className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
// //           onClick={() => setIsSidebarOpen(false)}
// //         />
// //       ) : null}
// //     </div>
// //   )
// // }

// // export default DashboardLayout










// import React, { useEffect, useMemo, useState } from 'react'
// import logo from '../images/ServiceHive1.png';
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import {
//   Activity,
//   BarChart3,
//   Bell,
//   Calendar,
//   CreditCard,
//   DollarSign,
//   Home,
//   LogOut,
//   MapPin,
//   Menu,
//   Package,
//   Search,
//   Settings,
//   Shield,
//   Star,
//   UserCheck,
//   Users,
//   X,
// } from 'lucide-react'
// import Button from '../components/ui/Button'
// import { useAuth } from '../hooks/useAuth'
// import { useRealtime } from '../hooks/useRealtime'
// import { useServices } from '../hooks/useServices'
// import { displayUserAvatarUrl } from '../utils/displayAvatar'
// import AdminNotificationBell from './Adminnotificationbell'   // ← ADDED

// const roleNavigation = {
//   customer: [
//     { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
//     { name: 'Browse', href: '/browse-services', icon: Search },
//     { name: 'Bookings', href: '/customer/bookings', icon: Calendar },
//     { name: 'Tracking', href: '/customer/bookings', icon: MapPin },
//     { name: 'Payments', href: '/customer/payments', icon: CreditCard },
//     { name: 'Reviews', href: '/customer/reviews', icon: Star },
//     { name: 'Profile', href: '/customer/settings', icon: Settings },
//   ],
//   provider: [
//     { name: 'Dashboard', href: '/provider/dashboard', icon: Home },
//     { name: 'Add Service', href: '/provider/add-service', icon: Package },
//     { name: 'Manage Services', href: '/provider/manage-services', icon: BarChart3 },
//     { name: 'Requests', href: '/provider/booking-requests', icon: Calendar },
//     { name: 'Active Jobs', href: '/provider/active-jobs', icon: Activity },
//     { name: 'Earnings', href: '/provider/earnings', icon: DollarSign },
//     { name: 'Profile', href: '/provider/profile', icon: UserCheck },
//     { name: 'Location', href: '/provider/location-toggle', icon: MapPin },
//   ],
//   admin: [
//     { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
//     { name: 'Profile', href: '/admin/profile', icon: Settings },
//     { name: 'Users', href: '/admin/users', icon: Users },
//     { name: 'Registrations', href: '/admin/approve-providers', icon: UserCheck },
//     { name: 'Services', href: '/admin/services', icon: Package },
//     { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
//     { name: 'Reports', href: '/admin/payments', icon: CreditCard },
//     { name: 'Monitoring', href: '/admin/monitoring', icon: Shield },
//   ],
// }

// const roleSummary = {
//   customer: { title: 'Customer workspace', subtitle: 'Bookings, tracking, and service discovery' },
//   provider: { title: 'Provider workspace', subtitle: 'Operations, earnings, and job flow' },
//   admin: { title: 'Admin workspace', subtitle: 'Monitoring, approvals, and platform health' },
// }

// const roleHomePath = {
//   customer: '/customer/dashboard',
//   provider: '/provider/dashboard',
//   admin: '/admin/dashboard',
// }

// const DashboardLayout = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false)
//   const location = useLocation()
//   const navigate = useNavigate()
//   const { user, logout } = useAuth()
//   const { notifications } = useRealtime()
//   const { services, fetchServices } = useServices()

//   const role = user?.role || 'customer'

//   useEffect(() => {
//     if (user?.role === 'provider' || user?.role === 'admin') {
//       fetchServices({ search: '', category: '', group: '' })
//     }
//   }, [user?.role, fetchServices])

//   useEffect(() => {
//     if (!user) return
//     const isCorrectPath =
//       (role === 'customer' && location.pathname.startsWith('/customer')) ||
//       (role === 'provider' && location.pathname.startsWith('/provider')) ||
//       (role === 'admin'    && location.pathname.startsWith('/admin'))
//     if (!isCorrectPath) {
//       navigate(roleHomePath[role], { replace: true })
//     }
//   }, [user, role, location.pathname, navigate])

//   const providerListingCount = user?.role === 'provider'
//     ? services.filter((s) => s.providerId === user.id).length
//     : 0

//   const profileSettingsHref = useMemo(() => {
//     if (role === 'provider') return '/provider/profile'
//     if (role === 'admin')    return '/admin/profile'
//     return '/customer/settings'
//   }, [role])

//   const navigation = useMemo(() => {
//     const items = roleNavigation[role]
//     if (role !== 'provider') return items
//     return items.filter((item) => {
//       if (item.href === '/provider/add-service' && providerListingCount >= 1) return false
//       return true
//     })
//   }, [role, providerListingCount])

//   const summary       = roleSummary[role]
//   const displayName   = user?.name  || summary.title
//   const displayEmail  = user?.email || summary.subtitle
//   const profileInitial = displayName.charAt(0).toUpperCase()
//   const avatarSrc     = user ? displayUserAvatarUrl(user) : ''

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   return (
//     <div className="min-h-screen lg:flex">
//       <aside className={`fixed inset-y-0 left-0 z-50 w-[290px] border-r border-white/10 bg-black px-5 py-5 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//         <div className="flex h-full flex-col">
//           <div className="flex items-center justify-between">
//             <Link to="/" className="flex items-center gap-3">
//               <div className="relative flex h-11 w-11 items-center justify-center">
//                 <img src={logo} alt="servicehive logo" className="rounded-md w-10 h-10 transition-transform duration-300 group-hover:scale-110" />
//               </div>
//               <div>
//                 <p className="font-['Space_Grotesk'] text-lg font-bold text-white">Service Hive</p>
//                 <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{role}</p>
//               </div>
//             </Link>
//             <button
//               type="button"
//               onClick={() => setIsSidebarOpen(false)}
//               className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           <Link
//             to={profileSettingsHref}
//             onClick={() => setIsSidebarOpen(false)}
//             className="mt-8 block rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/25 hover:bg-white/[0.06]"
//           >
//             <div className="flex items-center gap-3">
//               <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900">
//                 {user ? (
//                   <img
//                     src={avatarSrc}
//                     alt=""
//                     className="h-full w-full object-cover"
//                     onError={(e) => {
//                       e.target.style.display = 'none'
//                       e.target.parentElement.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">${profileInitial}</div>`
//                     }}
//                   />
//                 ) : (
//                   <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">
//                     {profileInitial}
//                   </div>
//                 )}
//               </div>
//               <div className="min-w-0 flex-1">
//                 <p className="font-semibold text-white">{displayName}</p>
//                 <p className="truncate text-sm text-slate-400">{displayEmail}</p>
//                 <p className="mt-2 text-xs font-medium text-cyan-200/90">Profile &amp; photo — tap to edit</p>
//               </div>
//             </div>
//           </Link>

//           <nav className="mt-8 flex-1 space-y-2">
//             {navigation.map((item) => {
//               const Icon = item.icon
//               const isActive =
//                 location.pathname === item.href ||
//                 (item.href.includes('/tracking/') && location.pathname.startsWith('/customer/tracking'))

//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
//                     isActive
//                       ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border border-yellow-400/30 shadow-lg shadow-yellow-400/20'
//                       : 'text-slate-300 hover:bg-white/6 hover:text-yellow-400 hover:shadow-lg'
//                   }`}
//                 >
//                   <Icon className="h-4 w-4" />
//                   {item.name}
//                 </Link>
//               )
//             })}
//           </nav>

//           <div className="space-y-3 border-t border-white/10 pt-5">
//             <Link to="/browse-services">
//               <Button variant="secondary" className="w-full">
//                 Explore services
//               </Button>
//             </Link>
//             <Button variant="outline" className="w-full justify-start text-slate-300" onClick={handleLogout}>
//               <LogOut className="h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </aside>

//       <div className="flex min-h-screen flex-1 flex-col">
//         <header className="relative z-40 border-b border-white/10 bg-black/95 backdrop-blur-2xl">
//           <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
//             <div className="flex items-center gap-3">
//               <button
//                 type="button"
//                 onClick={() => setIsSidebarOpen(true)}
//                 className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
//               >
//                 <Menu className="h-5 w-5" />
//               </button>
//               <div>
//                 <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{summary.title}</p>
//                 <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white">{summary.subtitle}</h1>
//               </div>
//             </div>

//             {/* ✅ Show notification bell only for admin */}
//             {role === 'admin' && (
//               <div className="flex items-center gap-3">
//                 <AdminNotificationBell />
//               </div>
//             )}
//           </div>
//         </header>

//         <main className="relative z-0 flex-1">
//           <div className="app-content-shell">{children}</div>
//         </main>
//       </div>

//       {isSidebarOpen ? (
//         <button
//           type="button"
//           aria-label="Close navigation overlay"
//           className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       ) : null}
//     </div>
//   )
// }

// export default DashboardLayout










import React, { useEffect, useMemo, useState } from 'react'
import ServiceHiveLogo from '../components/brand/ServiceHiveLogo'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity,
  BarChart3,
  Calendar,
  CreditCard,
  DollarSign,
  Home,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  Shield,
  Star,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { useRealtime } from '../hooks/useRealtime'
import { useServices } from '../hooks/useServices'
import { displayUserAvatarUrl } from '../utils/displayAvatar'
import AdminNotificationBell from './Adminnotificationbell'

const roleNavigation = {
  customer: [
    { name: 'Dashboard', href: '/customer/dashboard', icon: Home },
    { name: 'Browse', href: '/browse-services', icon: Search },
    { name: 'Bookings', href: '/customer/bookings', icon: Calendar },
    { name: 'Tracking', href: '/customer/bookings', icon: MapPin },
    { name: 'Payments', href: '/customer/payments', icon: CreditCard },
    { name: 'Reviews', href: '/customer/reviews', icon: Star },
    { name: 'Profile', href: '/customer/settings', icon: Settings },
  ],
  provider: [
    { name: 'Dashboard', href: '/provider/dashboard', icon: Home },
    { name: 'Add Service', href: '/provider/add-service', icon: Package },
    { name: 'Manage Services', href: '/provider/manage-services', icon: BarChart3 },
    { name: 'Requests', href: '/provider/booking-requests', icon: Calendar },
    { name: 'Active Jobs', href: '/provider/active-jobs', icon: Activity },
    { name: 'Earnings', href: '/provider/earnings', icon: DollarSign },
    { name: 'Profile', href: '/provider/profile', icon: UserCheck },
    { name: 'Location', href: '/provider/location-toggle', icon: MapPin },
  ],
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Profile', href: '/admin/profile', icon: Settings },
    // { name: 'Users', href: '/admin/users', icon: Users },
    // { name: 'Registrations', href: '/admin/approve-providers', icon: UserCheck },
    { name: 'Services', href: '/admin/services', icon: Package },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Reports', href: '/admin/payments', icon: CreditCard },
    { name: 'Monitoring', href: '/admin/monitoring', icon: Shield },
  ],
}

const roleSummary = {
  customer: { title: 'Customer workspace', subtitle: 'Bookings, tracking, and service discovery' },
  provider: { title: 'Provider workspace', subtitle: 'Operations, earnings, and job flow' },
  admin:    { title: 'Admin workspace',    subtitle: 'Monitoring, approvals, and platform health' },
}

const roleHomePath = {
  customer: '/customer/dashboard',
  provider: '/provider/dashboard',
  admin:    '/admin/dashboard',
}

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const { notifications } = useRealtime()
  const { services, fetchServices } = useServices()

  const role = user?.role || 'customer'

  useEffect(() => {
    if (user?.role === 'provider' || user?.role === 'admin') {
      fetchServices({ search: '', category: '', group: '' })
    }
  }, [user?.role, fetchServices])

  useEffect(() => {
    if (!user) return
    const isCorrectPath =
      (role === 'customer' && location.pathname.startsWith('/customer')) ||
      (role === 'provider' && location.pathname.startsWith('/provider')) ||
      (role === 'admin'    && location.pathname.startsWith('/admin'))
    if (!isCorrectPath) navigate(roleHomePath[role], { replace: true })
  }, [user, role, location.pathname, navigate])

  const providerListingCount = user?.role === 'provider'
    ? services.filter((s) => s.providerId === user.id).length
    : 0

  const profileSettingsHref = useMemo(() => {
    if (role === 'provider') return '/provider/profile'
    if (role === 'admin')    return '/admin/profile'
    return '/customer/settings'
  }, [role])

  const navigation = useMemo(() => {
    const items = roleNavigation[role]
    if (role !== 'provider') return items
    return items.filter((item) => {
      if (item.href === '/provider/add-service' && providerListingCount >= 1) return false
      return true
    })
  }, [role, providerListingCount])

  const summary        = roleSummary[role]
  const displayName    = user?.name  || summary.title
  const displayEmail   = user?.email || summary.subtitle
  const profileInitial = displayName.charAt(0).toUpperCase()
  const avatarSrc      = user ? displayUserAvatarUrl(user) : ''

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen lg:flex   overflow-x-hidden">

      {/* ════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[290px] border-r border-white/10 bg-black backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* px-5 py-5 moved here so the scroll container can go edge-to-edge */}
        <div className="flex h-full flex-col px-5 py-5">

          {/* ── Logo + close button — never scrolls ── */}
          <div className="flex flex-shrink-0 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center">
                <ServiceHiveLogo className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <p className="font-['Space_Grotesk'] text-lg font-bold text-white">Service Hive</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{role}</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ── Scrollable area: profile card + nav links ── */}
          <div
            className=" mt-8 flex-1 overflow-y-auto overflow-x-hidden pb-2"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Profile card */}
            <Link
              to={profileSettingsHref}
              onClick={() => setIsSidebarOpen(false)}
              className="block rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-yellow-400/25 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-slate-900">
                  {user ? (
                    <img
                      src={avatarSrc}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.parentElement.innerHTML = `<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">${profileInitial}</div>`
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">
                      {profileInitial}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-white">{displayName}</p>
                  <p className="truncate text-sm text-slate-400">{displayEmail}</p>
                  <p className="mt-2 text-xs font-medium text-yellow-500">Profile &amp; photo — tap to edit</p>
                </div>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="mt-8 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive =
                  location.pathname === item.href ||
                  (item.href.includes('/tracking/') && location.pathname.startsWith('/customer/tracking'))

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      isActive
                        ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border border-yellow-400/30 shadow-lg shadow-yellow-400/20'
                        : 'text-slate-300 hover:bg-white/6 hover:text-yellow-400 hover:shadow-lg'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* ── Logout footer — never scrolls ── */}
          <div className="flex-shrink-0 space-y-3 border-t border-white/10 pt-5">
            <Link to="/browse-services" onClick={() => setIsSidebarOpen(false)}>
              <Button variant="secondary" className="w-full">
                Explore services
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full justify-start text-slate-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════ */}
      <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">

        {/* Header */}
        <header className="relative z-40 border-b border-white/10 bg-black/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{summary.title}</p>
                <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white">{summary.subtitle}</h1>
              </div>
            </div>

            {/* Notification bell — admin only */}
            {role === 'admin' && (
              <div className="flex items-center gap-3">
                <AdminNotificationBell />
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="relative z-0 flex-1">
          <div className="app-content-shell">{children}</div>
        </main>

      </div>

      {/* ── Mobile overlay backdrop ── */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

    </div>
  )
}

export default DashboardLayout