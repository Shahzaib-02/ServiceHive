import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Calendar, Clock, MapPin, DollarSign, User,
  CheckCircle, XCircle, MessageCircle, Phone, Eye, Star,
  AlertCircle, TrendingUp, Users
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const BookingRequestsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const statusOptions = [
    { value: 'all', label: 'All Requests' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'declined', label: 'Declined' },
    { value: 'expired', label: 'Expired' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Request Date' },
    { value: 'service_date', label: 'Service Date' },
    { value: 'price', label: 'Price' },
    { value: 'customer', label: 'Customer Name' }
  ]

  const bookingRequests = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      customerAvatar: 'SJ',
      customerRating: 4.9,
      service: 'Home Cleaning',
      date: '2024-01-20',
      time: '10:00 AM',
      location: 'Manhattan, NY',
      price: 75,
      status: 'pending',
      requestedAt: '2024-01-18 14:30',
      message: 'Need deep cleaning for 2-bedroom apartment. Flexible with timing.',
      urgency: 'normal',
      previousBookings: 3
    },
    {
      id: 2,
      customer: 'Mike Chen',
      customerAvatar: 'MC',
      customerRating: 4.7,
      service: 'Deep Carpet Cleaning',
      date: '2024-01-22',
      time: '2:00 PM',
      location: 'Brooklyn, NY',
      price: 120,
      status: 'pending',
      requestedAt: '2024-01-19 09:15',
      message: 'Living room and bedroom carpets need deep cleaning. Pet stains.',
      urgency: 'high',
      previousBookings: 1
    },
    {
      id: 3,
      customer: 'Emily Davis',
      customerAvatar: 'ED',
      customerRating: 5.0,
      service: 'Home Cleaning',
      date: '2024-01-25',
      time: '11:00 AM',
      location: 'Queens, NY',
      price: 75,
      status: 'accepted',
      requestedAt: '2024-01-17 16:45',
      message: 'Regular cleaning service. Same as last time.',
      urgency: 'normal',
      previousBookings: 5
    },
    {
      id: 4,
      customer: 'Robert Wilson',
      customerAvatar: 'RW',
      customerRating: 4.5,
      service: 'Office Cleaning',
      date: '2024-01-18',
      time: '3:00 PM',
      location: 'Manhattan, NY',
      price: 200,
      status: 'declined',
      requestedAt: '2024-01-16 11:20',
      message: 'Small office space cleaning needed.',
      urgency: 'low',
      previousBookings: 0
    }
  ]

  const filteredRequests = bookingRequests.filter(request => {
    const matchesSearch = request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'accepted': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'expired': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-400'
      case 'normal': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const BookingRequestCard = ({ request }) => (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{request.customerAvatar}</span>
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="font-semibold text-white">{request.customer}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-300">{request.customerRating}</span>
                </div>
                {request.previousBookings > 0 && (
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">
                    {request.previousBookings} previous
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">{request.service}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
                <span className={`text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold gradient-text">${request.price}</div>
            <div className="text-sm text-gray-400">Requested {request.requestedAt}</div>
          </div>
        </div>

        {request.message && (
          <div className="glass-card p-3 rounded-lg mb-4">
            <p className="text-gray-300 text-sm italic">"{request.message}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{request.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{request.time}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{request.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View Profile
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
          
          {request.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <Button size="sm" className="bg-green-500 hover:bg-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Accept
              </Button>
              <Button variant="danger" size="sm">
                <XCircle className="w-4 h-4 mr-1" />
                Decline
              </Button>
            </div>
          )}
          
          {request.status === 'accepted' && (
            <div className="flex items-center space-x-2">
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-1" />
                View in Calendar
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-1" />
                Contact
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )

  const stats = [
    { label: 'Pending Requests', value: bookingRequests.filter(r => r.status === 'pending').length, color: 'yellow' },
    { label: 'Accepted Today', value: bookingRequests.filter(r => r.status === 'accepted').length, color: 'green' },
    { label: 'Response Rate', value: '92%', color: 'cyan' },
    { label: 'Avg. Response Time', value: '1.2 hrs', color: 'purple' }
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
          <h1 className="text-3xl font-bold text-white mb-2">Booking Requests</h1>
          <p className="text-gray-400">
            Manage and respond to service booking requests
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <AlertCircle className="w-4 h-4 mr-2" />
            Urgent Only
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            View Calendar
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
                placeholder="Search requests..."
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

      {/* Quick Actions */}
      {bookingRequests.filter(r => r.status === 'pending' && r.urgency === 'high').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-red-500/30 bg-red-500/5">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-white font-medium">Urgent Requests Pending</p>
                <p className="text-gray-400 text-sm">
                  {bookingRequests.filter(r => r.status === 'pending' && r.urgency === 'high').length} high-priority requests need your attention
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BookingRequestCard request={request} />
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
              No booking requests found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No new booking requests at the moment'
              }
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BookingRequestsPage
