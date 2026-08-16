import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Navigation, Users, Activity, AlertCircle, Filter,
  Search, RefreshCw, Eye, EyeOff, Maximize2, Settings,
  Clock, TrendingUp, TrendingDown, CheckCircle, XCircle
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const LiveMonitoringMapPage = () => {
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [showProviders, setShowProviders] = useState(true)
  const [showCustomers, setShowCustomers] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'active', label: 'Active Jobs' },
    { value: 'providers', label: 'Providers Only' },
    { value: 'customers', label: 'Customers Only' }
  ]

  const activeJobs = [
    {
      id: 1,
      provider: 'CleanPro Solutions',
      providerId: 1,
      customer: 'Sarah Johnson',
      service: 'Home Cleaning',
      status: 'in_progress',
      location: { lat: 40.7589, lng: -73.9851 },
      address: '123 Main St, Manhattan, NY',
      startTime: '10:00 AM',
      estimatedDuration: '3 hours',
      progress: 65,
      providerAvatar: 'CP',
      customerAvatar: 'SJ'
    },
    {
      id: 2,
      provider: 'TechMasters Inc',
      providerId: 2,
      customer: 'Mike Chen',
      service: 'Web Development',
      status: 'in_progress',
      location: { lat: 40.7580, lng: -73.9855 },
      address: '456 Tech Ave, San Francisco, CA',
      startTime: '2:00 PM',
      estimatedDuration: '4 hours',
      progress: 30,
      providerAvatar: 'TM',
      customerAvatar: 'MC'
    },
    {
      id: 3,
      provider: 'AutoSpa Premium',
      providerId: 3,
      customer: 'Emily Davis',
      service: 'Car Detailing',
      status: 'scheduled',
      location: { lat: 40.7585, lng: -73.9850 },
      address: '789 Auto Blvd, Los Angeles, CA',
      startTime: '4:00 PM',
      estimatedDuration: '2 hours',
      progress: 0,
      providerAvatar: 'AP',
      customerAvatar: 'ED'
    }
  ]

  const providers = [
    {
      id: 1,
      name: 'CleanPro Solutions',
      status: 'online',
      location: { lat: 40.7589, lng: -73.9851 },
      activeJobs: 2,
      completedJobs: 45,
      rating: 4.8,
      avatar: 'CP'
    },
    {
      id: 2,
      name: 'TechMasters Inc',
      status: 'online',
      location: { lat: 40.7580, lng: -73.9855 },
      activeJobs: 1,
      completedJobs: 28,
      rating: 4.9,
      avatar: 'TM'
    },
    {
      id: 3,
      name: 'AutoSpa Premium',
      status: 'offline',
      location: { lat: 40.7585, lng: -73.9850 },
      activeJobs: 0,
      completedJobs: 67,
      rating: 4.7,
      avatar: 'AP'
    }
  ]

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Provider AutoSpa Premium has been offline for more than 2 hours',
      time: '5 minutes ago',
      providerId: 3
    },
    {
      id: 2,
      type: 'info',
      message: 'New booking request in Manhattan area',
      time: '15 minutes ago',
      location: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 3,
      type: 'success',
      message: 'CleanPro Solutions completed job #BK001',
      time: '30 minutes ago',
      providerId: 1
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'online': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'offline': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const stats = {
    activeJobs: activeJobs.filter(job => job.status === 'in_progress').length,
    scheduledJobs: activeJobs.filter(job => job.status === 'scheduled').length,
    onlineProviders: providers.filter(p => p.status === 'online').length,
    totalProviders: providers.length
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
          <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring Map</h1>
          <p className="text-gray-400">
            Real-time tracking of services and providers
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-green-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+2</span>
            </div>
          </div>
          <div className="text-2xl font-bold gradient-text mb-1">{stats.activeJobs}</div>
          <div className="text-gray-400 text-sm">Active Jobs</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-blue-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+1</span>
            </div>
          </div>
          <div className="text-2xl font-bold gradient-text mb-1">{stats.scheduledJobs}</div>
          <div className="text-gray-400 text-sm">Scheduled Jobs</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-black" />
            </div>
            <div className="flex items-center space-x-1 text-custom-yellow">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+1</span>
            </div>
          </div>
          <div className="text-2xl font-bold gradient-text mb-1">{stats.onlineProviders}</div>
          <div className="text-gray-400 text-sm">Online Providers</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-purple-500">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">+5%</span>
            </div>
          </div>
          <div className="text-2xl font-bold gradient-text mb-1">{stats.totalProviders}</div>
          <div className="text-gray-400 text-sm">Total Providers</div>
        </motion.div>
      </div>

      {/* Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="lg:col-span-3"
        >
          <Card className="h-full min-h-[600px] relative overflow-hidden">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-custom-yellow/10 via-orange-500/10 to-yellow-500/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-custom-yellow mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Interactive Map View</h3>
                  <p className="text-gray-400">Live tracking map would be displayed here</p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Active Jobs</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-custom-yellow rounded-full"></div>
                      <span className="text-gray-300">Scheduled Jobs</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-custom-yellow rounded-full"></div>
                      <span className="text-gray-300">Online Providers</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simulated Map Elements */}
              <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-dark/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    CleanPro - In Progress
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-dark/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    TechMasters - Scheduled
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                  <div className="w-4 h-4 bg-custom-yellow rounded-full"></div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-dark/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    AutoSpa - Online
                  </div>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button variant="outline" size="sm" className="glass-card">
                {showHeatmap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" className="glass-card">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 glass-card p-3 rounded-lg">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">Active Jobs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-300">Scheduled Jobs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                  <span className="text-gray-300">Online Providers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-300">Offline Providers</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          {/* Filters */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12"
                />
              </div>
              
              <Select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                options={filterOptions}
              />
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showProviders}
                    onChange={(e) => setShowProviders(e.target.checked)}
                    className="w-4 h-4 bg-white/10 border-white/20 rounded text-custom-yellow"
                  />
                  <span className="text-gray-300 text-sm">Show Providers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showCustomers}
                    onChange={(e) => setShowCustomers(e.target.checked)}
                    className="w-4 h-4 bg-white/10 border-white/20 rounded text-custom-yellow"
                  />
                  <span className="text-gray-300 text-sm">Show Customers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="w-4 h-4 bg-white/10 border-white/20 rounded text-custom-yellow"
                  />
                  <span className="text-gray-300 text-sm">Heatmap View</span>
                </label>
              </div>
            </div>
          </Card>

          {/* Active Jobs */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Active Jobs</h3>
            
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="glass-card p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white">{job.service}</h4>
                      <p className="text-gray-400 text-sm">{job.provider}</p>
                      <p className="text-gray-500 text-xs">{job.customer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Start Time:</span>
                      <span className="text-white">{job.startTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{job.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Progress:</span>
                      <span className="text-white">{job.progress}%</span>
                    </div>
                  </div>
                  
                  {job.status === 'in_progress' && (
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-custom-yellow to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-gray-400 text-xs">{job.address}</span>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-1" />
                      Track
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">System Alerts</h3>
            
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 glass-card rounded-lg">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${getAlertColor(alert.type).split(' ')[0]}`} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{alert.message}</p>
                    <p className="text-gray-400 text-xs">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default LiveMonitoringMapPage
