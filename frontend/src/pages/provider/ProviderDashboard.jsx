


















import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  DollarSign,
  Package,
  Star,
  Users,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Award,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'
import { useBookings } from '../../hooks/useBookings'
import { useServices } from '../../hooks/useServices'
import { BOOKING_STATUS } from '../../utils/bookingStatus'
import { sumProviderEarnings, ADMIN_COMMISSION_RATE } from '../../utils/earnings'
import { formatMoney } from '../../utils/format'
import ServiceHiveChatbot from '../../components/chatbot/ServiceHiveChatbot'

const ProviderDashboard = () => {
  const { user } = useAuth()
  const { services, fetchServices } = useServices()
  const { bookings, fetchBookings } = useBookings()
  const navigate = useNavigate()

  // Toast state
  const [toast, setToast] = useState({ 
    message: '', 
    type: 'warning', 
    isVisible: false 
  })

  useEffect(() => {
    fetchServices({ search: '', category: '', group: '' })
    fetchBookings()
  }, [fetchServices, fetchBookings])

  // FIX: Use String() on both sides to safely compare ObjectId vs string
  const hasListing = useMemo(
    () => services.some((s) => String(s.providerId) === String(user?.id)),
    [services, user?.id],
  )

  const showToast = (message, type = 'warning') => {
    setToast({ message, type, isVisible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }))
    }, 4000)
  }

  const handleAddService = () => {
    if (hasListing) {
      showToast('You can add only one service', 'warning')
      return
    }
    navigate('/provider/add-service')
  }

  const stats = useMemo(() => {
    // FIX: Use String() comparison for bookings too
    const mine = bookings.filter((b) => String(b.providerId) === String(user?.id))
    const pending = mine.filter((b) => b.status === BOOKING_STATUS.PENDING_PROVIDER).length
    const active = mine.filter((b) =>
      [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.IN_PROGRESS].includes(b.status),
    ).length
    const net = sumProviderEarnings(mine, user?.id)
    return { pending, active, net, total: mine.length }
  }, [bookings, user?.id])

  const summaryCards = [
    {
      title: 'Net earnings (simulated)',
      value: formatMoney(stats.net),
      detail: `${Math.round(ADMIN_COMMISSION_RATE * 100)}% platform fee applied`,
      icon: DollarSign,
      trend: stats.net > 0 ? '+15% this month' : 'No earnings',
      color: 'green'
    },
    {
      title: 'Open requests',
      value: String(stats.pending),
      detail: stats.pending ? 'Respond to stay competitive' : 'You are caught up',
      icon: Users,
      trend: stats.pending > 0 ? 'New requests' : 'All handled',
      color: stats.pending > 0 ? 'amber' : 'blue',
      urgent: stats.pending > 5
    },
    {
      title: 'Active jobs',
      value: String(stats.active),
      detail: `${stats.total} jobs in your history`,
      icon: Calendar,
      trend: stats.active > 0 ? 'Productive day' : 'No active work',
      color: 'blue'
    },
    {
      title: 'Success rate',
      value: stats.total > 0 ? `${Math.round((stats.total - stats.pending) / stats.total * 100)}%` : '0%',
      detail: 'Jobs completed vs requested',
      icon: Award,
      trend: 'Above average',
      color: 'emerald'
    },
  ]

  const quickActions = [
    {
      title: 'Booking requests',
      description: 'Accept or decline before they time out.',
      href: '/provider/booking-requests',
      buttonLabel: 'Open queue',
      icon: Calendar,
      color: 'blue',
      badge: stats.pending,
      urgent: stats.pending > 3
    },
    {
      title: 'Active jobs',
      description: 'Update progress and mark complete.',
      href: '/provider/active-jobs',
      buttonLabel: 'View jobs',
      icon: Zap,
      color: 'green',
      badge: stats.active
    },
    {
      title: 'Earnings',
      description: 'Net payouts after platform fee.',
      href: '/provider/earnings',
      buttonLabel: 'Reports',
      icon: BarChart3,
      color: 'amber',
      trend: '+12% this month'
    },
    {
      title: 'Your listing',
      description: hasListing ? 'One service — edit photos, price, and copy.' : 'Publish your single listing to go live.',
      href: hasListing ? '/provider/manage-services' : null,
      buttonLabel: hasListing ? 'Manage listing' : 'Add service',
      icon: Package,
      color: hasListing ? 'green' : 'purple',
      status: hasListing ? 'active' : 'inactive',
      onClick: !hasListing ? handleAddService : null,
      disabled: hasListing
    },
  ]

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast.isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`p-4 rounded-lg shadow-lg flex items-center gap-3 ${
            toast.type === 'error' 
              ? 'bg-red-500/90 border border-red-500/50 text-white' 
              : toast.type === 'success'
              ? 'bg-green-500/90 border border-green-500/50 text-white'
              : 'bg-yellow-500/90 border border-yellow-500/50 text-white'
          }`}>
            {toast.type === 'error' ? (
              <X className="w-5 h-5 flex-shrink-0" />
            ) : toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(prev => ({ ...prev, isVisible: false }))}
              className="ml-auto text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="dashboard-hero-panel relative overflow-hidden">
        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/90">
            <Zap className="h-3.5 w-3.5" />
            Provider operations
          </div>
          <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
            Operations hub
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Requests, active work, and earnings—aligned with a single listing model so customers always know what you offer.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/provider/booking-requests">
              <Button className="w-full justify-center sm:w-auto">
                <Calendar className="h-4 w-4" />
                Review requests
              </Button>
            </Link>
            {hasListing ? (
              <Link to="/provider/manage-services">
                <Button variant="secondary" className="w-full justify-center sm:w-auto">
                  <Package className="h-4 w-4" />
                  My service
                </Button>
              </Link>
            ) : (
              <Button variant="secondary" className="w-full justify-center sm:w-auto" onClick={handleAddService}>
                <Star className="h-4 w-4" />
                Publish listing
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ title, value, detail, icon: Icon, trend, color, urgent }) => (
          <Card key={title} hover={true} className={`dashboard-stat-card group relative overflow-hidden ${urgent ? 'border-amber-500/50' : ''}`}>
            {urgent && (
              <div className="absolute top-2 right-2">
                <div className="flex h-2 w-2">
                  <div className="animate-pulse h-2 w-2 rounded-full bg-amber-500"></div>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-medium text-slate-400">{title}</p>
                  {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      trend.includes('+') ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <TrendingUp className="h-3 w-3" />
                      {trend}
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold tabular-nums text-white">{value}</p>
                <p className="mt-2 text-xs font-medium text-slate-400">{detail}</p>
              </div>
              <div className={`rounded-2xl border border-${color}-400/25 bg-${color}-500/10 p-3 text-${color}-200`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card hover={false} className="dashboard-hero-panel border-white/10 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-white sm:text-2xl">Quick actions</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-green-400 font-medium">All systems operational</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-6">Manage your daily operations and track performance.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <div
              key={action.title}
              className="group relative rounded-2xl border border-white/10 bg-slate-950/40 p-5 transition-all duration-300 hover:border-violet-400/30 hover:bg-slate-950/60 hover:scale-[1.02]"
            >
              <div className="absolute top-4 right-4">
                {action.badge !== undefined && (
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    action.urgent ? 'bg-red-500' : 'bg-violet-500'
                  } text-white text-xs font-bold`}>
                    {action.badge}
                  </div>
                )}
                {action.status && (
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    action.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  } text-white text-xs font-medium`}>
                    <CheckCircle className="h-3 w-3" />
                  </div>
                )}
              </div>
              <div className="flex items-start gap-4">
                <div className={`rounded-xl border border-${action.color}-400/20 bg-${action.color}-500/10 p-3 text-${action.color}-200`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-violet-200 transition-colors">{action.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{action.description}</p>
                  {action.trend && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-violet-300">
                      <TrendingUp className="h-3 w-3" />
                      {action.trend}
                    </div>
                  )}
                  {action.href ? (
                    <Link to={action.href} className="mt-4 block">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-center border-white/15 hover:bg-white/10 hover:border-white/25"
                        disabled={action.disabled}
                      >
                        {action.buttonLabel}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="mt-4 block">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-center border-white/15 hover:bg-white/10 hover:border-white/25"
                        onClick={action.onClick}
                        disabled={action.disabled}
                      >
                        {action.buttonLabel}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <ServiceHiveChatbot />
    </div>
  )
}

export default ProviderDashboard