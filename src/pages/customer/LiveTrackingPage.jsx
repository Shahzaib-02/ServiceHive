import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, Navigation, Phone, MessageCircle, Clock, User,
  Star, CheckCircle, AlertCircle, Zap, Shield, Route
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const LiveTrackingPage = () => {
  const { id } = useParams()
  const [providerLocation, setProviderLocation] = useState({ lat: 40.7128, lng: -74.0060 })
  const [estimatedArrival, setEstimatedArrival] = useState('15 minutes')
  const [trackingStatus, setTrackingStatus] = useState('on_the_way')

  // Mock booking data
  const booking = {
    id: id,
    service: 'Home Cleaning Service',
    provider: 'CleanPro Solutions',
    providerName: 'Sarah Johnson',
    providerAvatar: 'SJ',
    providerPhone: '+1 234-567-8900',
    rating: 4.8,
    reviews: 124,
    vehicle: 'Toyota Camry',
    plateNumber: 'ABC-1234',
    customerAddress: '123 Main St, New York, NY',
    scheduledTime: '10:00 AM',
    actualStartTime: '9:45 AM',
    estimatedDuration: '2-3 hours',
    price: 75
  }

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProviderLocation(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }))
      
      // Update estimated arrival
      const minutes = Math.max(5, parseInt(estimatedArrival) - 1)
      setEstimatedArrival(`${minutes} minutes`)
      
      if (minutes <= 5) {
        setTrackingStatus('arriving')
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [estimatedArrival])

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_the_way': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'arriving': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'arrived': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'on_the_way': return 'On the way'
      case 'arriving': return 'Arriving soon'
      case 'arrived': return 'Has arrived'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="h-full min-h-[600px] relative overflow-hidden">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Live Tracking Map</h3>
                  <p className="text-gray-400">Interactive map would be displayed here</p>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">Provider Location</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Your Location</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simulated Route */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <path
                  d="M 20 30 Q 50 20 80 70"
                  stroke="rgba(6, 182, 212, 0.5)"
                  strokeWidth="0.5"
                  fill="none"
                  strokeDasharray="2 2"
                />
              </svg>
              
              {/* Provider Marker */}
              <motion.div
                className="absolute top-1/4 left-1/5 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Navigation className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
                </div>
              </motion.div>
              
              {/* Customer Marker */}
              <div className="absolute bottom-1/4 right-1/5 transform translate-x-1/2 translate-y-1/2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button variant="outline" size="sm" className="glass-card">
                <Route className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="glass-card">
                <Navigation className="w-4 h-4" />
              </Button>
            </div>

            {/* ETA Badge */}
            <div className="absolute top-4 left-4">
              <div className="glass-card px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">ETA: {estimatedArrival}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Provider Info */}
          <Card>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{booking.providerAvatar}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{booking.providerName}</h3>
                <p className="text-gray-400">{booking.provider}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-300">{booking.rating}</span>
                  <span className="text-sm text-gray-400">({booking.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className={`px-3 py-2 rounded-lg text-sm font-medium border flex items-center space-x-2 ${getStatusColor(trackingStatus)}`}>
                <Zap className="w-4 h-4" />
                <span>{getStatusText(trackingStatus)}</span>
              </div>
              
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Vehicle</span>
                  <span className="text-white">{booking.vehicle}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">Plate Number</span>
                  <span className="text-white">{booking.plateNumber}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Service Details */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Service</p>
                <p className="text-white font-medium">{booking.service}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Address</p>
                <p className="text-white font-medium">{booking.customerAddress}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Scheduled Time</p>
                <p className="text-white font-medium">{booking.scheduledTime}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Duration</p>
                <p className="text-white font-medium">{booking.estimatedDuration}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-xl font-bold gradient-text">${booking.price}</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start">
                <Phone className="w-4 h-4 mr-3" />
                Call Provider
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-3" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertCircle className="w-4 h-4 mr-3" />
                Report Issue
              </Button>
            </div>
          </Card>

          {/* Safety Tips */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Safety Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Verify Identity</p>
                  <p className="text-gray-400 text-xs">Check provider's ID and vehicle</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Stay in Touch</p>
                  <p className="text-gray-400 text-xs">Keep your phone nearby</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-medium">Trust Your Instincts</p>
                  <p className="text-gray-400 text-xs">Report any concerns immediately</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default LiveTrackingPage
