import React from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, DollarSign, Star, TrendingUp, 
  MapPin, Search, Bell, User, ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StatCard from '../../components/ui/StatCard'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const CustomerDashboard = () => {
  const stats = [
    {
      title: 'Total Bookings',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: Calendar,
      color: 'cyan'
    },
    {
      title: 'Total Spent',
      value: '$1,847',
      change: '+8%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Services Used',
      value: '8',
      change: '+2',
      changeType: 'increase',
      icon: Star,
      color: 'purple'
    },
    {
      title: 'Saved Providers',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: User,
      color: 'pink'
    }
  ]

  const recentBookings = [
    {
      id: 1,
      service: 'Home Cleaning',
      provider: 'CleanPro Solutions',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      price: 75,
      location: 'New York, NY'
    },
    {
      id: 2,
      service: 'Plumbing Repair',
      provider: 'QuickFix Plumbing',
      date: '2024-01-18',
      time: '2:00 PM',
      status: 'pending',
      price: 120,
      location: 'New York, NY'
    },
    {
      id: 3,
      service: 'Web Development',
      provider: 'TechMasters',
      date: '2024-01-20',
      time: '11:00 AM',
      status: 'confirmed',
      price: 500,
      location: 'Remote'
    }
  ]

  const recommendedServices = [
    {
      id: 1,
      title: 'Car Detailing',
      provider: 'AutoSpa Premium',
      price: 150,
      rating: 4.9,
      image: 'car'
    },
    {
      id: 2,
      title: 'Personal Training',
      provider: 'FitLife Coaching',
      price: 80,
      rating: 4.6,
      image: 'fitness'
    },
    {
      id: 3,
      title: 'Math Tutoring',
      provider: 'EduExperts',
      price: 45,
      rating: 4.8,
      image: 'tutoring'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your service bookings today.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Link to="/browse-services">
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Browse Services
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
              <Link to="/customer/bookings">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="glass-card p-4 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white">{booking.service}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{booking.provider}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold gradient-text">${booking.price}</div>
                      <Button size="sm" variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions & Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/customer/booking/new">
                <Button className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-3" />
                  Book New Service
                </Button>
              </Link>
              <Link to="/customer/tracking/1">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-3" />
                  Track Service
                </Button>
              </Link>
              <Link to="/customer/payments">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-3" />
                  Make Payment
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recommended Services */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Recommended for You</h2>
            <div className="space-y-4">
              {recommendedServices.map((service) => (
                <div key={service.id} className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{service.title[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{service.title}</h3>
                    <p className="text-sm text-gray-400">{service.provider}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold gradient-text">${service.price}</div>
                    <div className="flex items-center space-x-1 text-xs text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{service.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/browse-services">
              <Button variant="outline" size="sm" className="w-full mt-4">
                View More Services
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>

      {/* Activity Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Booking Activity</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">Week</Button>
              <Button variant="ghost" size="sm">Month</Button>
              <Button variant="primary" size="sm">Year</Button>
            </div>
          </div>
          
          {/* Simple Chart Placeholder */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {[65, 80, 45, 90, 70, 85, 60].map((height, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg relative group cursor-pointer">
                <div 
                  className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-purple-400"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {height} bookings
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default CustomerDashboard
