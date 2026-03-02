import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, MapPin, DollarSign, Star, Filter,
  Search, MoreVertical, MessageCircle, Phone, Video,
  CheckCircle, XCircle, AlertCircle, RefreshCw
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const MyBookingsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' }
  ]

  const bookings = [
    {
      id: 1,
      service: 'Home Cleaning Service',
      provider: 'CleanPro Solutions',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'upcoming',
      price: 75,
      location: 'New York, NY',
      duration: '2-3 hours',
      image: 'cleaning',
      providerAvatar: 'CP',
      rating: 4.8,
      reviews: 124,
      canReschedule: true,
      canCancel: true
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      provider: 'QuickFix Plumbing',
      date: '2024-01-18',
      time: '2:00 PM',
      status: 'ongoing',
      price: 120,
      location: 'New York, NY',
      duration: '1-2 hours',
      image: 'plumbing',
      providerAvatar: 'QP',
      rating: 4.9,
      reviews: 89,
      canTrack: true,
      canCall: true
    },
    {
      id: 3,
      service: 'Web Development',
      provider: 'TechMasters',
      date: '2024-01-15',
      time: '11:00 AM',
      status: 'completed',
      price: 500,
      location: 'Remote',
      duration: '3 hours',
      image: 'webdev',
      providerAvatar: 'TM',
      rating: 4.7,
      reviews: 56,
      canReview: true,
      canRebook: true
    },
    {
      id: 4,
      service: 'Car Detailing',
      provider: 'AutoSpa Premium',
      date: '2024-01-10',
      time: '3:00 PM',
      status: 'cancelled',
      price: 150,
      location: 'Chicago, IL',
      duration: '2 hours',
      image: 'cardetail',
      providerAvatar: 'AP',
      rating: 4.9,
      reviews: 203,
      canRebook: true
    }
  ]

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.provider.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ongoing': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return <Calendar className="w-4 h-4" />
      case 'ongoing': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const BookingCard = ({ booking }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">{booking.providerAvatar}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{booking.service}</h3>
              <p className="text-gray-400">{booking.provider}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-300">{booking.rating}</span>
                <span className="text-sm text-gray-400">({booking.reviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </span>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{booking.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <div className="text-2xl font-bold gradient-text">${booking.price}</div>
            <div className="text-sm text-gray-400">{booking.duration}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            {booking.status === 'upcoming' && (
              <>
                <Link to={`/customer/tracking/${booking.id}`}>
                  <Button variant="outline" size="sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    Track
                  </Button>
                </Link>
                {booking.canReschedule && (
                  <Button variant="outline" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                )}
                {booking.canCancel && (
                  <Button variant="danger" size="sm">
                    Cancel
                  </Button>
                )}
              </>
            )}
            
            {booking.status === 'ongoing' && (
              <>
                {booking.canTrack && (
                  <Link to={`/customer/tracking/${booking.id}`}>
                    <Button size="sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      Live Track
                    </Button>
                  </Link>
                )}
                {booking.canCall && (
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </>
            )}
            
            {booking.status === 'completed' && (
              <>
                {booking.canReview && (
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    Review
                  </Button>
                )}
                {booking.canRebook && (
                  <Button size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Rebook
                  </Button>
                )}
              </>
            )}
            
            {booking.status === 'cancelled' && booking.canRebook && (
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Rebook
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )

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
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">
            Manage and track all your service bookings
          </p>
        </div>
        
        <Link to="/browse-services">
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Book New Service
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: '24', color: 'cyan' },
          { label: 'Upcoming', value: '3', color: 'blue' },
          { label: 'Completed', value: '18', color: 'green' },
          { label: 'Cancelled', value: '3', color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t made any bookings yet'
              }
            </p>
            <Link to="/browse-services">
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Book Your First Service
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MyBookingsPage
