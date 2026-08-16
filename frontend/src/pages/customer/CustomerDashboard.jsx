import React, { useEffect, useMemo } from 'react'
import {
  ArrowRight,
  Calendar,
  DollarSign,
  MapPin,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Activity,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useBookings } from '../../hooks/useBookings'
import { BOOKING_STATUS, customerCanTrack } from '../../utils/bookingStatus'
import ServiceHiveChatbot from '../../components/chatbot/ServiceHiveChatbot'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const { bookings, fetchBookings } = useBookings()

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const stats = useMemo(() => {
    const mine = bookings.filter((b) => b.customerId === user?.id)
    const terminal = new Set([BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED, BOOKING_STATUS.REJECTED])
    const upcoming = mine.filter((b) => !terminal.has(b.status)).length
    const pendingPay = mine.filter((b) => b.paymentStatus === 'unpaid' && b.status !== BOOKING_STATUS.CANCELLED).length
    const tracking = mine.filter((b) => customerCanTrack(b.status)).length
    return { upcoming, pendingPay, tracking, total: mine.length }
  }, [bookings, user?.id])

  const summaryCards = [
    {
      title: 'Active bookings',
      value: String(stats.upcoming),
      detail: stats.total ? `${stats.total} total in account` : 'None yet',
      icon: Calendar,
      trend: stats.upcoming > 0 ? '+2 this week' : 'No new',
      color: 'cyan'
    },
    {
      title: 'Unpaid invoices',
      value: String(stats.pendingPay),
      detail: 'Complete payment to confirm',
      icon: DollarSign,
      trend: stats.pendingPay > 0 ? 'Action needed' : 'All paid',
      color: stats.pendingPay > 0 ? 'red' : 'green',
      urgent: stats.pendingPay > 0
    },
    {
      title: 'Live tracking',
      value: String(stats.tracking),
      detail: 'Provider en route or on job',
      icon: MapPin,
      trend: stats.tracking > 0 ? 'Active now' : 'No active',
      color: 'emerald'
    },
  ]

  const nextSteps = [
    {
      id: 1,
      title: 'Bookings',
      description: 'Review upcoming visits, completed jobs, and statuses.',
      href: '/customer/bookings',
      buttonLabel: 'Open bookings',
      icon: Calendar,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Payments',
      description: 'See paid invoices and complete any pending payment.',
      href: '/customer/payments',
      buttonLabel: 'View payments',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 3,
      title: 'Browse services',
      description: 'Explore category groups and book a service.',
      href: '/browse-services',
      buttonLabel: 'Browse',
      icon: Search,
      color: 'purple'
    },
    {
      id: 4,
      title: 'Service history',
      description: 'View past bookings and ratings.',
      href: '/customer/history',
      icon: Clock,
      color: 'orange'
    },
  ]

  return (
    <div className="space-y-8">
      <div className="dashboard-hero-panel relative overflow-hidden">
        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/90">
            <Sparkles className="h-3.5 w-3.5" />
            Customer workspace
          </div>
          <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Your bookings, payments, and live chat in one calm dashboard—optimized for quick decisions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/browse-services">
              <Button variant='outline' >
                <Search className="h-4 w-4" />
                Browse services
              </Button>
            </Link>
            <Link to="/customer/bookings">
              <Button variant="secondary" className="w-full justify-center sm:w-auto">
                <Calendar className="h-4 w-4" />
                My bookings
              </Button>
            </Link>
          </div>
        </div>
      </div>
     
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ title, value, detail, icon: Icon, trend, color, urgent }) => (
          <Card key={title} hover={true} className={`dashboard-stat-card group relative overflow-hidden ${urgent ? 'border-red-500/50' : ''}`}>
            {urgent && (
              <div className="absolute top-2 right-2">
                <div className="flex h-2 w-2">
                  <div className="animate-pulse h-2 w-2 rounded-full bg-red-500"></div>
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
                      trend.includes('+') ? 'text-green-400' : trend.includes('No') ? 'text-gray-400' : 'text-yellow-400'
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
        <p className="text-sm text-slate-400 mb-6">Shortcuts to the flows you use most.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {nextSteps.map((step, index) => (
            <div
              key={step.id}
              className="group relative rounded-2xl border border-white/10 bg-slate-950/40 p-5 transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-950/60 hover:scale-[1.02]"
            >
              <div className="absolute top-4 left-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-${step.color}-400/20 bg-${step.color}-500/10 text-sm font-bold text-${step.color}-100`}>
                  <step.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-start gap-3 pl-12">
                <div className="flex-1">
                  <h3 className="font-semibold text-white group-hover:text-cyan-200 transition-colors">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
                  <Link to={step.href} className="mt-4 block">
                    <Button variant="outline" size="sm" className="w-full justify-center border-white/15 hover:bg-white/10 hover:border-white/25">
                      {step.buttonLabel}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
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

export default CustomerDashboard
