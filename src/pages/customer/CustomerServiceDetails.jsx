import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { 
  Star, MapPin, Clock, Calendar, DollarSign, User, Heart,
  Share2, MessageCircle, CheckCircle, Shield, Award, Camera,
  ArrowLeft, BookOpen
} from 'lucide-react'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const CustomerServiceDetails = () => {
  const { id } = useParams()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  // Mock service data
  const service = {
    id: id,
    title: 'Professional Home Cleaning Service',
    provider: {
      name: 'CleanPro Solutions',
      avatar: 'CP',
      rating: 4.8,
      reviews: 124,
      verified: true,
      responseTime: '1 hour',
      joinedDate: '2022'
    },
    category: 'Home Services',
    price: 75,
    duration: '2-3 hours',
    description: 'Professional deep cleaning service for your home. Our experienced team uses eco-friendly products and modern equipment to ensure your space is spotless and fresh.',
    images: ['living-room', 'bedroom', 'kitchen', 'bathroom'],
    features: [
      'Deep cleaning of all rooms',
      'Eco-friendly cleaning products',
      'Experienced and insured staff',
      'Satisfaction guaranteed',
      'Flexible scheduling'
    ],
    availability: {
      monday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      tuesday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      wednesday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      thursday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      friday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
      saturday: ['10:00 AM', '12:00 PM', '3:00 PM'],
      sunday: ['10:00 AM', '12:00 PM', '3:00 PM']
    },
    location: 'New York, NY',
    serviceArea: 'Manhattan, Brooklyn, Queens',
    languages: ['English', 'Spanish'],
    insurance: 'Fully insured',
    responseRate: '98%'
  }

  const reviews = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 5,
      date: '2024-01-10',
      comment: 'Amazing service! My apartment has never been cleaner. The team was professional and thorough.'
    },
    {
      id: 2,
      user: 'Mike Chen',
      avatar: 'MC',
      rating: 4,
      date: '2024-01-05',
      comment: 'Great experience overall. They arrived on time and did a fantastic job. Would definitely recommend!'
    },
    {
      id: 3,
      user: 'Emily Davis',
      avatar: 'ED',
      rating: 5,
      date: '2023-12-28',
      comment: 'Professional, reliable, and affordable. What more could you ask for? Will be using them regularly.'
    }
  ]

  const timeSlots = service.availability[selectedDate?.toLowerCase()] || []

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link to="/browse-services">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Service Header */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-medium">
                    {service.category}
                  </span>
                  {service.provider.verified && (
                    <div className="flex items-center space-x-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">{service.title}</h1>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="text-white font-medium">{service.provider.rating}</span>
                    <span>({service.provider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{service.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text">${service.price}</div>
                <div className="text-sm text-gray-400">per session</div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {service.images.map((image, index) => (
                <div key={index} className="aspect-video bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">About This Service</h2>
              <p className="text-gray-300 leading-relaxed">{service.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Service Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Service Area</span>
                    <span className="text-white">{service.serviceArea}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Languages</span>
                    <span className="text-white">{service.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Insurance</span>
                    <span className="text-green-400">{service.insurance}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Provider Stats</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Response Rate</span>
                    <span className="text-white">{service.responseRate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-white">{service.provider.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white">{service.provider.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Reviews */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Customer Reviews</h2>
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </div>
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white">{review.user}</h4>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
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
          {/* Provider Card */}
          <Card>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-2xl">{service.provider.avatar}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{service.provider.name}</h3>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{service.provider.rating}</span>
                <span>•</span>
                <span>{service.provider.reviews} reviews</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Provider
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Heart className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                {isSaved ? 'Saved' : 'Save Provider'}
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </Card>

          {/* Booking Form */}
          <Card>
            <h3 className="text-xl font-semibold text-white mb-4">Book This Service</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Available Times
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedTime === time
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                            : 'glass-card text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <Link to={`/customer/booking/${id}`}>
                <Button 
                  className="w-full" 
                  disabled={!selectedDate || !selectedTime}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now - ${service.price}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Trust Badges */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">Why Choose Us?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Fully insured providers</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-300">Quality guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">Verified professionals</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default CustomerServiceDetails
