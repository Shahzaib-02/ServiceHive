

// import React, { useState, useEffect, useCallback } from 'react'
// import { Link, useParams, useNavigate } from 'react-router-dom'
// import { useAuth } from '../../hooks/useAuth'
// import { motion } from 'framer-motion'
// import {
//   ArrowLeft,
//   Star,
//   MapPin,
//   Clock,
//   CheckCircle,
//   Loader2,
//   Heart,
//   Search,
//   Home, Sparkles, Monitor, Car, GraduationCap, Briefcase, User
// } from 'lucide-react'

// import Button from '../../components/ui/Button'
// import Card from '../../components/ui/Card'
// import BookingModal from '../../components/booking/BookingModal'
// import Toast from '../../components/ui/Toast'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// const groupMeta = {
//   home: { 
//     title: 'Home Services', 
//     description: 'Find trusted professionals for your home',
//     icon: Home
//   },
//   personal: { 
//     title: 'Personal Care', 
//     description: 'Caretakers, assistants & personal help',
//     icon: User
//   },
//   beauty: { 
//     title: 'Beauty & Wellness', 
//     description: 'Look and feel your best',
//     icon: Sparkles
//   },
//   tech: { 
//     title: 'Tech Support', 
//     description: 'Expert tech solutions',
//     icon: Monitor
//   },
//   automotive: { 
//     title: 'Automotive', 
//     description: 'Car care and maintenance',
//     icon: Car
//   },
//   education: { 
//     title: 'Education', 
//     description: 'Learn from the best tutors',
//     icon: GraduationCap
//   },
//   business: { 
//     title: 'Business Services', 
//     description: 'Grow your business',
//     icon: Briefcase
//   },
// }

// const ServiceSubcategoryPage = () => {
//   const { categoryId } = useParams()
//   const { isAuthenticated } = useAuth()
//   const navigate = useNavigate()
//   const [sortBy, setSortBy] = useState('rating')
//   const [services, setServices] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
  
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
//   const [selectedService, setSelectedService] = useState(null)
  
//   const [toast, setToast] = useState({ message: '', type: 'warning', isVisible: false })

//   const groupInfo = groupMeta[categoryId] || {
//     title: 'Services',
//     description: 'Find service providers',
//     icon: Search
//   }

//   const showToast = (message, type = 'warning') => {
//     setToast({ message, type, isVisible: true })
//     setTimeout(() => {
//       setToast(prev => ({ ...prev, isVisible: false }))
//     }, 3000)
//   }

//   const hideToast = () => {
//     setToast(prev => ({ ...prev, isVisible: false }))
//   }

//   const fetchServices = useCallback(async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const queryParams = new URLSearchParams()
//       queryParams.set('group', categoryId)
//       queryParams.set('isApproved', 'true')
//       queryParams.set('sort', sortBy)

//       const response = await fetch(`${API_BASE_URL}/services?${queryParams.toString()}`)

//       if (!response.ok) {
//         throw new Error(`Failed to fetch services: ${response.status}`)
//       }

//       const data = await response.json()
//       const servicesData = data.services || data || []
//       setServices(servicesData)
//     } catch (err) {
//       setError(err.message)
//       setServices([])
//     } finally {
//       setLoading(false)
//     }
//   }, [categoryId, sortBy])

//   useEffect(() => {
//     fetchServices()
//   }, [fetchServices])
//   const sortedServices = [...services].sort((a, b) => {
//     switch (sortBy) {
//       case 'rating':
//         return (b.rating || 0) - (a.rating || 0)
//       case 'price-low':
//         return (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0)
//       case 'price-high':
//         return (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0)
//       case 'newest':
//         return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
//       default:
//         return 0
//     }
//   })

//   const IconComponent = groupInfo.icon

//   return (
//     <div className="min-h-screen text-white">
//       {/* Background Glow */}
//       <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 blur-[140px] rounded-full pointer-events-none"></div>
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 blur-[140px] rounded-full pointer-events-none"></div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
//         {/* Header */}
//         <div className="mb-8">
//           <Link to="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-custom-yellow transition-colors mb-6">
//             <ArrowLeft className="w-4 h-4" />
//             Back to Categories
//           </Link>

//           <div className="flex items-center gap-4 mb-4">
//             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-custom-yellow/20 to-orange-500/20 flex items-center justify-center">
//               <IconComponent className="w-8 h-8 text-custom-yellow" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-bold text-white mb-2">{groupInfo.title}</h1>
//               <p className="text-gray-400">{groupInfo.description}</p>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Sort */}
//         <Card className="p-4 mb-8 bg-white/5 border border-white/10">
//           <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//             <div className="text-sm text-gray-400">
//               {loading ? 'Loading...' : `${services.length} service${services.length !== 1 ? 's' : ''} available`}
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-gray-400">Sort by:</span>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-custom-yellow"
//               >
//                 <option value="rating">Highest Rated</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="newest">Newest First</option>
//               </select>
//             </div>
//           </div>
//         </Card>

//         {/* Loading State */}
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 className="w-12 h-12 text-custom-yellow animate-spin mb-4" />
//             <p className="text-gray-400">Loading services...</p>
//           </div>
//         )}

//         {/* Error State */}
//         {!loading && error && (
//           <div className="text-center py-12">
//             <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
//               <span className="text-red-400 text-3xl">!</span>
//             </div>
//             <h3 className="text-xl font-semibold text-white mb-2">
//               Something went wrong
//             </h3>
//             <p className="text-gray-400 mb-6">{error}</p>
//             <Button onClick={fetchServices}>
//               Try Again
//             </Button>
//           </div>
//         )}

//         {/* Services Grid */}
//         {!loading && !error && (
//           <>
//             {sortedServices.length > 0 ? (
//               <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 {sortedServices.map((service, index) => {
//                   const price = service.basePrice || service.price || 0
//                   const providerName = service.providerId?.name || service.provider || service.providerName || 'Service Provider'
//                   const reviewsCount = service.reviews?.length || service.reviews || 0
//                   const serviceLocation = service.location || 'Location not specified'
//                   const subCategory = service.category || ''

//                   return (
//                     <motion.div
//                       key={service._id || service.id || `service-${index}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                     >
//                       <Card className="overflow-hidden group cursor-pointer bg-white/5 border border-white/10 hover:border-custom-yellow transition-all duration-300">
//                         {/* Image Slider */}
//                         <div className="relative group/slider">
//                           {service.images && service.images.length > 0 ? (
//                             <div className="relative overflow-hidden rounded-t-lg">
//                               <div 
//                                 className="flex transition-transform duration-500 ease-out h-48"
//                                 style={{ transform: `translateX(-${(service._currentImageIndex || 0) * 100}%)` }}
//                               >
//                                 {service.images.map((img, imgIdx) => (
//                                   <img
//                                     key={imgIdx}
//                                     src={img}
//                                     alt={`${service.title} ${imgIdx + 1}`}
//                                     className="w-full h-48 object-cover shrink-0"
//                                   />
//                                 ))}
//                               </div>

//                               {/* Navigation Arrows */}
//                               {service.images.length > 1 && (
//                                 <>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       setServices(prev => prev.map((s, i) => {
//                                         if (i === index) {
//                                           const current = s._currentImageIndex || 0
//                                           return { ...s, _currentImageIndex: current === 0 ? s.images.length - 1 : current - 1 }
//                                         }
//                                         return s
//                                       }))
//                                     }}
//                                     className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/70"
//                                   >
//                                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
//                                   </button>
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       setServices(prev => prev.map((s, i) => {
//                                         if (i === index) {
//                                           const current = s._currentImageIndex || 0
//                                           return { ...s, _currentImageIndex: (current + 1) % s.images.length }
//                                         }
//                                         return s
//                                       }))
//                                     }}
//                                     className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/70"
//                                   >
//                                     <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
//                                   </button>

//                                   {/* Dots Indicator */}
//                                   <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
//                                     {service.images.map((_, dotIdx) => (
//                                       <button
//                                         key={dotIdx}
//                                         onClick={(e) => {
//                                           e.stopPropagation()
//                                           setServices(prev => prev.map((s, i) => {
//                                             if (i === index) {
//                                               return { ...s, _currentImageIndex: dotIdx }
//                                             }
//                                             return s
//                                           }))
//                                         }}
//                                         className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                                           (service._currentImageIndex || 0) === dotIdx
//                                             ? 'bg-custom-yellow w-4'
//                                             : 'bg-white/60 hover:bg-white'
//                                         }`}
//                                       />
//                                     ))}
//                                   </div>
//                                 </>
//                               )}
//                             </div>
//                           ) : (
//                             <div className="h-48 bg-gradient-to-br from-custom-yellow/20 to-orange-500/20 flex items-center justify-center">
//                               <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center">
//                                 <span className="text-black text-2xl font-bold">
//                                   {service.title?.[0] || 'S'}
//                                 </span>
//                               </div>
//                             </div>
//                           )}
//                           <button className="absolute top-4 right-4 p-2 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
//                             <Heart className="w-5 h-5 text-custom-yellow" />
//                           </button>
//                           {/* Show sub-category badge */}
//                           <div className="absolute bottom-4 left-4 px-3 py-1 bg-custom-yellow/20 backdrop-blur-sm rounded-lg">
//                             <span className="text-custom-yellow text-sm font-medium capitalize">
//                               {subCategory.replace(/-/g, ' ')}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Content */}
//                         <div className="p-6">
//                           {/* Title & Price */}
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <h3 className="text-lg font-semibold text-white group-hover:text-custom-yellow transition-colors">
//                                   {service.title}
//                                 </h3>
//                                 {service.verified && (
//                                   <CheckCircle className="w-4 h-4 text-custom-yellow" />
//                                 )}
//                               </div>
//                               <p className="text-sm text-gray-400">{providerName}</p>
//                             </div>
//                             <div className="text-right ml-4">
//                               <div className="text-2xl font-bold gradient-text">${price}</div>
//                               <div className="text-xs text-gray-400">per session</div>
//                             </div>
//                           </div>

//                           {/* Rating & Location */}
//                           <div className="flex items-center gap-4 text-sm mb-3">
//                             {service.rating > 0 ? (
//                               <div className="flex items-center gap-1">
//                                 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
//                                 <span className="text-white">{service.rating.toFixed(1)}</span>
//                                 <span className="text-gray-400">({reviewsCount})</span>
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-1 text-gray-500">
//                                 <Star className="w-4 h-4" />
//                                 <span>No ratings yet</span>
//                               </div>
//                             )}
//                             <div className="flex items-center gap-1 text-gray-400">
//                               <MapPin className="w-4 h-4" />
//                               <span className="truncate max-w-32">{serviceLocation}</span>
//                             </div>
//                           </div>

//                           {/* Description */}
//                           <p className="text-sm text-gray-300 mb-4 line-clamp-2">
//                             {service.description}
//                           </p>

//                           {/* ETA / Duration */}
//                           {service.eta && (
//                             <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
//                               <Clock className="w-4 h-4" />
//                               <span>{service.eta}</span>
//                               {service.duration && service.duration !== service.eta && (
//                                 <span>• Duration: {service.duration}</span>
//                               )}
//                             </div>
//                           )}

//                           {/* CTA */}
//                           <Button 
//                             variant='outline' 
//                             className="w-full" 
//                             size="sm"
//                             onClick={() => {
//                               if (!isAuthenticated) {
//                                 showToast('Please sign in or login to your account first to book a service')
//                                 setTimeout(() => {
//                                   navigate('/login')
//                                 }, 2000)
//                                 return
//                               }
//                               setSelectedService(service)
//                               setIsBookingModalOpen(true)
//                             }}
//                           >
//                             Book Now
//                           </Button>
//                         </div>
//                       </Card>
//                     </motion.div>
//                   )
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                   <Search className="w-10 h-10 text-black" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-white mb-2">
//                   No services found
//                 </h3>
//                 <p className="text-gray-400 mb-6">
//                   No approved services available in this category yet. Check back later!
//                 </p>
//                 <Link to="/services">
//                   <Button>Browse Other Categories</Button>
//                 </Link>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     {/* Booking Modal */}
//       <BookingModal
//         isOpen={isBookingModalOpen}
//         onClose={() => setIsBookingModalOpen(false)}
//         service={selectedService}
//       />
      
//       {/* Toast Notification */}
//       <Toast
//         message={toast.message}
//         type={toast.type}
//         isVisible={toast.isVisible}
//         onClose={hideToast}
//       />
//     </div>
//   )
// }

// export default ServiceSubcategoryPage






import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Loader2,
  Heart,
  Search,
  Home, Sparkles, Monitor, Car, GraduationCap, Briefcase, User
} from 'lucide-react'

import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import BookingModal from '../../components/booking/BookingModal'
import Toast from '../../components/ui/Toast'
import { resolveServiceImageSrc } from '../../utils/serviceImages'

const API_BASE =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000'
const API_BASE_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`

const normalizeServicesList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.services)) return data.services
  return []
}

const groupMeta = {
  home:       { title: 'Home Services',      description: 'Find trusted professionals for your home',    icon: Home },
  personal:   { title: 'Personal Care',       description: 'Caretakers, assistants & personal help',      icon: User },
  beauty:     { title: 'Beauty & Wellness',   description: 'Look and feel your best',                     icon: Sparkles },
  tech:       { title: 'Tech Support',        description: 'Expert tech solutions',                       icon: Monitor },
  automotive: { title: 'Automotive',          description: 'Car care and maintenance',                    icon: Car },
  education:  { title: 'Education',           description: 'Learn from the best tutors',                  icon: GraduationCap },
  business:   { title: 'Business Services',   description: 'Grow your business',                          icon: Briefcase },
}

const ServiceSubcategoryPage = () => {
  const { categoryId } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('rating')
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'warning', isVisible: false })
  const toastTimerRef = useRef(null)

  const groupInfo = groupMeta[categoryId] || { title: 'Services', description: 'Find service providers', icon: Search }

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const showToast = useCallback((message, type = 'warning') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, type, isVisible: true })
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }))
    }, 3000)
  }, [])

  const handleCloseBooking = useCallback(() => {
    setIsBookingModalOpen(false)
    setSelectedService(null)
  }, [])

  const handleBookNow = useCallback((service) => {
    if (!isAuthenticated) {
      showToast('Please sign in or login to your account first to book a service')
      setTimeout(() => navigate('/login'), 2000)
      return
    }
    setSelectedService(service)
    setIsBookingModalOpen(true)
  }, [isAuthenticated, navigate, showToast])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const queryParams = new URLSearchParams()
      queryParams.set('group', categoryId)
      queryParams.set('isApproved', 'true')
      queryParams.set('sort', sortBy)

      const response = await fetch(`/api/services?${queryParams.toString()}`)
      if (!response.ok) throw new Error(`Failed to fetch services: ${response.status}`)

      const data = await response.json()
      setServices(normalizeServicesList(data))
    } catch (err) {
      setError(err.message)
      setServices([])
    } finally {
      setLoading(false)
    }
  }, [categoryId, sortBy])

  useEffect(() => { fetchServices() }, [fetchServices])

  const sortedServices = [...services].sort((a, b) => {
    switch (sortBy) {
      case 'rating':     return (b.rating || 0) - (a.rating || 0)
      case 'price-low':  return (a.basePrice || a.price || 0) - (b.basePrice || b.price || 0)
      case 'price-high': return (b.basePrice || b.price || 0) - (a.basePrice || a.price || 0)
      case 'newest':     return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default:           return 0
    }
  })

  const IconComponent = groupInfo.icon

  return (
    <div className="min-h-screen text-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-custom-yellow transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-custom-yellow/20 to-orange-500/20 flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-custom-yellow" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{groupInfo.title}</h1>
              <p className="text-gray-400">{groupInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-8 bg-white/5 border border-white/10">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-gray-400">
              {loading ? 'Loading...' : `${services.length} service${services.length !== 1 ? 's' : ''} available`}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-custom-yellow"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-custom-yellow animate-spin mb-4" />
            <p className="text-gray-400">Loading services...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-3xl">!</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <Button onClick={fetchServices}>Try Again</Button>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && (
          <>
            {sortedServices.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedServices.map((service, index) => {
                  const price = service.basePrice || service.price || 0

                  // FIX: providerName comes as flat field from backend now.
                  // Fallback chain covers all cases: flat field → populated object → legacy fields
                  const providerName =
                    service.providerName ||
                    service.providerId?.name ||
                    service.provider ||
                    'Service Provider'

                  const reviewsCount = service.reviews?.length || service.reviews || 0
                  const serviceLocation = service.location || 'Location not specified'
                  const subCategory = service.category || ''

                  return (
                    <motion.div
                      key={service._id || service.id || `service-${index}`}
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card hover={false} className="overflow-hidden group bg-white/5 border border-white/10 hover:border-custom-yellow transition-all duration-300">
                        {/* Image Slider */}
                        <div className="relative group/slider">
                          {service.images && service.images.length > 0 ? (
                            <div className="relative overflow-hidden rounded-t-lg h-48 w-full">
                              <div
                                className="flex h-full w-full transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${(service._currentImageIndex || 0) * 100}%)` }}
                              >
                                {service.images.map((img, imgIdx) => (
                                  <div
                                    key={imgIdx}
                                    className="h-full w-full min-w-full shrink-0 grow-0 basis-full"
                                  >
                                    <img
                                      src={resolveServiceImageSrc(img)}
                                      alt={`${service.title} ${imgIdx + 1}`}
                                      loading={imgIdx === 0 ? 'eager' : 'lazy'}
                                      decoding="async"
                                      className="h-full w-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.onerror = null
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581579188871-45ea1f4a7c6e?auto=format&fit=crop&w=800&q=80'
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>

                              {service.images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setServices(prev => prev.map((s, i) => {
                                        if (i !== index) return s
                                        const current = s._currentImageIndex || 0
                                        return { ...s, _currentImageIndex: current === 0 ? s.images.length - 1 : current - 1 }
                                      }))
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/70"
                                  >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setServices(prev => prev.map((s, i) => {
                                        if (i !== index) return s
                                        const current = s._currentImageIndex || 0
                                        return { ...s, _currentImageIndex: (current + 1) % s.images.length }
                                      }))
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 backdrop-blur-sm rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-black/70"
                                  >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>

                                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {service.images.map((_, dotIdx) => (
                                      <button
                                        key={dotIdx}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setServices(prev => prev.map((s, i) =>
                                            i === index ? { ...s, _currentImageIndex: dotIdx } : s
                                          ))
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                          (service._currentImageIndex || 0) === dotIdx
                                            ? 'bg-custom-yellow w-4'
                                            : 'bg-white/60 hover:bg-white'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="h-48 bg-gradient-to-br from-custom-yellow/20 to-orange-500/20 flex items-center justify-center">
                              <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center">
                                <span className="text-black text-2xl font-bold">{service.title?.[0] || 'S'}</span>
                              </div>
                            </div>
                          )}
                          <button className="absolute top-4 right-4 p-2 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <Heart className="w-5 h-5 text-custom-yellow" />
                          </button>
                          <div className="absolute bottom-4 left-4 px-3 py-1 bg-custom-yellow/20 backdrop-blur-sm rounded-lg">
                            <span className="text-custom-yellow text-sm font-medium capitalize">
                              {subCategory.replace(/-/g, ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold text-white group-hover:text-custom-yellow transition-colors">
                                  {service.title}
                                </h3>
                                {service.verified && <CheckCircle className="w-4 h-4 text-custom-yellow" />}
                              </div>
                              {/* Provider name — now always populated from backend */}
                              <p className="text-sm text-gray-400">{providerName}</p>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold gradient-text">PKR {price.toLocaleString()}</div>
                              <div className="text-xs text-gray-400">per session</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm mb-3">
                            {service.rating > 0 ? (
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white">{service.rating.toFixed(1)}</span>
                                <span className="text-gray-400">({reviewsCount})</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-500">
                                <Star className="w-4 h-4" />
                                <span>No ratings yet</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate max-w-32">{serviceLocation}</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{service.description}</p>

                          {service.eta && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                              <Clock className="w-4 h-4" />
                              <span>{service.eta}</span>
                              {service.duration && service.duration !== service.eta && (
                                <span>• Duration: {service.duration}</span>
                              )}
                            </div>
                          )}

                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBookNow(service)
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No services found</h3>
                <p className="text-gray-400 mb-6">
                  No approved services available in this category yet. Check back later!
                </p>
                <Link to="/services">
                  <Button>Browse Other Categories</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {isBookingModalOpen && selectedService && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBooking}
          service={selectedService}
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}

export default ServiceSubcategoryPage




