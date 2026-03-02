import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Calendar, Clock, MapPin, DollarSign, User,
  Star, MoreVertical, Eye, CheckCircle, XCircle, AlertCircle,
  TrendingUp, TrendingDown, BarChart3, Download, RefreshCw
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const AllBookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ]

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Booking Date' },
    { value: 'customer', label: 'Customer Name' },
    { value: 'provider', label: 'Provider' },
    { value: 'amount', label: 'Amount' },
    { value: 'status', label: 'Status' }
  ]

  const bookings = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      provider: 'CleanPro Solutions',
      service: 'Home Cleaning',
      date: '2024-01-20',
      time: '10:00 AM',
      location: 'Manhattan, NY',
      amount: 75,
      status: 'confirmed',
      paymentStatus: 'paid',
      rating: 0,
      createdAt: '2024-01-18 14:30',
      customerAvatar: 'SJ',
      providerAvatar: 'CP'
    },
    {
      id: 2,
      customer: 'Mike Chen',
      customerEmail: 'mike.chen@email.com',
      provider: 'TechMasters Inc',
      service: 'Web Development',
      date: '2024-01-20',
      time: '2:00 PM',
      location: 'Remote',
      amount: 500,
      status: 'in_progress',
      paymentStatus: 'paid',
      rating: 0,
      createdAt: '2024-01-17 09:15',
      customerAvatar: 'MC',
      providerAvatar: 'TM'
    },
    {
      id: 3,
      customer: 'Emily Davis',
      customerEmail: 'emily.d@email.com',
      provider: 'AutoSpa Premium',
      service: 'Car Detailing',
      date: '2024-01-19',
      time: '3:00 PM',
      location: 'Los Angeles, CA',
      amount: 150,
      status: 'completed',
      paymentStatus: 'paid',
      rating: 5,
      createdAt: '2024-01-16 16:45',
      customerAvatar: 'ED',
      providerAvatar: 'AP'
    },
    {
      id: 4,
      customer: 'Robert Wilson',
      customerEmail: 'robert.w@email.com',
      provider: 'CleanPro Solutions',
      service: 'Office Cleaning',
      date: '2024-01-18',
      time: '11:00 AM',
      location: 'Brooklyn, NY',
      amount: 200,
      status: 'cancelled',
      paymentStatus: 'refunded',
      rating: 0,
      createdAt: '2024-01-15 11:20',
      customerAvatar: 'RW',
      providerAvatar: 'CP',
      cancellationReason: 'Customer requested cancellation'
    },
    {
      id: 5,
      customer: 'Lisa Anderson',
      customerEmail: 'lisa.a@email.com',
      provider: 'EduExperts',
      service: 'Math Tutoring',
      date: '2024-01-21',
      time: '4:00 PM',
      location: 'Boston, MA',
      amount: 45,
      status: 'pending',
      paymentStatus: 'pending',
      rating: 0,
      createdAt: '2024-01-19 10:30',
      customerAvatar: 'LA',
      providerAvatar: 'EE'
    }
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesDate = dateFilter === 'all' || dateFilter === 'today' && booking.date === '2024-01-20'
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'in_progress': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'refunded': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      case 'refunded': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const BookingCard = ({ booking }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{booking.customerAvatar}</span>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">{booking.customer}</h3>
              <p className="text-gray-400 text-sm">{booking.customerEmail}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                  {booking.status.replace('_', ' ').charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                </span>
                <span className={`text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                  {booking.paymentStatus === 'paid' ? 'Paid' : booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">${booking.amount}</div>
            <div className="text-sm text-gray-400">Booking #{booking.id}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs mb-1">Service</p>
            <p className="text-white font-medium">{booking.service}</p>
            <p className="text-gray-400 text-sm">{booking.provider}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">Schedule</p>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-white">{booking.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-white">{booking.time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{booking.location}</span>
        </div>

        {booking.rating > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-white font-medium">{booking.rating}.0</span>
            <span className="text-gray-400 text-sm">Customer Rating</span>
          </div>
        )}

        {booking.cancellationReason && (
          <div className="glass-card p-3 rounded-lg mb-4 border border-red-500/30">
            <p className="text-red-400 text-sm font-medium mb-1">Cancellation Reason:</p>
            <p className="text-gray-300 text-sm">{booking.cancellationReason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-xs text-gray-400">
            Created: {booking.createdAt}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            
            {booking.status === 'pending' && (
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm
              </Button>
            )}
            
            {booking.status === 'confirmed' && (
              <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300">
                <XCircle className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
            
            {booking.status === 'completed' && booking.rating === 0 && (
              <Button variant="outline" size="sm">
                <Star className="w-4 h-4 mr-1" />
                Request Review
              </Button>
            )}
            
            <Button variant="outline" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )

  const stats = [
    { label: 'Total Bookings', value: bookings.length, color: 'cyan' },
    { label: 'Today\'s Bookings', value: bookings.filter(b => b.date === '2024-01-20').length, color: 'green' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
    { label: 'Revenue', value: `$${bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.amount, 0)}`, color: 'purple' }
  ]

  const statusStats = [
    { status: 'pending', count: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
    { status: 'confirmed', count: bookings.filter(b => b.status === 'confirmed').length, color: 'blue' },
    { status: 'in_progress', count: bookings.filter(b => b.status === 'in_progress').length, color: 'green' },
    { status: 'completed', count: bookings.filter(b => b.status === 'completed').length, color: 'purple' },
    { status: 'cancelled', count: bookings.filter(b => b.status === 'cancelled').length, color: 'red' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Bookings</h1>
          <p className="text-gray-400">
            Monitor and manage all platform bookings
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Booking Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statusStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2 bg-${stat.color}-500/20`}>
                  <div className={`text-2xl font-bold text-${stat.color}-400`}>{stat.count}</div>
                </div>
                <p className="text-gray-400 text-sm capitalize">{stat.status.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12"
              />
            </div>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
            />
            
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              options={dateOptions}
            />
            
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={sortOptions}
            />
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BookingCard booking={booking} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No bookings available'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AllBookingsPage
