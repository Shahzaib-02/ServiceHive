// // import React, { useState, useEffect } from 'react'
// // import { useLocation } from 'react-router-dom'
// // import { motion } from 'framer-motion'
// // import { 
// //   Search, Filter, MapPin, Star, Clock, DollarSign,
// //   Heart, Calendar, User, ChevronDown, Grid, List
// // } from 'lucide-react'
// // import Button from '../../components/ui/Button'
// // import Card from '../../components/ui/Card'
// // import Input from '../../components/ui/Input'
// // import Select from '../../components/ui/Select'

// // const BrowseServicesPage = () => {
// //   const location = useLocation()
// //   const [viewMode, setViewMode] = useState('grid')
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [selectedCategory, setSelectedCategory] = useState('all')
// //   const [selectedPriceRange, setSelectedPriceRange] = useState('all')
// //   const [sortBy, setSortBy] = useState('recommended')

// //   useEffect(() => {
// //     const params = new URLSearchParams(location.search)
// //     const q = params.get('q') || ''
// //     if (q) setSearchTerm(q)
// //   }, [location.search])

// //   const categories = [
// //     { value: 'all', label: 'All Categories' },
// //     { value: 'home', label: 'Home Services' },
// //     { value: 'beauty', label: 'Beauty & Wellness' },
// //     { value: 'tech', label: 'Tech Support' },
// //     { value: 'automotive', label: 'Automotive' },
// //     { value: 'education', label: 'Education' },
// //     { value: 'business', label: 'Business Services' },
// //   ]

// //   const priceRanges = [
// //     { value: 'all', label: 'Any Price' },
// //     { value: '0-25', label: 'Under $25' },
// //     { value: '25-50', label: '$25 - $50' },
// //     { value: '50-100', label: '$50 - $100' },
// //     { value: '100+', label: '$100+' },
// //   ]

// //   const sortOptions = [
// //     { value: 'recommended', label: 'Recommended' },
// //     { value: 'price-low', label: 'Price: Low to High' },
// //     { value: 'price-high', label: 'Price: High to Low' },
// //     { value: 'rating', label: 'Highest Rated' },
// //     { value: 'newest', label: 'Newest First' },
// //   ]

// //   const services = [
// //     {
// //       id: 1,
// //       title: 'Home Cleaning Service',
// //       provider: 'CleanPro Solutions',
// //       category: 'home',
// //       price: 75,
// //       rating: 4.8,
// //       reviews: 124,
// //       image: 'cleaning',
// //       location: 'New York, NY',
// //             description: 'Professional deep cleaning for your home'
// //     },
// //     {
// //       id: 2,
// //       title: 'Plumbing Repair',
// //       provider: 'QuickFix Plumbing',
// //       category: 'home',
// //       price: 120,
// //       rating: 4.9,
// //       reviews: 89,
// //       image: 'plumbing',
// //       location: 'Los Angeles, CA',
// //       availability: 'Available Tomorrow',
// //       description: 'Expert plumbing repairs and installations'
// //     },
// //     {
// //       id: 3,
// //       title: 'Web Development',
// //       provider: 'TechMasters',
// //       category: 'tech',
// //       price: 500,
// //       rating: 4.7,
// //       reviews: 56,
// //       image: 'webdev',
// //       location: 'San Francisco, CA',
// //       availability: 'Available This Week',
// //       description: 'Custom website development services'
// //     },
// //     {
// //       id: 4,
// //       title: 'Car Detailing',
// //       provider: 'AutoSpa Premium',
// //       category: 'automotive',
// //       price: 150,
// //       rating: 4.9,
// //       reviews: 203,
// //       image: 'cardetail',
// //       location: 'Chicago, IL',
// //             description: 'Complete car detailing and interior cleaning'
// //     },
// //     {
// //       id: 5,
// //       title: 'Personal Training',
// //       provider: 'FitLife Coaching',
// //       category: 'beauty',
// //       price: 80,
// //       rating: 4.6,
// //       reviews: 67,
// //       image: 'fitness',
// //       location: 'Miami, FL',
// //       availability: 'Available Tomorrow',
// //       description: 'Personalized fitness training programs'
// //     },
// //     {
// //       id: 6,
// //       title: 'Math Tutoring',
// //       provider: 'EduExperts',
// //       category: 'education',
// //       price: 45,
// //       rating: 4.8,
// //       reviews: 92,
// //       image: 'tutoring',
// //       location: 'Boston, MA',
// //             description: 'Professional math tutoring for all levels'
// //     },
// //   ]

// //   const filteredServices = services.filter(service => {
// //     const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                          service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                          service.description.toLowerCase().includes(searchTerm.toLowerCase())
// //     const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
// //     const matchesPrice = selectedPriceRange === 'all' || (() => {
// //       const [min, max] = selectedPriceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p))
// //       if (max) return service.price >= min && service.price <= max
// //       return service.price >= min
// //     })()
    
// //     return matchesSearch && matchesCategory && matchesPrice
// //   })

// //   const ServiceCard = ({ service }) => (
// //     <Card className="overflow-hidden group cursor-pointer" hover>
// //       <div className="relative">
// //         <div className="h-48 bg-gradient-to-br from-custom-yellow/20 to-orange-500/20 flex items-center justify-center">
// //           <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center">
// //             <span className="text-black text-2xl font-bold">{service.title[0]}</span>
// //           </div>
// //         </div>
// //         <button className="absolute top-4 right-4 p-2 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
// //           <Heart className="w-5 h-5 text-custom-yellow" />
// //         </button>
// //         <div className="absolute bottom-4 left-4 px-3 py-1 bg-custom-yellow/20 backdrop-blur-sm rounded-lg">
// //           <span className="text-custom-yellow text-sm font-medium">{service.category}</span>
// //         </div>
// //       </div>
      
// //       <div className="p-6">
// //         <div className="flex items-start justify-between mb-3">
// //           <div>
// //             <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-custom-yellow transition-colors">
// //               {service.title}
// //             </h3>
// //             <p className="text-gray-400 text-sm">{service.provider}</p>
// //           </div>
// //           <div className="text-right">
// //             <div className="text-2xl font-bold gradient-text">${service.price}</div>
// //             <div className="text-xs text-gray-400">per session</div>
// //           </div>
// //         </div>
        
// //         <p className="text-gray-400 text-sm mb-4 line-clamp-2">
// //           {service.description}
// //         </p>
        
// //         <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
// //           <div className="flex items-center space-x-4">
// //             <div className="flex items-center space-x-1">
// //               <Star className="w-4 h-4 text-yellow-500 fill-current" />
// //               <span>{service.rating}</span>
// //               <span>({service.reviews})</span>
// //             </div>
// //             <div className="flex items-center space-x-1">
// //               <MapPin className="w-4 h-4" />
// //               <span className="truncate max-w-20">{service.location.split(',')[1]}</span>
// //             </div>
// //           </div>
// //         </div>
        
// //         <div className="flex justify-end">
// //           <Button size="sm">
// //             Book Now
// //           </Button>
// //         </div>
// //       </div>
// //     </Card>
// //   )

// //   return (
// //     <div className="min-h-screen">
// //       {/* Header */}
// //       <section className="py-12">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="text-center mb-12">
// //             <h1 className="text-4xl lg:text-5xl font-bold text-custom-yellow mb-4">
// //               Browse Services
// //             </h1>
// //             <p className="text-xl text-gray-300">
// //               Find the perfect service provider for your needs
// //             </p>
// //           </div>

// //           {/* Search and Filters */}
// //           <div className="glass-card p-6 mb-8">
// //             <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
// //               <div className="lg:col-span-2">
// //                 <div className="relative">
// //                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <Input
// //                     placeholder="Search services, providers, or keywords..."
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     className="pl-12"
// //                   />
// //                 </div>
// //               </div>
              
// //               <Select
// //                 value={selectedCategory}
// //                 onChange={(e) => setSelectedCategory(e.target.value)}
// //                 options={categories}
// //               />
              
// //               <Select
// //                 value={sortBy}
// //                 onChange={(e) => setSortBy(e.target.value)}
// //                 options={sortOptions}
// //               />
// //             </div>

// //             <div className="flex flex-wrap items-center justify-between gap-4">
// //               <div className="flex items-center space-x-4">
// //                 <Select
// //                   value={selectedPriceRange}
// //                   onChange={(e) => setSelectedPriceRange(e.target.value)}
// //                   options={priceRanges}
// //                   className="w-48"
// //                 />
                
// //                 <Button variant="outline" size="sm">
// //                   <Filter className="w-4 h-4 mr-2" />
// //                   More Filters
// //                 </Button>
// //               </div>

// //               <div className="flex items-center space-x-2">
// //                 <Button
// //                   variant={viewMode === 'grid' ? 'primary' : 'ghost'}
// //                   size="sm"
// //                   onClick={() => setViewMode('grid')}
// //                 >
// //                   <Grid className="w-4 h-4" />
// //                 </Button>
// //                 <Button
// //                   variant={viewMode === 'list' ? 'primary' : 'ghost'}
// //                   size="sm"
// //                   onClick={() => setViewMode('list')}
// //                 >
// //                   <List className="w-4 h-4" />
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Results Count */}
// //           <div className="flex items-center justify-between mb-6">
// //             <p className="text-gray-400">
// //               Showing <span className="text-white font-medium">{filteredServices.length}</span> services
// //             </p>
// //             <div className="flex items-center space-x-2 text-sm text-gray-400">
// //               <span>Sort by:</span>
// //               <Select
// //                 value={sortBy}
// //                 onChange={(e) => setSortBy(e.target.value)}
// //                 options={sortOptions}
// //                 className="w-40"
// //               />
// //             </div>
// //           </div>

// //           {/* Services Grid */}
// //           {filteredServices.length > 0 ? (
// //             <div className={`grid gap-6 ${
// //               viewMode === 'grid' 
// //                 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
// //                 : 'grid-cols-1'
// //             }`}>
// //               {filteredServices.map((service) => (
// //                 <motion.div
// //                   key={service.id}
// //                   initial={{ opacity: 0, y: 20 }}
// //                   animate={{ opacity: 1, y: 0 }}
// //                   transition={{ duration: 0.3 }}
// //                 >
// //                   <ServiceCard service={service} />
// //                 </motion.div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-12">
// //               <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
// //                 <Search className="w-10 h-10 text-black" />
// //               </div>
// //               <h3 className="text-xl font-semibold text-white mb-2">
// //                 No services found
// //               </h3>
// //               <p className="text-gray-400 mb-6">
// //                 Try adjusting your search criteria or filters
// //               </p>
// //               <Button onClick={() => {
// //                 setSearchTerm('')
// //                 setSelectedCategory('all')
// //                 setSelectedPriceRange('all')
// //               }}>
// //                 Clear Filters
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       </section>
// //     </div>
// //   )
// // }

// // export default BrowseServicesPage





















// import React, { useState, useEffect, useCallback } from 'react'
// import { useLocation } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { 
//   Search, Filter, MapPin, Star, Grid, List,
//   Heart, Loader2
// } from 'lucide-react'
// import Button from '../../components/ui/Button'
// import Card from '../../components/ui/Card'
// import Input from '../../components/ui/Input'
// import Select from '../../components/ui/Select'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// const BrowseServicesPage = () => {
//   const location = useLocation()
//   const [viewMode, setViewMode] = useState('grid')
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState('all')
//   const [selectedPriceRange, setSelectedPriceRange] = useState('all')
//   const [sortBy, setSortBy] = useState('recommended')
  
//   // Data fetching states
//   const [services, setServices] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Sync search term from URL query param
//   useEffect(() => {
//     const params = new URLSearchParams(location.search)
//     const q = params.get('q') || ''
//     if (q) setSearchTerm(q)
//   }, [location.search])

//   // Fetch services from backend
//   const fetchServices = useCallback(async () => {
//     setLoading(true)
//     setError(null)
    
//     try {
//       const queryParams = new URLSearchParams()
//       queryParams.set('isApproved', 'true') // Only fetch approved services
//       if (searchTerm) queryParams.set('q', searchTerm)
//       if (selectedCategory !== 'all') queryParams.set('category', selectedCategory)
//       if (selectedPriceRange !== 'all') queryParams.set('priceRange', selectedPriceRange)
//       queryParams.set('sort', sortBy)

//       const response = await fetch(`${API_BASE_URL}/services?${queryParams.toString()}`)
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch services: ${response.status}`)
//       }
      
//       const data = await response.json()
//       setServices(data.services || data) // Handle both {services: []} and direct array responses
//     } catch (err) {
//       setError(err.message)
//       setServices([])
//     } finally {
//       setLoading(false)
//     }
//   }, [searchTerm, selectedCategory, selectedPriceRange, sortBy])

//   // Fetch on mount and when filters change
//   useEffect(() => {
//     fetchServices()
//   }, [fetchServices])

//   const categories = [
//     { value: 'all', label: 'All Categories' },
//     { value: 'home', label: 'Home Services' },
//     { value: 'beauty', label: 'Beauty & Wellness' },
//     { value: 'tech', label: 'Tech Support' },
//     { value: 'automotive', label: 'Automotive' },
//     { value: 'education', label: 'Education' },
//     { value: 'business', label: 'Business Services' },
//   ]

//   const priceRanges = [
//     { value: 'all', label: 'Any Price' },
//     { value: '0-25', label: 'Under $25' },
//     { value: '25-50', label: '$25 - $50' },
//     { value: '50-100', label: '$50 - $100' },
//     { value: '100+', label: '$100+' },
//   ]

//   const sortOptions = [
//     { value: 'recommended', label: 'Recommended' },
//     { value: 'price-low', label: 'Price: Low to High' },
//     { value: 'price-high', label: 'Price: High to Low' },
//     { value: 'rating', label: 'Highest Rated' },
//     { value: 'newest', label: 'Newest First' },
//   ]

//   // Client-side filtering is now minimal since backend handles most filtering
//   // Only keeping if backend doesn't support certain filters
//   const filteredServices = services

//   const ServiceCard = ({ service }) => {
//     // Handle both price field names for compatibility
//     const price = service.basePrice || service.price || 0
    
//     return (
//       <Card className="overflow-hidden group cursor-pointer" hover>
//         <div className="relative">
//           {service.images && service.images.length > 0 ? (
//             <img
//               src={service.images[0]}
//               alt={service.title}
//               className="w-full h-48 object-cover"
//             />
//           ) : (
//             <div className="h-48 bg-gradient-to-br from-custom-yellow/20 to-orange-500/20 flex items-center justify-center">
//               <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center">
//                 <span className="text-black text-2xl font-bold">{service.title?.[0] || 'S'}</span>
//               </div>
//             </div>
//           )}
//           <button className="absolute top-4 right-4 p-2 glass-card rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
//             <Heart className="w-5 h-5 text-custom-yellow" />
//           </button>
//           <div className="absolute bottom-4 left-4 px-3 py-1 bg-custom-yellow/20 backdrop-blur-sm rounded-lg">
//             <span className="text-custom-yellow text-sm font-medium">{service.category || service.group}</span>
//           </div>
//         </div>
        
//         <div className="p-6">
//           <div className="flex items-start justify-between mb-3">
//             <div>
//               <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-custom-yellow transition-colors">
//                 {service.title}
//               </h3>
//               <p className="text-gray-400 text-sm">
//                 {service.providerId?.name || service.provider || 'Service Provider'}
//               </p>
//             </div>
//             <div className="text-right">
//               <div className="text-2xl font-bold gradient-text">${price}</div>
//               <div className="text-xs text-gray-400">per session</div>
//             </div>
//           </div>
          
//           <p className="text-gray-400 text-sm mb-4 line-clamp-2">
//             {service.description}
//           </p>
          
//           <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
//             <div className="flex items-center space-x-4">
//               {service.rating > 0 && (
//                 <div className="flex items-center space-x-1">
//                   <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                   <span>{service.rating.toFixed(1)}</span>
//                   <span>({service.reviews?.length || service.reviews || 0})</span>
//                 </div>
//               )}
//               <div className="flex items-center space-x-1">
//                 <MapPin className="w-4 h-4" />
//                 <span className="truncate max-w-20">
//                   {service.location?.split(',')[1] || service.location}
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex justify-end">
//             <Button size="sm">
//               Book Now
//             </Button>
//           </div>
//         </div>
//       </Card>
//     )
//   }

//   return (
//     <div className="min-h-screen">
//       <section className="py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl lg:text-5xl font-bold text-custom-yellow mb-4">
//               Browse Services
//             </h1>
//             <p className="text-xl text-gray-300">
//               Find the perfect service provider for your needs
//             </p>
//           </div>

//           {/* Search and Filters */}
//           <div className="glass-card p-6 mb-8">
//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
//               <div className="lg:col-span-2">
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <Input
//                     placeholder="Search services, providers, or keywords..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-12"
//                   />
//                 </div>
//               </div>
              
//               <Select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 options={categories}
//               />
              
//               <Select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 options={sortOptions}
//               />
//             </div>

//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-center space-x-4">
//                 <Select
//                   value={selectedPriceRange}
//                   onChange={(e) => setSelectedPriceRange(e.target.value)}
//                   options={priceRanges}
//                   className="w-48"
//                 />
                
//                 <Button variant="outline" size="sm">
//                   <Filter className="w-4 h-4 mr-2" />
//                   More Filters
//                 </Button>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant={viewMode === 'grid' ? 'primary' : 'ghost'}
//                   size="sm"
//                   onClick={() => setViewMode('grid')}
//                 >
//                   <Grid className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant={viewMode === 'list' ? 'primary' : 'ghost'}
//                   size="sm"
//                   onClick={() => setViewMode('list')}
//                 >
//                   <List className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-20">
//               <Loader2 className="w-12 h-12 text-custom-yellow animate-spin mb-4" />
//               <p className="text-gray-400">Loading services...</p>
//             </div>
//           )}

//           {/* Error State */}
//           {!loading && error && (
//             <div className="text-center py-12">
//               <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                 <span className="text-red-400 text-3xl">!</span>
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-2">
//                 Something went wrong
//               </h3>
//               <p className="text-gray-400 mb-6">{error}</p>
//               <Button onClick={fetchServices}>
//                 Try Again
//               </Button>
//             </div>
//           )}

//           {/* Results */}
//           {!loading && !error && (
//             <>
//               <div className="flex items-center justify-between mb-6">
//                 <p className="text-gray-400">
//                   Showing <span className="text-white font-medium">{filteredServices.length}</span> services
//                 </p>
//                 <div className="flex items-center space-x-2 text-sm text-gray-400">
//                   <span>Sort by:</span>
//                   <Select
//                     value={sortBy}
//                     onChange={(e) => setSortBy(e.target.value)}
//                     options={sortOptions}
//                     className="w-40"
//                   />
//                 </div>
//               </div>

//               {filteredServices.length > 0 ? (
//                 <div className={`grid gap-6 ${
//                   viewMode === 'grid' 
//                     ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
//                     : 'grid-cols-1'
//                 }`}>
//                   {filteredServices.map((service, index) => (
//                     <motion.div
//                       key={service._id || service.id || `service-${index}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <ServiceCard service={service} />
//                     </motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 bg-gradient-to-r from-custom-yellow to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <Search className="w-10 h-10 text-black" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-white mb-2">
//                     No services found
//                   </h3>
//                   <p className="text-gray-400 mb-6">
//                     Try adjusting your search criteria or filters
//                   </p>
//                   <Button onClick={() => {
//                     setSearchTerm('')
//                     setSelectedCategory('all')
//                     setSelectedPriceRange('all')
//                   }}>
//                     Clear Filters
//                   </Button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }

// export default BrowseServicesPage



// import React, { useState, useEffect, useCallback } from 'react'
// import { Link } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { 
//   Search, Home, Sparkles, Monitor, Car, GraduationCap, Briefcase, User,
//   ArrowRight, Loader2
// } from 'lucide-react'
// import Button from '../../components/ui/Button'
// import Card from '../../components/ui/Card'
// import Input from '../../components/ui/Input'

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// // Groups (main categories) - these match your DB "group" field
// const groups = [
//   { 
//     id: 'home', 
//     label: 'Home Services', 
//     description: 'Cleaning, plumbing, repairs & more',
//     icon: Home,
//     gradient: 'from-blue-500/20 to-cyan-500/20',
//     iconColor: 'text-blue-400'
//   },
//   { 
//     id: 'personal', 
//     label: 'Personal Care', 
//     description: 'Caretakers, assistants & personal help',
//     icon: User,
//     gradient: 'from-pink-500/20 to-rose-500/20',
//     iconColor: 'text-pink-400'
//   },
//   { 
//     id: 'beauty', 
//     label: 'Beauty & Wellness', 
//     description: 'Salon, spa, fitness & personal care',
//     icon: Sparkles,
//     gradient: 'from-fuchsia-500/20 to-pink-500/20',
//     iconColor: 'text-fuchsia-400'
//   },
//   { 
//     id: 'tech', 
//     label: 'Tech Support', 
//     description: 'Web dev, IT support, repairs',
//     icon: Monitor,
//     gradient: 'from-violet-500/20 to-purple-500/20',
//     iconColor: 'text-violet-400'
//   },
//   { 
//     id: 'automotive', 
//     label: 'Automotive', 
//     description: 'Car wash, detailing, repairs',
//     icon: Car,
//     gradient: 'from-orange-500/20 to-red-500/20',
//     iconColor: 'text-orange-400'
//   },
//   { 
//     id: 'education', 
//     label: 'Education', 
//     description: 'Tutoring, coaching, training',
//     icon: GraduationCap,
//     gradient: 'from-green-500/20 to-emerald-500/20',
//     iconColor: 'text-green-400'
//   },
//   { 
//     id: 'business', 
//     label: 'Business Services', 
//     description: 'Consulting, marketing, accounting',
//     icon: Briefcase,
//     gradient: 'from-amber-500/20 to-yellow-500/20',
//     iconColor: 'text-amber-400'
//   },
// ]

// const BrowseServicesPage = () => {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [serviceCounts, setServiceCounts] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   // Fetch service count for each group
//   const fetchGroupCounts = useCallback(async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const counts = {}

//       await Promise.all(
//         groups.map(async (group) => {
//           try {
//             // Use "group" field to filter, not "category"
//             const response = await fetch(
//               `${API_BASE_URL}/services?group=${group.id}&isApproved=true&limit=1`
//             )
//             if (response.ok) {
//               const data = await response.json()
//               const total = data.total || data.services?.length || data.length || 0
//               counts[group.id] = total
//             } else {
//               counts[group.id] = 0
//             }
//           } catch {
//             counts[group.id] = 0
//           }
//         })
//       )

//       setServiceCounts(counts)
//     } catch (err) {
//       setError('Failed to load category data')
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     fetchGroupCounts()
//   }, [fetchGroupCounts])

//   // Filter groups by search
//   const filteredGroups = groups.filter(g =>
//     g.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     g.description.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen">
//       <section className="py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-4xl lg:text-5xl font-bold text-custom-yellow mb-4">
//               Explore Services
//             </h1>
//             <p className="text-xl text-gray-300 max-w-2xl mx-auto">
//               Browse service categories and find the perfect provider for your needs
//             </p>
//           </div>

//           {/* Search Bar */}
//           <div className="max-w-2xl mx-auto mb-12">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <Input
//                 placeholder="Search categories..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-12 py-6 text-lg"
//               />
//             </div>
//           </div>

//           {/* Loading State */}
//           {loading && (
//             <div className="flex flex-col items-center justify-center py-20">
//               <Loader2 className="w-12 h-12 text-custom-yellow animate-spin mb-4" />
//               <p className="text-gray-400">Loading categories...</p>
//             </div>
//           )}

//           {/* Error State */}
//           {!loading && error && (
//             <div className="text-center py-12">
//               <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
//               <p className="text-gray-400 mb-6">{error}</p>
//               <Button onClick={fetchGroupCounts}>Try Again</Button>
//             </div>
//           )}

//           {/* Groups Grid */}
//           {!loading && !error && (
//             <>
//               {filteredGroups.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredGroups.map((group, index) => {
//                     const IconComponent = group.icon
//                     const count = serviceCounts[group.id] || 0

//                     return (
//                       <motion.div
//                         key={group.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                       >
//                         <Link to={`/services/${group.id}`}>
//                           <Card 
//                             className="p-8 h-full group cursor-pointer hover:scale-[1.02] transition-all duration-300"
//                             hover
//                           >
//                             <div className="flex flex-col items-center text-center">
//                               {/* Icon */}
//                               <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
//                                 <IconComponent className={`w-10 h-10 ${group.iconColor}`} />
//                               </div>

//                               {/* Title */}
//                               <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-custom-yellow transition-colors">
//                                 {group.label}
//                               </h3>

//                               {/* Description */}
//                               <p className="text-gray-400 mb-4">
//                                 {group.description}
//                               </p>

//                               {/* Service Count */}
//                               <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
//                                 <span className="text-custom-yellow font-semibold">{count}</span>
//                                 <span>service{count !== 1 ? 's' : ''} available</span>
//                               </div>

//                               {/* CTA */}
//                               <div className="flex items-center gap-2 text-custom-yellow text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
//                                 <span>Explore</span>
//                                 <ArrowRight className="w-4 h-4" />
//                               </div>
//                             </div>
//                           </Card>
//                         </Link>
//                       </motion.div>
//                     )
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-white mb-2">
//                     No categories found
//                   </h3>
//                   <p className="text-gray-400">
//                     Try a different search term
//                   </p>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>
//     </div>
//   )
// }

// export default BrowseServicesPage