import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, MapPin, DollarSign, User, Phone, 
  MessageSquare, CreditCard, CheckCircle, ArrowLeft,
  Home, FileText, Shield
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const BookingFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState({
    serviceId: id,
    date: '',
    time: '',
    address: '',
    phone: '',
    notes: '',
    paymentMethod: 'card',
    emergencyContact: '',
    specialRequests: ''
  })

  // Mock service data
  const service = {
    id: id,
    title: 'Professional Home Cleaning Service',
    provider: 'CleanPro Solutions',
    price: 75,
    duration: '2-3 hours',
    image: 'cleaning'
  }

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'cash', label: 'Cash on Service' }
  ]

  const steps = [
    { id: 1, title: 'Date & Time', icon: Calendar },
    { id: 2, title: 'Service Details', icon: Home },
    { id: 3, title: 'Contact Info', icon: User },
    { id: 4, title: 'Payment', icon: CreditCard },
    { id: 5, title: 'Confirmation', icon: CheckCircle }
  ]

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    })
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate booking submission
    setTimeout(() => {
      navigate('/customer/bookings')
    }, 2000)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Select Date & Time</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Date
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Time
                  </label>
                  <Select
                    name="time"
                    value={bookingData.time}
                    onChange={handleInputChange}
                    options={timeSlots.map(time => ({ value: time, label: time }))}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-white mb-3">Available Time Slots</h4>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setBookingData({ ...bookingData, time })}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${
                      bookingData.time === time
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'glass-card text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Service Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Address
                  </label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Enter your service address"
                    value={bookingData.address}
                    onChange={handleInputChange}
                    icon={MapPin}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="notes"
                    placeholder="Any special requirements or instructions..."
                    value={bookingData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact
                  </label>
                  <Input
                    type="text"
                    name="emergencyContact"
                    placeholder="Emergency contact number"
                    value={bookingData.emergencyContact}
                    onChange={handleInputChange}
                    icon={Phone}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Your phone number"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    icon={Phone}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="specialRequests"
                    placeholder="Any additional requests or preferences..."
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-white mb-3">Communication Preferences</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 bg-white/10 border-white/20 rounded text-cyan-500" />
                  <span className="text-gray-300">SMS notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 bg-white/10 border-white/20 rounded text-cyan-500" />
                  <span className="text-gray-300">Email updates</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 bg-white/10 border-white/20 rounded text-cyan-500" />
                  <span className="text-gray-300">Phone call reminders</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
              <div className="space-y-4">
                <Select
                  name="paymentMethod"
                  value={bookingData.paymentMethod}
                  onChange={handleInputChange}
                  options={paymentMethods}
                />
                
                {bookingData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Card Number"
                      icon={CreditCard}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="MM/YY"
                      />
                      <Input
                        type="text"
                        placeholder="CVV"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-card p-4 rounded-xl">
              <h4 className="font-medium text-white mb-3">Price Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Service Fee</span>
                  <span>${service.price}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Platform Fee</span>
                  <span>$5</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Taxes</span>
                  <span>$8</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total</span>
                    <span className="text-xl gradient-text">${service.price + 13}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-300">Your service has been successfully booked</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <h4 className="font-semibold text-white mb-4">Booking Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Service</span>
                  <span className="text-white">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Provider</span>
                  <span className="text-white">{service.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time</span>
                  <span className="text-white">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Address</span>
                  <span className="text-white">{bookingData.address}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-xl font-bold gradient-text">${service.price + 13}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <Button onClick={handleSubmit} className="w-full">
                Go to My Bookings
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Provider
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Link to={`/customer/service/${id}`}>
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Service
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="p-8">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        currentStep >= step.id
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                          : 'glass-card text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-full h-0.5 mx-2 ${
                          currentStep > step.id ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-white/10'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between text-xs">
                {steps.map((step) => (
                  <span key={step.id} className={`${
                    currentStep >= step.id ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && (!bookingData.date || !bookingData.time)) ||
                      (currentStep === 2 && !bookingData.address) ||
                      (currentStep === 3 && !bookingData.phone)
                    }
                  >
                    {currentStep === 4 ? 'Confirm Booking' : 'Next'}
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Service Summary</h3>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">{service.title[0]}</span>
              </div>
              <div>
                <h4 className="font-semibold text-white">{service.title}</h4>
                <p className="text-gray-400">{service.provider}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duration</span>
                <span className="text-white">{service.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Base Price</span>
                <span className="text-white">${service.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Platform Fee</span>
                <span className="text-white">$5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Taxes</span>
                <span className="text-white">$8</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">Total</span>
                <span className="text-2xl font-bold gradient-text">${service.price + 13}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-green-400">
                <Shield className="w-4 h-4" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center space-x-2 text-cyan-400">
                <FileText className="w-4 h-4" />
                <span>Booking confirmation</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Phone className="w-4 h-4" />
                <span>24/7 support</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingFormPage
