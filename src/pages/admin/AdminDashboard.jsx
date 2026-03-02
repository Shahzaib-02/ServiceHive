import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Users, TrendingUp, DollarSign, Calendar, Star,
  AlertCircle, CheckCircle, Clock, MapPin, Eye,
  ArrowRight, BarChart3, PieChart, Activity
} from 'lucide-react'
import StatCard from '../../components/ui/StatCard.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '15,234',
      change: '+18%',
      changeType: 'increase',
      icon: Users,
      color: 'cyan'
    },
    {
      title: 'Active Providers',
      value: '3,456',
      change: '+12%',
      changeType: 'increase',
      icon: Star,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: '$124,560',
      change: '+24%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Total Bookings',
      value: '8,923',
      change: '+15%',
      changeType: 'increase',
      icon: Calendar,
      color: 'yellow'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'new_provider',
      message: 'New provider registration: CleanPro Solutions',
      time: '2 minutes ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'high_value_booking',
      message: 'High-value booking: $2,500 - TechMasters Web Development',
      time: '15 minutes ago',
      status: 'completed'
    },
    {
      id: 3,
      type: 'user_report',
      message: 'User report: Service quality issue with provider',
      time: '1 hour ago',
      status: 'alert'
    },
    {
      id: 4,
      type: 'system_update',
      message: 'System maintenance completed successfully',
      time: '2 hours ago',
      status: 'success'
    }
  ]

  const pendingApprovals = [
    {
      id: 1,
      name: 'CleanPro Solutions',
      service: 'Home Cleaning',
      applied: '2024-01-18',
      documents: 'verified',
      rating: 0
    },
    {
      id: 2,
      name: 'TechMasters Inc',
      service: 'Web Development',
      applied: '2024-01-17',
      documents: 'pending',
      rating: 0
    },
    {
      id: 3,
      name: 'AutoSpa Premium',
      service: 'Car Detailing',
      applied: '2024-01-16',
      documents: 'verified',
      rating: 0
    }
  ]

  const systemHealth = [
    { metric: 'Server Uptime', value: '99.9%', status: 'healthy' },
    { metric: 'API Response', value: '120ms', status: 'healthy' },
    { metric: 'Database Load', value: '45%', status: 'healthy' },
    { metric: 'Error Rate', value: '0.1%', status: 'healthy' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_provider': return <Users className="w-4 h-4" />
      case 'high_value_booking': return <DollarSign className="w-4 h-4" />
      case 'user_report': return <AlertCircle className="w-4 h-4" />
      case 'system_update': return <CheckCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/20'
      case 'completed': return 'text-green-400 bg-green-500/20'
      case 'alert': return 'text-red-400 bg-red-500/20'
      case 'success': return 'text-cyan-400 bg-cyan-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

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
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">
            Monitor and manage the ServiceHive platform
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            System Status
          </Button>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 glass-card rounded-lg">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.message}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Pending Approvals</h2>
              <Link to="/admin/approve-providers">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {pendingApprovals.map((provider) => (
                <div key={provider.id} className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{provider.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      provider.documents === 'verified' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {provider.documents}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{provider.service}</p>
                  <p className="text-gray-500 text-xs">Applied: {provider.applied}</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button size="sm" variant="outline">Review</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Simple Chart */}
              <div className="h-48 flex items-end justify-between space-x-2">
                {[45, 70, 55, 80, 65, 90, 75].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg relative group cursor-pointer">
                      <div 
                        className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-purple-400"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 mt-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-lg font-bold gradient-text">$24.5K</div>
                  <div className="text-gray-400 text-xs">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold gradient-text">$98K</div>
                  <div className="text-gray-400 text-xs">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold gradient-text">$1.2M</div>
                  <div className="text-gray-400 text-xs">This Year</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* User Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">User Growth</h3>
                <Button variant="ghost" size="sm">
                  <PieChart className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Simple Pie Chart Representation */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                  <div className="absolute inset-2 bg-dark rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">15K</div>
                      <div className="text-xs text-gray-400">Total Users</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Customers</span>
                  </div>
                  <span className="text-white font-medium">12,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Providers</span>
                  </div>
                  <span className="text-white font-medium">3,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Admins</span>
                  </div>
                  <span className="text-white font-medium">45</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">System Health</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">All Systems Operational</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemHealth.map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${getHealthColor(item.status)}`}>
                    {item.value}
                  </div>
                  <div className="text-gray-400 text-sm">{item.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
