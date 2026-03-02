import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, Navigation, ToggleLeft, ToggleRight, Clock, Users,
  AlertCircle, CheckCircle, Shield, Eye, EyeOff, Bell,
  Smartphone, Map, Activity, Zap
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const LiveLocationTogglePage = () => {
  const [isLocationEnabled, setIsLocationEnabled] = useState(true)
  const [isVisibleToCustomers, setIsVisibleToCustomers] = useState(true)
  const [autoShareLocation, setAutoShareLocation] = useState(true)
  const [locationAccuracy, setLocationAccuracy] = useState('high')
  const [updateFrequency, setUpdateFrequency] = useState('realtime')

  const locationHistory = [
    { time: '10:30 AM', status: 'active', location: 'Manhattan, NY', accuracy: '5m' },
    { time: '10:15 AM', status: 'active', location: 'Manhattan, NY', accuracy: '5m' },
    { time: '10:00 AM', status: 'started', location: 'Brooklyn, NY', accuracy: '8m' },
    { time: '9:45 AM', status: 'enabled', location: 'Home Base', accuracy: '3m' }
  ]

  const activeJobs = [
    {
      id: 1,
      customer: 'Sarah Johnson',
      service: 'Home Cleaning',
      location: '123 Main St, Manhattan',
      status: 'in_progress',
      distance: '0.5 miles',
      eta: '5 minutes'
    },
    {
      id: 2,
      customer: 'Mike Chen',
      service: 'Carpet Cleaning',
      location: '456 Park Ave, Brooklyn',
      status: 'scheduled',
      distance: '2.3 miles',
      eta: '15 minutes'
    }
  ]

  const getLocationStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'started': return 'text-blue-400'
      case 'enabled': return 'text-cyan-400'
      default: return 'text-gray-400'
    }
  }

  const getJobStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
          <h1 className="text-3xl font-bold text-white mb-2">Live Location Settings</h1>
          <p className="text-gray-400">
            Manage your location sharing and tracking preferences
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Map className="w-4 h-4 mr-2" />
            View Map
          </Button>
          <Button>
            <Navigation className="w-4 h-4 mr-2" />
            Test Location
          </Button>
        </div>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isLocationEnabled ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              {isLocationEnabled ? (
                <Navigation className="w-8 h-8 text-green-400" />
              ) : (
                <MapPin className="w-8 h-8 text-red-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Location Services
            </h3>
            <p className={`text-sm mb-4 ${
              isLocationEnabled ? 'text-green-400' : 'text-red-400'
            }`}>
              {isLocationEnabled ? 'Active' : 'Disabled'}
            </p>
            <Button
              variant={isLocationEnabled ? 'danger' : 'primary'}
              onClick={() => setIsLocationEnabled(!isLocationEnabled)}
              className="w-full"
            >
              {isLocationEnabled ? 'Disable' : 'Enable'}
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isVisibleToCustomers ? 'bg-cyan-500/20' : 'bg-gray-500/20'
            }`}>
              {isVisibleToCustomers ? (
                <Eye className="w-8 h-8 text-cyan-400" />
              ) : (
                <EyeOff className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Customer Visibility
            </h3>
            <p className={`text-sm mb-4 ${
              isVisibleToCustomers ? 'text-cyan-400' : 'text-gray-400'
            }`}>
              {isVisibleToCustomers ? 'Visible' : 'Hidden'}
            </p>
            <Button
              variant="outline"
              onClick={() => setIsVisibleToCustomers(!isVisibleToCustomers)}
              className="w-full"
            >
              {isVisibleToCustomers ? 'Hide from Customers' : 'Show to Customers'}
            </Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Active Tracking
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {activeJobs.filter(j => j.status === 'in_progress').length} Jobs
            </p>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Location Settings */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Location Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Auto-share Location</p>
                    <p className="text-gray-400 text-sm">Automatically share during active jobs</p>
                  </div>
                  <button
                    onClick={() => setAutoShareLocation(!autoShareLocation)}
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    {autoShareLocation ? (
                      <ToggleRight className="w-8 h-8 text-cyan-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Visible to Customers</p>
                    <p className="text-gray-400 text-sm">Show location to active customers</p>
                  </div>
                  <button
                    onClick={() => setIsVisibleToCustomers(!isVisibleToCustomers)}
                    className="relative inline-flex items-center cursor-pointer"
                  >
                    {isVisibleToCustomers ? (
                      <ToggleRight className="w-8 h-8 text-cyan-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location Accuracy
                  </label>
                  <select
                    value={locationAccuracy}
                    onChange={(e) => setLocationAccuracy(e.target.value)}
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white bg-dark/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="high">High (Best accuracy)</option>
                    <option value="balanced">Balanced</option>
                    <option value="low">Low (Battery saving)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Update Frequency
                  </label>
                  <select
                    value={updateFrequency}
                    onChange={(e) => setUpdateFrequency(e.target.value)}
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white bg-dark/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="30sec">Every 30 seconds</option>
                    <option value="1min">Every 1 minute</option>
                    <option value="5min">Every 5 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Privacy Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">End-to-End Encryption</p>
                    <p className="text-gray-400 text-xs">Your location data is encrypted</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Auto-Disable After Jobs</p>
                    <p className="text-gray-400 text-xs">Location sharing stops when job completes</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Share Only with Active Customers</p>
                    <p className="text-gray-400 text-xs">Location visible only to current job customers</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Active Jobs & Location History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          {/* Active Jobs */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Active Jobs</h3>
              
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="glass-card p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white mb-1">{job.customer}</h4>
                        <p className="text-gray-400 text-sm">{job.service}</p>
                        <p className="text-gray-500 text-xs mt-1">{job.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getJobStatusColor(job.status)}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">{job.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-400">{job.eta}</span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Navigation className="w-4 h-4 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Location History */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Location History</h3>
              
              <div className="space-y-3">
                {locationHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass-card rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${getLocationStatusColor(entry.status)}`}></div>
                      <div>
                        <p className="text-white text-sm font-medium">{entry.time}</p>
                        <p className="text-gray-400 text-xs">{entry.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Accuracy: {entry.accuracy}</p>
                      <p className={`text-xs capitalize ${getLocationStatusColor(entry.status)}`}>
                        {entry.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Activity className="w-4 h-4 mr-2" />
                View Full History
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="border-2 border-cyan-500/30 bg-cyan-500/5">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Location Sharing Active</p>
                <p className="text-gray-400 text-sm">
                  Your location is being shared with {activeJobs.filter(j => j.status === 'in_progress').length} active customer(s)
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default LiveLocationTogglePage
