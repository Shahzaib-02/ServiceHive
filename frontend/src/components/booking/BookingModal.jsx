import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, Star, CreditCard, MapPin } from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Toast from '../ui/Toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import StripeCheckoutPanel from '../payments/StripeCheckoutPanel'
import GoogleLocationMap from '../maps/GoogleLocationMap'
import { resolveServiceImageSrc } from '../../utils/serviceImages'

const INITIAL_FORM_STATE = {
  selectedDate: '',
  selectedTime: '',
  notes: '',
  location: null,
  showMap: false,
  paymentMethod: 'stripe',
  showPayment: false,
  createdBookingId: null,
  isSubmitting: false,
}

const BookingModal = ({ isOpen, onClose, service }) => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [selectedDate, setSelectedDate] = useState(INITIAL_FORM_STATE.selectedDate)
  const [selectedTime, setSelectedTime] = useState(INITIAL_FORM_STATE.selectedTime)
  const [notes, setNotes] = useState(INITIAL_FORM_STATE.notes)
  const [location, setLocation] = useState(INITIAL_FORM_STATE.location)
  const [showMap, setShowMap] = useState(INITIAL_FORM_STATE.showMap)
  const [paymentMethod, setPaymentMethod] = useState(INITIAL_FORM_STATE.paymentMethod)
  const [showPayment, setShowPayment] = useState(INITIAL_FORM_STATE.showPayment)
  const [createdBookingId, setCreatedBookingId] = useState(INITIAL_FORM_STATE.createdBookingId)
  const [isSubmitting, setIsSubmitting] = useState(INITIAL_FORM_STATE.isSubmitting)
  const [toast, setToast] = useState({ message: '', type: 'error', isVisible: false })

  const serviceId = service?._id || service?.id

  const resetForm = useCallback(() => {
    setSelectedDate(INITIAL_FORM_STATE.selectedDate)
    setSelectedTime(INITIAL_FORM_STATE.selectedTime)
    setNotes(INITIAL_FORM_STATE.notes)
    setLocation(INITIAL_FORM_STATE.location)
    setShowMap(INITIAL_FORM_STATE.showMap)
    setPaymentMethod(INITIAL_FORM_STATE.paymentMethod)
    setShowPayment(INITIAL_FORM_STATE.showPayment)
    setCreatedBookingId(INITIAL_FORM_STATE.createdBookingId)
    setIsSubmitting(INITIAL_FORM_STATE.isSubmitting)
    setToast({ message: '', type: 'error', isVisible: false })
  }, [])

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen, resetForm])

  useEffect(() => {
    if (isOpen && serviceId) {
      setShowPayment(false)
      setCreatedBookingId(null)
      setIsSubmitting(false)
    }
  }, [isOpen, serviceId])

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type, isVisible: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  const handleLocationSelect = useCallback((selectedLocation) => {
    setLocation(selectedLocation)
  }, [])

  if (!isOpen || !service) return null

  const servicePrice = service.basePrice || service.price || 0
  const serviceFee = 0
  const totalPrice = servicePrice + serviceFee
  const ratingValue = Number(service.rating) || 0
  const reviewsCount = Array.isArray(service.reviews)
    ? service.reviews.length
    : Number(service.reviews) || 0

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ]

  const createTemporaryBookingAndShowPayment = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      if (!token) {
        showToast('Please login to book a service', 'error')
        navigate('/login')
        setIsSubmitting(false)
        return
      }

      const authHeaders = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const bookingPayload = {
        serviceId: service._id || service.id,
        providerId: service.providerId?._id?.toString() || service.providerId?._id || service.providerId || service.providerIdStr,
        totalAmount: totalPrice,
        notes: notes,
        location: location ? {
          address: location.fullAddress || '',
          coordinates: { lat: location.lat || 0, lng: location.lng || 0 }
        } : {
          address: 'Customer location',
          coordinates: { lat: 0, lng: 0 }
        },
        bookingDate: selectedDate,
        status: 'pending'
      }

      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const bookingsUrl = apiBase.endsWith('/api') ? `${apiBase}/bookings` : `${apiBase}/api/bookings`

      const response = await fetch(bookingsUrl, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(bookingPayload)
      })

      if (response.ok) {
        const result = await response.json()
        const rawId =
          result.booking?._id ?? result.booking?.id ?? result._id ?? result.id
        const bookingId = rawId != null ? String(rawId) : ''
        if (!bookingId) {
          showToast('Booking created but missing id. Please check My Bookings.', 'error')
          setIsSubmitting(false)
          return
        }
        setCreatedBookingId(bookingId)
        setShowPayment(true)
        setIsSubmitting(false)
      } else {
        const errorData = await response.json()
        setCreatedBookingId(null)
        setShowPayment(false)
        if (response.status === 403) {
          showToast('Authentication failed. Please login again.', 'error')
          setTimeout(() => navigate('/login'), 2000)
        } else if (response.status === 400 && errorData.message?.includes('validation')) {
          showToast('Invalid booking data. Please check all fields and try again.', 'error')
        } else if (response.status === 401) {
          showToast('Session expired. Please login again.', 'error')
          setTimeout(() => navigate('/login'), 2000)
        } else {
          showToast('Booking failed: ' + (errorData.message || errorData.error || 'Please try again'), 'error')
        }
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Booking creation error:', error)
      showToast('Booking failed. Please try again.', 'error')
      setCreatedBookingId(null)
      setShowPayment(false)
      setIsSubmitting(false)
    }
  }

  const handleQuickBook = async () => {
    if (isSubmitting) return
    if (!selectedDate || !selectedTime) {
      showToast('Please select date and time', 'warning')
      return
    }
    await createTemporaryBookingAndShowPayment()
  }

  const handlePaymentSuccess = async () => {
    try {
      showToast('Payment successful! Redirecting to bookings...', 'success')
      await new Promise(resolve => setTimeout(resolve, 500))
      handleClose()
      navigate('/customer/bookings')
    } catch (error) {
      console.error('Error during payment success navigation:', error)
    }
  }

  const handleViewBookings = () => {
    try {
      handleClose()
      navigate('/customer/bookings')
    } catch (error) {
      console.error('Error navigating to bookings:', error)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        setLocation({
          lat: latitude,
          lng: longitude,
          fullAddress: 'Detecting address...',
          detectedArea: 'Unknown'
        })
        setShowMap(true)

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC2fWxeerzaACQnhahbU85T83o4fTTOszw`
          )
          const data = await response.json()

          if (data.results && data.results[0]) {
            const address = data.results[0].formatted_address

            let detectedArea = 'Unknown'
            for (const component of data.results[0].address_components) {
              if (component.types.includes('sublocality') ||
                  component.types.includes('neighborhood') ||
                  component.types.includes('locality')) {
                detectedArea = component.long_name
                break
              }
            }

            setLocation({
              lat: latitude,
              lng: longitude,
              fullAddress: address,
              detectedArea: detectedArea
            })
          }
        } catch (error) {
          console.error('Error getting address:', error)
          setLocation({
            lat: latitude,
            lng: longitude,
            fullAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            detectedArea: 'Unknown'
          })
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        let errorMessage = 'Unable to get your location'

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }

        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  return (
    <React.Fragment>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card hover={false} className="m-4 border-white/20">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Quick Booking</h2>
                    <p className="text-gray-400">Book {service.title} in seconds</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors p-2"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex gap-6 mb-6">
                  <div className="flex-shrink-0">
                    {service.images && service.images.length > 0 ? (
                      <img
                        src={resolveServiceImageSrc(service.images[0])}
                        alt={service.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-custom-yellow/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-black text-2xl font-bold">
                          {service.title?.[0] || 'S'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {service.providerName || service.providerId?.name || service.provider || 'Service Provider'}
                        </span>
                      </div>

                      {ratingValue > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{ratingValue.toFixed(1)}</span>
                          <span className="text-gray-400">({reviewsCount} reviews)</span>
                        </div>
                      )}

                      {service.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{service.location}</span>
                        </div>
                      )}

                      {service.duration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{service.duration}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-lg">
                        <span className="text-custom-yellow font-bold">PKR</span>
                        <span className="text-white font-bold">{servicePrice}</span>
                        <span className="text-gray-400">/session</span>
                      </div>
                    </div>
                  </div>
                </div>

                {!showPayment && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Select Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-3 glass-card border bg-black border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow"
                        required
                      >
                        <option value="">Select a time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Service Location
                      </label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setShowMap((prev) => !prev)}
                            className="px-4 py-3 glass-card border border-white/20 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            {showMap ? 'Hide Map' : 'Select on Map'}
                          </button>
                          <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="px-4 py-3 bg-custom-yellow/20 border border-custom-yellow/30 rounded-xl text-custom-yellow hover:bg-custom-yellow/30 transition-colors flex items-center gap-2"
                          >
                            <MapPin className="w-4 h-4" />
                            Current Location
                          </button>
                        </div>

                        {showMap && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3"
                          >
                            <div className="glass-card border border-white/20 rounded-xl p-2">
                              <GoogleLocationMap
                                height="300px"
                                onLocationSelect={handleLocationSelect}
                                initialLocation={location}
                                editable={true}
                              />
                            </div>
                            {location && (
                              <div className="mt-2 p-3 glass-card border border-white/20 rounded-xl">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-custom-yellow mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm text-white font-medium">Selected Location:</p>
                                    <p className="text-xs text-gray-300 mt-1">{location.fullAddress}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {location.detectedArea && `Area: ${location.detectedArea}`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <CreditCard className="w-4 h-4 inline mr-2" />
                        Payment Method
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 p-3 glass-card border border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="stripe"
                            checked={paymentMethod === 'stripe'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-custom-yellow focus:ring-custom-yellow cursor-pointer"
                          />
                          <div className="flex-1">
                            <p className="text-white font-medium">Pay with Stripe</p>
                            <p className="text-xs text-gray-400">Secure online payment with credit/debit card</p>
                          </div>
                          <CreditCard className="w-5 h-5 text-custom-yellow" />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Click &quot;Book Now&quot; below to create your booking, then you&apos;ll proceed to Stripe checkout.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requirements or instructions..."
                        rows={3}
                        className="w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-yellow resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleQuickBook}
                        disabled={!selectedDate || !selectedTime || isSubmitting}
                        variant='outline'
                      >
                        {isSubmitting ? 'Processing...' : (selectedDate && selectedTime ? `Book Now - PKR ${totalPrice}` : 'Select Date & Time')}
                      </Button>
                    </div>
                  </div>
                )}

                {showPayment && createdBookingId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <div className="glass-card border border-white/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="w-5 h-5 text-custom-yellow" />
                        <h3 className="text-lg font-semibold text-white">Complete Payment</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-4">
                        Your booking has been created! Please complete the payment to confirm your service.
                      </p>
                      <StripeCheckoutPanel
                        bookingId={createdBookingId}
                        onPaymentSuccess={handlePaymentSuccess}
                        amount={totalPrice}
                        currency="pkr"
                      />
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowPayment(false)}
                          className="flex-1"
                        >
                          Back to Booking
                        </Button>
                        <Button
                        variant='outline'
                          onClick={handleViewBookings}
                          className="flex-1"
                        >
                          View My Bookings
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      )}
    </React.Fragment>
  )
}

export default BookingModal
