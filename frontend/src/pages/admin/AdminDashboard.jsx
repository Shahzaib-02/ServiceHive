

// import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import {
//   Calendar,
//   CreditCard,
//   Shield,
//   Users,
//   TrendingUp,
//   AlertCircle,
//   UserPlus,
//   FileText,
//   ArrowRight,
// } from 'lucide-react'
// import Card from '../../components/ui/Card.jsx'
// import Button from '../../components/ui/Button.jsx'
// import { useAuth } from '../../hooks/useAuth'
// import { apiRequest } from '../../services/api/client.js'
// import ServiceHiveChatbot from '../../components/chatbot/ServiceHiveChatbot.jsx'

// const AdminDashboard = () => {
//   const { token, user } = useAuth()
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     pendingApprovals: 0,
//     approvedUsers: 0,
//     rejectedUsers: 0,
//     totalBookings: 0,
//     totalServices: 0,
//     totalRevenue: 0,
//   })
//   const [payments, setPayments] = useState([])
//   const [paymentsLoading, setPaymentsLoading] = useState(true)
//   const [loading, setLoading] = useState(true)

//   // Load user + booking stats from backend
//   useEffect(() => {
//     const loadDashboardData = async () => {
//       try {
//         if (!token) { setLoading(false); return }

//         const response = await apiRequest({
//           path: '/api/admin/users',
//           method: 'GET',
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         const approvedUsers = response.approvedUsers || []
//         const pendingUsers = response.pendingUsers || []
//         const totalUsers = approvedUsers.length + pendingUsers.length
//         const pendingApprovals = pendingUsers.length
//         const approvedCount = approvedUsers.filter((u) => u.isApproved).length
//         const rejectedUsers = approvedUsers.filter((u) => u.isSuspended && !u.isApproved).length

//         const bookingsResponse = await apiRequest({
//           path: '/api/admin/bookings/stats',
//           method: 'GET',
//           headers: { Authorization: `Bearer ${token}` },
//         }).catch(() => ({ totalBookings: 0, totalRevenue: 0 }))

//         setStats({
//           totalUsers,
//           pendingApprovals,
//           approvedUsers: approvedCount,
//           rejectedUsers,
//           totalBookings: bookingsResponse.totalBookings || 0,
//           totalServices: 0,
//           totalRevenue: bookingsResponse.totalRevenue || 0,
//         })
//       } catch (error) {
//         console.error('Error loading dashboard data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadDashboardData()
//   }, [token])

//   // Load payment data from backend
//   useEffect(() => {
//     const loadPayments = async () => {
//       try {
//         if (!token) { setPaymentsLoading(false); return }

//         const response = await apiRequest({
//           path: '/api/admin/payments',
//           method: 'GET',
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         // ✅ Map Payment model fields correctly
//         const mapped = (response.payments || []).map(p => ({
//           id: p._id,
//           // Service name: from populated bookingId or fallback
//           service: p.bookingId?.serviceTitle || 'Service',
//           // ✅ Use totalAmount from Payment model (NOT booking.amount)
//           amount: p.totalAmount || 0,
//           customer: p.customerId?.name || 'Customer',
//           provider: p.providerId?.name || 'Provider',
//           paidAt: p.paidAt,
//           status: p.paymentStatus,
//         }))

//         setPayments(mapped)
//         setStats(prev => ({
//           ...prev,
//           // ✅ totalRevenue now comes from Payment collection sum
//           totalRevenue: response.totalRevenue || 0,
//           totalBookings: response.totalPayments || prev.totalBookings,
//         }))
//       } catch (error) {
//         console.error('Error loading payments:', error)
//       } finally {
//         setPaymentsLoading(false)
//       }
//     }

//     loadPayments()
//   }, [token])

//   const summaryCards = [
//     {
//       title: 'Total Users',
//       value: loading ? '...' : String(stats.totalUsers),
//       detail: 'All registered users',
//       icon: Users,
//       trend: stats.totalUsers > 0 ? '+' + stats.totalUsers : '0',
//       color: 'emerald',
//     },
//     {
//       title: 'Pending Approvals',
//       value: loading ? '...' : String(stats.pendingApprovals),
//       detail: 'Awaiting your decision',
//       icon: AlertCircle,
//       trend: stats.pendingApprovals > 0 ? stats.pendingApprovals + ' pending' : 'None',
//       color: 'amber',
//     },
//     {
//       title: 'Active Services',
//       value: loading ? '...' : String(stats.totalServices),
//       detail: 'Service listings',
//       icon: FileText,
//       trend: stats.totalServices > 0 ? '+' + stats.totalServices : '0',
//       color: 'blue',
//     },
//     {
//       title: 'Total Bookings',
//       value: loading ? '...' : String(stats.totalBookings),
//       detail: 'Platform bookings',
//       icon: Calendar,
//       trend: stats.totalBookings > 0 ? '+' + stats.totalBookings : '0',
//       color: 'violet',
//     },
//   ]

//   const quickAccess = [
//     {
//       title: 'Registration queue',
//       description: 'Approve or reject customer and provider signups.',
//       href: '/admin/approve-providers',
//       buttonLabel: 'Open queue',
//       icon: UserPlus,
//       badge: stats.pendingApprovals,
//       color: 'emerald',
//     },
//     {
//       title: 'User management',
//       description: 'View and manage all registered users.',
//       href: '/admin/manage-users',
//       buttonLabel: 'Manage users',
//       icon: Users,
//       color: 'blue',
//     },
//     {
//       title: 'All bookings',
//       description: 'Monitor jobs across the marketplace.',
//       href: '/admin/bookings',
//       buttonLabel: 'View bookings',
//       icon: Calendar,
//       color: 'violet',
//     },
//     {
//       title: 'Service listings',
//       description: 'Manage service providers and listings.',
//       href: '/admin/services',
//       buttonLabel: 'Manage services',
//       icon: FileText,
//       color: 'amber',
//     },
//   ]

//   const recentActivity = loading
//     ? []
//     : [
//         ...(stats.pendingApprovals > 0
//           ? [
//               {
//                 title: `${stats.pendingApprovals} pending user registrations`,
//                 description: 'Users waiting for admin approval',
//                 time: new Date().toLocaleDateString(),
//                 status: 'pending',
//                 icon: AlertCircle,
//               },
//             ]
//           : []),
//       ]

//   return (
//     <>
//       <div className="space-y-8">

//         {/* Header */}
//         <div className="dashboard-hero-panel relative overflow-hidden">
//           <div className="relative z-10 p-6 sm:p-8 lg:p-10">
//             <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/90">
//               <Shield className="h-3.5 w-3.5" />
//               Admin Dashboard
//             </div>
//             <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
//               Welcome back, {user?.name || 'Admin'}
//             </h1>
//             <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
//               {loading
//                 ? 'Loading dashboard...'
//                 : `Managing ${stats.totalUsers} users, ${stats.totalServices} services, and ${stats.totalBookings} bookings`}
//             </p>
//             <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
//               <Link to="/admin/approve-providers">
//                 <Button variant="outline" className="w-full justify-center sm:w-auto">
//                   <Users className="h-4 w-4" />
//                   Review registrations ({stats.pendingApprovals})
//                 </Button>
//               </Link>
//               <Link to="/admin/manage-users">
//                 <Button variant="secondary" className="w-full justify-center sm:w-auto">
//                   <Users className="h-4 w-4" />
//                   Manage users ({stats.totalUsers})
//                 </Button>
//               </Link>
//               <Link to="/admin/bookings">
//                 <Button variant="outline" className="w-full justify-center sm:w-auto">
//                   <Calendar className="h-4 w-4" />
//                   View bookings ({stats.totalBookings})
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
//           {summaryCards.map(({ title, value, detail, icon: Icon, trend, color }) => (
//             <Card key={title} hover={true} className="dashboard-stat-card group relative overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//               <div className="relative flex items-start justify-between gap-4">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-2">
//                     <p className="text-sm font-medium text-slate-400">{title}</p>
//                     {trend && (
//                       <div
//                         className={`flex items-center gap-1 text-xs font-medium ${
//                           trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
//                         }`}
//                       >
//                         <TrendingUp className="h-3 w-3" />
//                         {trend}
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-3xl font-bold tabular-nums text-white">{value}</p>
//                   <p className="mt-2 text-xs font-medium text-slate-400">{detail}</p>
//                 </div>
//                 <div
//                   className={`rounded-2xl border border-${color}-400/25 bg-${color}-500/10 p-3 text-${color}-200`}
//                 >
//                   <Icon className="h-5 w-5" />
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {/* Quick Access */}
//         <Card hover={false} className="dashboard-hero-panel border-white/10 p-6 sm:p-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white sm:text-2xl">
//               Administrative areas
//             </h2>
//             <div className="text-sm text-slate-400">
//               {stats.pendingApprovals > 0 && `${stats.pendingApprovals} pending approvals`}
//             </div>
//           </div>
//           <div className="grid gap-4 md:grid-cols-2">
//             {quickAccess.map((area) => (
//               <div
//                 key={area.title}
//                 className="group relative rounded-2xl border border-white/10 bg-slate-950/40 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:bg-slate-950/60 hover:scale-[1.02]"
//               >
//                 <div className="absolute top-4 right-4">
//                   {area.badge > 0 && (
//                     <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
//                       {area.badge}
//                     </div>
//                   )}
//                 </div>
//                 <div className="flex items-start gap-4">
//                   <div
//                     className={`rounded-xl border border-${area.color}-400/20 bg-${area.color}-500/10 p-3 text-${area.color}-200`}
//                   >
//                     <area.icon className="h-5 w-5" />
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-white transition-colors">{area.title}</h3>
//                     <p className="mt-2 text-sm leading-relaxed text-slate-400">{area.description}</p>
//                     <Link to={area.href} className="mt-4 block">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full justify-center border-white/15 hover:bg-white/10 hover:border-white/25"
//                       >
//                         {area.buttonLabel}
//                         <ArrowRight className="h-4 w-4 ml-2" />
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Recent Transactions */}
//         <Card hover={false} className="border-white/10 p-6 sm:p-8">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white">
//               Recent Transactions
//             </h2>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-slate-400">
//                 Total Revenue:{' '}
//                 <span className="text-emerald-400 font-semibold">
//                   PKR {stats.totalRevenue.toLocaleString()}
//                 </span>
//               </span>
//               <Link to="/admin/payments">
//                 <Button variant="outline" size="sm">
//                   View All Payments
//                 </Button>
//               </Link>
//             </div>
//           </div>
//           <div className="space-y-4">
//             {paymentsLoading ? (
//               <div className="text-center py-8 text-slate-400">Loading payments...</div>
//             ) : payments.length === 0 ? (
//               <div className="text-center py-8 text-slate-400">
//                 <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
//                 <p>No payments received yet</p>
//               </div>
//             ) : (
//               payments.slice(0, 5).map((payment) => (
//                 <div
//                   key={payment.id || payment._id}
//                   className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-colors"
//                 >
//                   <div className="rounded-lg bg-emerald-500/20 p-2">
//                     <CreditCard className="h-4 w-4 text-emerald-400" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center justify-between">
//                       <h4 className="text-sm font-medium text-white">{payment.service}</h4>
//                       <span className="text-emerald-400 font-semibold">
//                         PKR {Number(payment.amount || 0).toLocaleString()}
//                       </span>
//                     </div>
//                     <p className="text-xs text-slate-400 mt-1">
//                       Customer: {payment.customer} • Provider: {payment.provider}
//                     </p>
//                     <div className="flex items-center gap-2 mt-2">
//                       <span className="text-xs text-slate-500">
//                         {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
//                       </span>
//                       <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
//                         Payment Received
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </Card>

//         {/* Recent Activity */}
//         {!loading && recentActivity.length > 0 && (
//           <Card hover={false} className="border-white/10 p-6 sm:p-8">
//             <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white mb-6">
//               Recent Activity
//             </h2>
//             <div className="space-y-4">
//               {recentActivity.map((activity, index) => (
//                 <div
//                   key={index}
//                   className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/5"
//                 >
//                   <div className="rounded-lg bg-slate-700/50 p-2">
//                     <activity.icon className="h-4 w-4 text-slate-300" />
//                   </div>
//                   <div className="flex-1">
//                     <h4 className="text-sm font-medium text-white">{activity.title}</h4>
//                     <p className="text-xs text-slate-400 mt-1">{activity.description}</p>
//                     <div className="flex items-center gap-2 mt-2">
//                       <span className="text-xs text-slate-500">{activity.time}</span>
//                       <span
//                         className={`px-2 py-1 text-xs rounded-full ${
//                           activity.status === 'pending'
//                             ? 'bg-yellow-500/20 text-yellow-400'
//                             : activity.status === 'approved'
//                             ? 'bg-green-500/20 text-green-400'
//                             : activity.status === 'rejected'
//                             ? 'bg-red-500/20 text-red-400'
//                             : 'bg-blue-500/20 text-blue-400'
//                         }`}
//                       >
//                         {activity.status || 'active'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         )}
//       </div>

//       <ServiceHiveChatbot />
//     </>
//   )
// }

// export default AdminDashboard






import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  CreditCard,
  Shield,
  Users,
  TrendingUp,
  AlertCircle,
  UserPlus,
  FileText,
  ArrowRight,
} from 'lucide-react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { useAuth } from '../../hooks/useAuth'
import { useBookings } from '../../hooks/useBookings'         // ← ADDED
import { apiRequest } from '../../services/api/client.js'
import ServiceHiveChatbot from '../../components/chatbot/ServiceHiveChatbot.jsx'

const AdminDashboard = () => {
  const { token, user } = useAuth()
  const { bookings } = useBookings()                          // ← ADDED

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingApprovals: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    totalBookings: 0,
    totalServices: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  // ✅ Derive payments directly from bookings context (same as report page)
  // No separate API call needed — bookings are already fetched on login
  const payments = bookings
   .filter(b => ['paid', 'held', 'completed', 'refund_pending'].includes(b.paymentStatus))
    .map(b => ({
      id: b._id,
      service:
        typeof b.serviceId === 'object'
          ? b.serviceId?.title || b.serviceId?.category?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Service'
          : b.serviceTitle || 'Service',
      amount: b.totalAmount || b.amount || 0,
      customer: typeof b.customerId === 'object' ? b.customerId?.name || 'Customer' : 'Customer',
      provider: typeof b.providerId === 'object' ? b.providerId?.name || 'Provider' : 'Provider',
      // Use paidAt when available, otherwise fallback to updatedAt or createdAt so UI shows a date
      paidAt: b.paidAt || b.updatedAt || b.createdAt || null,
      status: b.paymentStatus,
    }))

  // ✅ Calculate total revenue from paid bookings
  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)

  // Load user stats from backend
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!token) { setLoading(false); return }

        const response = await apiRequest({
          path: '/api/admin/users',
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        })

        const approvedUsers = response.approvedUsers || []
        const pendingUsers = response.pendingUsers || []
        const totalUsers = approvedUsers.length + pendingUsers.length
        const pendingApprovals = pendingUsers.length
        const approvedCount = approvedUsers.filter((u) => u.isApproved).length
        const rejectedUsers = approvedUsers.filter((u) => u.isSuspended && !u.isApproved).length

        setStats(prev => ({
          ...prev,
          totalUsers,
          pendingApprovals,
          approvedUsers: approvedCount,
          rejectedUsers,
        }))
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [token])

  // ✅ Keep stats in sync whenever bookings or revenue change
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalBookings: bookings.length,
      totalRevenue,
    }))
  }, [bookings, totalRevenue])

  const summaryCards = [
    {
      title: 'Total Users',
      value: loading ? '...' : String(stats.totalUsers),
      detail: 'All registered users',
      icon: Users,
      trend: stats.totalUsers > 0 ? '+' + stats.totalUsers : '0',
      color: 'emerald',
    },
    {
      title: 'Pending Approvals',
      value: loading ? '...' : String(stats.pendingApprovals),
      detail: 'Awaiting your decision',
      icon: AlertCircle,
      trend: stats.pendingApprovals > 0 ? stats.pendingApprovals + ' pending' : 'None',
      color: 'amber',
    },
    {
      title: 'Active Services',
      value: loading ? '...' : String(stats.totalServices),
      detail: 'Service listings',
      icon: FileText,
      trend: stats.totalServices > 0 ? '+' + stats.totalServices : '0',
      color: 'blue',
    },
    {
      title: 'Total Bookings',
      value: loading ? '...' : String(stats.totalBookings),
      detail: 'Platform bookings',
      icon: Calendar,
      trend: stats.totalBookings > 0 ? '+' + stats.totalBookings : '0',
      color: 'violet',
    },
  ]

  const quickAccess = [
    {
      title: 'Registration queue',
      description: 'Approve or reject customer and provider signups.',
      href: '/admin/approve-providers',
      buttonLabel: 'Open queue',
      icon: UserPlus,
      badge: stats.pendingApprovals,
      color: 'emerald',
    },
    {
      title: 'User management',
      description: 'View and manage all registered users.',
      href: '/admin/manage-users',
      buttonLabel: 'Manage users',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'All bookings',
      description: 'Monitor jobs across the marketplace.',
      href: '/admin/bookings',
      buttonLabel: 'View bookings',
      icon: Calendar,
      color: 'violet',
    },
    {
      title: 'Service listings',
      description: 'Manage service providers and listings.',
      href: '/admin/services',
      buttonLabel: 'Manage services',
      icon: FileText,
      color: 'amber',
    },
  ]

  const recentActivity = loading
    ? []
    : [
        ...(stats.pendingApprovals > 0
          ? [
              {
                title: `${stats.pendingApprovals} pending user registrations`,
                description: 'Users waiting for admin approval',
                time: new Date().toLocaleDateString(),
                status: 'pending',
                icon: AlertCircle,
              },
            ]
          : []),
      ]

  return (
    <>
      <div className="space-y-8">

        {/* Header */}
        <div className="dashboard-hero-panel relative overflow-hidden">
          <div className="relative z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/90">
              <Shield className="h-3.5 w-3.5" />
              Admin Dashboard
            </div>
            <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
              Welcome back, {user?.name || 'Admin'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              {loading
                ? 'Loading dashboard...'
                : `Managing ${stats.totalUsers} users, ${stats.totalServices} services, and ${stats.totalBookings} bookings`}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* <Link to="/admin/approve-providers">
                <Button variant="outline" className="w-full justify-center sm:w-auto">
                  <Users className="h-4 w-4" />
                  Review registrations ({stats.pendingApprovals})
                </Button>
              </Link> */}
              <Link to="/admin/manage-users">
                <Button variant="secondary" className="w-full justify-center sm:w-auto">
                  <Users className="h-4 w-4" />
                  Manage users ({stats.totalUsers})
                </Button>
              </Link>
              <Link to="/admin/bookings">
                <Button variant="outline" className="w-full justify-center sm:w-auto">
                  <Calendar className="h-4 w-4" />
                  View bookings ({stats.totalBookings})
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ title, value, detail, icon: Icon, trend, color }) => (
            <Card key={title} hover={true} className="dashboard-stat-card group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    {trend && (
                      <div
                        className={`flex items-center gap-1 text-xs font-medium ${
                          trend.startsWith('+') ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        <TrendingUp className="h-3 w-3" />
                        {trend}
                      </div>
                    )}
                  </div>
                  <p className="text-3xl font-bold tabular-nums text-white">{value}</p>
                  <p className="mt-2 text-xs font-medium text-slate-400">{detail}</p>
                </div>
                <div
                  className={`rounded-2xl border border-${color}-400/25 bg-${color}-500/10 p-3 text-${color}-200`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Access */}
        {/* <Card hover={false} className="dashboard-hero-panel border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white sm:text-2xl">
              Administrative areas
            </h2>
            <div className="text-sm text-slate-400">
              {stats.pendingApprovals > 0 && `${stats.pendingApprovals} pending approvals`}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {quickAccess.map((area) => (
              <div
                key={area.title}
                className="group relative rounded-2xl border border-white/10 bg-slate-950/40 p-5 transition-all duration-300 hover:border-emerald-400/30 hover:bg-slate-950/60 hover:scale-[1.02]"
              >
                <div className="absolute top-4 right-4">
                  {area.badge > 0 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                      {area.badge}
                    </div>
                  )}
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-xl border border-${area.color}-400/20 bg-${area.color}-500/10 p-3 text-${area.color}-200`}
                  >
                    <area.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white transition-colors">{area.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{area.description}</p>
                    <Link to={area.href} className="mt-4 block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-center border-white/15 hover:bg-white/10 hover:border-white/25"
                      >
                        {area.buttonLabel}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card> */}

        {/* Recent Transactions */}
        <Card hover={false} className="border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white">
              Recent Transactions
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">
                Total Revenue:{' '}
                <span className="text-emerald-400 font-semibold">
                  PKR {totalRevenue.toLocaleString()}
                </span>
              </span>
              <Link to="/admin/payments">
                <Button variant="outline" size="sm">
                  View All Payments
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No payments received yet</p>
              </div>
            ) : (
              payments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="rounded-lg bg-emerald-500/20 p-2">
                    <CreditCard className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">{payment.service}</h4>
                      <span className="text-emerald-400 font-semibold">
                        PKR {Number(payment.amount || 0).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Customer: {payment.customer} • Provider: {payment.provider}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">
                        {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                        Payment Received
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        {!loading && recentActivity.length > 0 && (
          <Card hover={false} className="border-white/10 p-6 sm:p-8">
            <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-white/5"
                >
                  <div className="rounded-lg bg-slate-700/50 p-2">
                    <activity.icon className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-500">{activity.time}</span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          activity.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : activity.status === 'approved'
                            ? 'bg-green-500/20 text-green-400'
                            : activity.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {activity.status || 'active'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <ServiceHiveChatbot />
    </>
  )
}

export default AdminDashboard