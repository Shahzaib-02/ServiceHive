import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  DollarSign, Calendar, Star, TrendingUp, Users, Clock,
  MapPin, Award, AlertCircle, ArrowRight, Eye, MessageCircle
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import StatCard from "../../components/ui/StatCard";

const ProviderDashboard = () => {
  const stats = [
    {
      title: 'Total Earnings',
      value: '$12,450',
      change: '+18%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Jobs',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Total Bookings',
      value: '47',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: '+0.2',
      changeType: 'increase',
      icon: Star,
      color: 'yellow'
    }
  ]

  const recentBookings = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      service: 'Home Cleaning',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'confirmed',
      price: 75,
      location: 'Manhattan, NY',
      customerAvatar: 'SJ'
    },
    {
      id: 2,
      customer: 'Mike Chen',
      service: 'Deep Cleaning',
      date: '2024-01-18',
      time: '2:00 PM',
      status: 'in_progress',
      price: 120,
      location: 'Brooklyn, NY',
      customerAvatar: 'MC'
    },
    {
      id: 3,
      customer: 'Emily Davis',
      service: 'Office Cleaning',
      date: '2024-01-22',
      time: '9:00 AM',
      status: 'pending',
      price: 200,
      location: 'Queens, NY',
      customerAvatar: 'ED'
    }
  ]

  const earningsData = [
    { month: 'Jan', earnings: 2450 },
    { month: 'Feb', earnings: 3200 },
    { month: 'Mar', earnings: 2800 },
    { month: 'Apr', earnings: 3500 },
    { month: 'May', earnings: 3100 },
    { month: 'Jun', earnings: 2900 }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
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
            Welcome back, CleanPro! 👋
          </h1>
          <p className="text-gray-400">
            Here's your business overview for today.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <MessageCircle className="w-4 h-4 mr-2" />
            Messages
          </Button>
          <Link to="/provider/add-service">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Add Service
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
              <Link to="/provider/booking-requests">
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
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold">{booking.customerAvatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-white">{booking.customer}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ').charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">{booking.service}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
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
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold gradient-text">${booking.price}</div>
                      <div className="flex items-center space-x-2 mt-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline">Accept</Button>
                            <Button size="sm" variant="danger">Decline</Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <Link to={`/provider/active-jobs/${booking.id}`}>
                              <Button size="sm">Start Job</Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {booking.status === 'in_progress' && (
                          <>
                            <Link to={`/provider/active-jobs/${booking.id}`}>
                              <Button size="sm">Track Progress</Button>
                            </Link>
                            <Button size="sm" variant="outline">
                              <MapPin className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions & Performance */}
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
              <Link to="/provider/booking-requests">
                <Button className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-3" />
                  View Booking Requests
                </Button>
              </Link>
              <Link to="/provider/active-jobs">
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-3" />
                  Active Jobs
                </Button>
              </Link>
              <Link to="/provider/earnings">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-3" />
                  View Earnings
                </Button>
              </Link>
              <Link to="/provider/manage-services">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-3" />
                  Manage Services
                </Button>
              </Link>
            </div>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Response Rate</span>
                <span className="text-white font-medium">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completion Rate</span>
                <span className="text-white font-medium">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">On-Time Rate</span>
                <span className="text-white font-medium">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg. Response Time</span>
                <span className="text-white font-medium">1.2 hrs</span>
              </div>
            </div>
          </Card>

          {/* Alerts */}
          <Card>
            <h2 className="text-xl font-semibold text-white mb-4">Alerts</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">2 pending bookings</p>
                  <p className="text-gray-400 text-xs">Respond within 2 hours</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Profile incomplete</p>
                  <p className="text-gray-400 text-xs">Add more services to increase visibility</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Earnings Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Earnings Overview</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">Week</Button>
              <Button variant="ghost" size="sm">Month</Button>
              <Button variant="primary" size="sm">Year</Button>
            </div>
          </div>
          
          {/* Simple Chart */}
          <div className="h-64 flex items-end justify-between space-x-2">
            {earningsData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg relative group cursor-pointer">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-purple-400"
                    style={{ height: `${(data.earnings / 3500) * 100}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-dark/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${data.earnings}
                  </div>
                </div>
                <span className="text-xs text-gray-400 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">$17,950</div>
              <div className="text-gray-400 text-sm">Total Earnings (6 months)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">$2,992</div>
              <div className="text-gray-400 text-sm">Average Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text mb-1">+18%</div>
              <div className="text-gray-400 text-sm">Growth Rate</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ProviderDashboard
