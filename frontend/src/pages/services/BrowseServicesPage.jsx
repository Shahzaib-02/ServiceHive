
// import React, { useEffect, useMemo, useState } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'

// import { motion } from 'framer-motion'
// import { ArrowRight, Search, Filter, MapPin, Star, Clock, ChevronDown } from 'lucide-react'
// import Button from '../../components/ui/Button'
// import Card from '../../components/ui/Card'
// import { useServices } from '../../hooks/useServices'
// import { serviceGroups, serviceCategories, normalizeCatalogValue, categoriesInGroup } from '../../data/catalog'


// import {  Sparkles, Zap, ChevronRight } from 'lucide-react';

// const ServiceCard = ({ grp }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;
//     setMousePosition({ x, y });
//   };
// }


// // Add flip card styles
// // const flipCardStyles = `
// //   .perspective-[1200px] {
// //     perspective: 1200px;
// //   }

// //   .transform-style-preserve-3d {
// //     transform-style: preserve-3d;
// //   }

// //   .backface-hidden {
// //     backface-visibility: hidden;
// //   }

// //   .rotate-y-180 {
// //     transform: rotateY(180deg);
// //   }

// //   .group-hover\:rotate-y-180:hover {
// //     transform: rotateY(180deg);
// //   }
// // `

// const BrowseServicesPage = () => {
//   const { services, isLoading, fetchServices, filters } = useServices()
//   const navigate = useNavigate()
//   const [category, setCategory] = useState(filters.category || '')
//   const [group, setGroup] = useState(filters.group || '')
//   const [search, setSearch] = useState(filters.search || '')
//   const location = useLocation()

//   useEffect(() => {
//     const params = new URLSearchParams(location.search)
//     const nextGroup = params.get('group') || ''
//     const nextCategory = params.get('category') || ''
//     const nextSearch = params.get('q') || ''
//     setGroup(nextGroup)
//     setCategory(nextCategory)
//     setSearch(nextSearch)
//     fetchServices({ search: nextSearch, category: nextCategory, group: nextGroup })
//   }, [location.search])

//   // Inject flip card styles
//   useEffect(() => {
//     const styleId = 'flip-card-styles'
//     let styleElement = document.getElementById(styleId)

//     if (!styleElement) {
//       styleElement = document.createElement('style')
//       styleElement.id = styleId
//       styleElement.textContent = flipCardStyles
//       document.head.appendChild(styleElement)
//     }

//     return () => {
//       if (styleElement && styleElement.parentNode) {
//         styleElement.parentNode.removeChild(styleElement)
//       }
//     }
//   }, [])

//   const liveListings = useMemo(
//     () => services.filter((s) => s.isApproved !== false),
//     [services],
//   )

//   const groupKey = String(group || '').toLowerCase()
//   const categoryKey = String(category || '').toLowerCase()
//   const searchTrim = search.trim()
//   const showSubcategoryHub = Boolean(groupKey && !categoryKey && !searchTrim)

//   const liveInGroup = useMemo(() => {
//     if (!groupKey) {
//       return liveListings
//     }
//     return liveListings.filter((s) => String(s.group || '').toLowerCase() === groupKey)
//   }, [liveListings, groupKey])

//   const subcategoriesWithProviders = useMemo(() => {
//     if (!groupKey) {
//       return []
//     }
//     const slugNorm = (slug) => normalizeCatalogValue(slug)
//     const present = new Set(liveInGroup.map((s) => slugNorm(s.slug)))
//     return categoriesInGroup(groupKey).filter((c) => present.has(slugNorm(c.id)))
//   }, [groupKey, liveInGroup])

//   const listingRows = useMemo(() => {
//     if (showSubcategoryHub) {
//       return []
//     }
//     let rows = liveListings

//     if (groupKey) {
//       rows = rows.filter((s) => String(s.group || '').toLowerCase() === groupKey)
//     }
//     if (categoryKey) {
//       rows = rows.filter((s) => String(s.category || '').toLowerCase() === categoryKey)
//     }
//     if (searchTrim) {
//       const q = searchTrim.toLowerCase()
//       rows = rows.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
//     }
//     return rows
//   }, [liveListings, groupKey, categoryKey, searchTrim, showSubcategoryHub])

//   // Filter serviceGroups based on selection
//   const filteredGroups = useMemo(() => {
//     let groups = [...serviceGroups]
//     if (groupKey) {
//       groups = groups.filter(g => String(g.id).toLowerCase() === groupKey)
//     }
//     return groups
//   }, [groupKey])

//   const handleSearch = (e) => {
//     const q = e.target.value
//     setSearch(q)
//     const params = new URLSearchParams(location.search)
//     if (q) {
//       params.set('q', q)
//     } else {
//       params.delete('q')
//     }
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true })
//   }

//   const handleGroupChange = (g) => {
//     setGroup(g)
//     setCategory('')
//     const params = new URLSearchParams()
//     if (g) params.set('group', g)
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true })
//   }

//   const handleCategoryChange = (c) => {
//     setCategory(c)
//     const params = new URLSearchParams()
//     if (groupKey) params.set('group', groupKey)
//     if (c) params.set('category', c)
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true })
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-white">Loading services...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <section className="relative lg:py-32 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-custom-yellow/5 via-orange-500/5 to-yellow-500/5" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-70px]">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center"
//           >
//             <h1 className="text-5xl lg:text-7xl font-bold mt-8">
//               <span>Browse <span className='text-yellow-400'>Services</span> </span>
//             </h1>
//             <p className="text-xl text-gray-300 max-w-3xl mx-auto">
//               Find the perfect service provider for your needs
//             </p>

//             {/* Search Bar */}
//             {/* <div className="max-w-2xl mx-auto">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Search for services..."
//                   value={search}
//                   onChange={handleSearch}
//                   className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow/50 focus:bg-white/15 transition-all"
//                 />
//               </div>
//             </div> */}
//           </motion.div>
//         </div>
//       </section>

//       {/* Filters */}
//       <section className="">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-wrap gap-4 items-center">
//             <div className="flex items-center gap-2 text-gray-400">
//               <Filter className="w-4 h-4" />
//               <span>Filters:</span>
//             </div>

//             {/* Group Filter */}
//             <div className="relative">
//               <select
//                 value={group}
//                 onChange={(e) => handleGroupChange(e.target.value)}
//                 className="appearance-none w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-transparent transition-all duration-200 cursor-pointer"
//               >
//                 <option value="" className="bg-black text-gray-400">All Categories</option>
//                 {serviceGroups.map((g) => (
//                   <option key={String(g.id)} value={g.id} className="bg-black text-white">
//                     {String(g.emoji || '')} {String(g.label || '')}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                 <ChevronDown className="w-5 h-5 text-custom-yellow transition-transform duration-300" />
//               </div>
//             </div>

//             {/* Category Filter */}
//             {/* {groupKey && (
//               <div className="relative">
//                 <select
//                   value={category}
//                   onChange={(e) => handleCategoryChange(e.target.value)}
//                   className="appearance-none w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-transparent transition-all duration-200 cursor-pointer"
//                 >
//                   <option value="" className="bg-black text-gray-400">All Subcategories</option>
//                   {categoriesInGroup(groupKey).map((c) => (
//                     <option key={String(c.id)} value={c.id} className="bg-black text-white">
//                       {String(c.label || '')}
//                     </option>
//                   ))}
//                 </select>
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                   <ChevronDown className="w-5 h-5 text-custom-yellow transition-transform duration-300" />
//                 </div>
//               </div>
//             )} */}
//           </div>
//         </div>
//       </section>

//       {/* Service Categories Flip Cards — ALWAYS SHOW, filter by group selection */}
//       {/* <section className="py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//             {filteredGroups.map((grp) => (
//               <div
//                 key={String(grp.id)}
//                 className="group perspective-[1200px] h-80"
//               >
                
//                 <div className="relative w-full h-full transition-transform duration-700 transform-style-preserve-3d hover:rotate-y-180">
              
//                   <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-custom-yellow/20 bg-gradient-to-br from-black/60 via-gray-800/40 to-black/60 backdrop-blur-sm">
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
//                     <img
//                       src={grp.image}
//                       alt={String(grp.label || 'service')}
//                       className="h-full w-full object-cover mix-blend-multiply"
//                     />
//                     <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-gray-900/60 to-transparent p-6">
//                       <h3 className="text-2xl font-bold text-white drop-shadow-lg">
//                         {String(grp.label || '')}
//                       </h3>
//                     </div>
//                   </div>
                 
//                   <div className="absolute inset-0 rotate-y-180 backface-hidden rounded-xl bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-md border border-custom-yellow/30 text-white p-6 flex flex-col justify-end">
//                     <h3 className="text-2xl font-bold mb-2 text-custom-yellow">
//                       {String(grp.label || '')}
//                     </h3>

//                     <span className="text-sm font-semibold mb-3 text-gray-300">
//                       {String(grp.price || '')}
//                     </span>

//                     <p className="text-sm leading-relaxed mb-4 text-gray-400">
//                       {String(grp.description || '')}
//                     </p>

//                     <Link 
//                       to={`/services/${grp.id}`}
//                       className="inline-flex items-center gap-2 font-semibold hover:text-black transition-colors"
//                     >
//                       <button className="bg-black text-white px-8 py-2 rounded-lg flex items-center gap-2">
//                         Explore services
//                         <ArrowRight className="w-4 h-4" />
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section> */}

//       {/* Subcategory Hub */}
//       {showSubcategoryHub && subcategoriesWithProviders.length > 0 && (
//         <section className="py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold text-white mb-8">Explore {String(serviceGroups.find(g => g.id === groupKey)?.label || '')} Services</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {subcategoriesWithProviders.map((cat) => (
//                 <motion.div
//                   key={String(cat.id)}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <Card className="p-6 cursor-pointer hover:border-custom-yellow/50 transition-all"
//                     onClick={() => handleCategoryChange(cat.id)}>
//                     <h3 className="text-xl font-semibold text-white mb-2">{String(cat.label || '')}</h3>
//                     <p className="text-gray-400 mb-4">{String(cat.description || '')}</p>
//                     <div className="flex items-center justify-between">
//                       <span className="text-custom-yellow">
//                         {liveInGroup.filter(s => normalizeCatalogValue(s.slug) === normalizeCatalogValue(cat.id)).length} providers
//                       </span>
//                       <ArrowRight className="w-4 h-4 text-custom-yellow" />
//                     </div>
//                   </Card>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Services Grid */}
//       {/* <section className="py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {listingRows.length === 0 ? (
//             <div className="text-center py-20">
//               <div className="text-gray-400 text-lg">No services found matching your criteria.</div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {listingRows.map((service, index) => (
//                 <motion.div
//                   key={service.id || service._id || `service-${index}`}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                   <Card className="overflow-hidden group">
//                     <div className="relative h-48 overflow-hidden">
//                       <img
//                         src={service.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1920&auto=format&fit=crop'}
//                         alt={service.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
//                       <div className="absolute bottom-4 left-4 right-4">
//                         <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
//                         <div className="flex items-center gap-2 text-sm text-gray-300">
//                           <MapPin className="w-4 h-4" />
//                           <span>{service.location || 'Bahawalpur'}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="p-6">
//                       <p className="text-gray-400 mb-4 line-clamp-2">{service.description}</p>

//                       <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-1">
//                           <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                           <span className="text-white">{service.rating || '4.5'}</span>
//                         </div>
//                         <div className="text-custom-yellow font-semibold">
//                           {service.price || 'Starting from PKR 500'}
//                         </div>
//                       </div>

//                       <Link to={`/customer/service-details/${service.id}`}>
//                         <Button className="w-full">
//                           View Details
//                           <ArrowRight className="w-4 h-4 ml-2" />
//                         </Button>
//                       </Link>
//                     </div>
//                   </Card>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section> */}
//         <div
//       className="group h-[420px] w-full cursor-pointer"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => {
//         setIsHovered(false);
//         setMousePosition({ x: 0.5, y: 0.5 });
//       }}
//       onMouseMove={handleMouseMove}
//     >
//       <div
//         className={`
//           relative w-full h-full transition-all duration-500 ease-out
//           ${isHovered ? 'scale-[1.02]' : 'scale-100'}
//         `}
//         style={{
//           transform: isHovered
//             ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg)`
//             : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
//           transformStyle: 'preserve-3d',
//         }}
//       >
//         {/* Floating particles effect */}
//         <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className={`
//                 absolute w-1 h-1 rounded-full bg-custom-yellow/60
//                 transition-all duration-1000 ease-in-out
//                 ${isHovered ? 'opacity-100' : 'opacity-0'}
//               `}
//               style={{
//                 left: `${20 + i * 15}%`,
//                 top: `${10 + (i % 3) * 30}%`,
//                 transform: isHovered
//                   ? `translateY(-${20 + i * 10}px) scale(${1 + i * 0.5})`
//                   : 'translateY(0) scale(0)',
//                 transitionDelay: `${i * 100}ms`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Glow effect */}
//         <div
//           className={`
//             absolute -inset-1 rounded-2xl bg-gradient-to-r from-custom-yellow/20 via-amber-500/20 to-yellow-500/20
//             blur-xl transition-opacity duration-500
//             ${isHovered ? 'opacity-100' : 'opacity-0'}
//           `}
//         />

//         {/* Main card container */}
//         <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-gray-900/90 backdrop-blur-sm">

//           {/* FRONT SIDE */}
//           <div
//             className={`
//               absolute inset-0 transition-all duration-700 ease-in-out
//               ${isHovered ? 'opacity-0 scale-95 rotate-y-180' : 'opacity-100 scale-100 rotate-y-0'}
//             `}
//             style={{ backfaceVisibility: 'hidden' }}
//           >
//             {/* Image with overlay */}
//             <div className="absolute inset-0">
//               <img
//                 src={grp.image}
//                 alt={String(grp.label || 'service')}
//                 className="h-full w-full object-cover transition-transform duration-700"
//                 style={{
//                   transform: isHovered ? 'scale(1.1)' : 'scale(1)',
//                 }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
//               <div className="absolute inset-0 bg-gradient-to-br from-custom-yellow/10 to-transparent" />
//             </div>

//             {/* Content */}
//             <div className="absolute inset-0 flex flex-col justify-end p-6">
//               {/* Category badge */}
//               <div className="mb-3">
//                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-custom-yellow/20 text-custom-yellow text-xs font-medium border border-custom-yellow/30">
//                   <Zap className="w-3 h-3" />
//                   Premium Service
//                 </span>
//               </div>

//               <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
//                 {String(grp.label || '')}
//               </h3>

//               <div className="flex items-center gap-2 text-gray-400 text-sm">
//                 <Star className="w-4 h-4 text-custom-yellow fill-custom-yellow" />
//                 <span>4.9 (2.4k reviews)</span>
//               </div>

//               {/* Hover hint */}
//               <div
//                 className={`
//                   mt-4 flex items-center gap-2 text-custom-yellow text-sm font-medium
//                   transition-all duration-300
//                   ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
//                 `}
//               >
//                 <Sparkles className="w-4 h-4" />
//                 Hover to explore
//               </div>
//             </div>

//             {/* Corner accent */}
//             <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-custom-yellow/40 rounded-tr-lg" />
//           </div>

//           {/* BACK SIDE */}
//           <div
//             className={`
//               absolute inset-0 transition-all duration-700 ease-in-out
//               ${isHovered ? 'opacity-100 scale-100 rotate-y-0' : 'opacity-0 scale-95 rotate-y-180'}
//             `}
//             style={{ backfaceVisibility: 'hidden' }}
//           >
//             {/* Background pattern */}
//             <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//               <div className="absolute inset-0 opacity-5"
//                 style={{
//                   backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
//                   backgroundSize: '20px 20px',
//                 }}
//               />
//             </div>

//             {/* Animated border */}
//             <div className="absolute inset-0 rounded-2xl overflow-hidden">
//               <div
//                 className="absolute inset-0 rounded-2xl"
//                 style={{
//                   background: 'conic-gradient(from 0deg, transparent, custom-yellow, transparent 30%)',
//                   animation: isHovered ? 'spin 4s linear infinite' : 'none',
//                 }}
//               />
//               <div className="absolute inset-[1px] rounded-2xl bg-gray-900" />
//             </div>

//             <div className="relative h-full flex flex-col p-6">
//               {/* Header */}
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-white mb-1">
//                     {String(grp.label || '')}
//                   </h3>
//                   <div className="flex items-center gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="w-3 h-3 text-custom-yellow fill-custom-yellow" />
//                     ))}
//                     <span className="text-xs text-gray-500 ml-1">(2.4k)</span>
//                   </div>
//                 </div>
//                 <div className="w-10 h-10 rounded-full bg-custom-yellow/10 flex items-center justify-center">
//                   <Sparkles className="w-5 h-5 text-custom-yellow" />
//                 </div>
//               </div>

//               {/* Price */}
//               <div className="mb-4">
//                 <span className="text-3xl font-bold text-custom-yellow">
//                   {String(grp.price || '')}
//                 </span>
//                 <span className="text-gray-500 text-sm ml-1">/service</span>
//               </div>

//               {/* Description */}
//               <p className="text-sm leading-relaxed text-gray-400 mb-6 flex-grow">
//                 {String(grp.description || '')}
//               </p>

//               {/* Features list */}
//               <div className="space-y-2 mb-6">
//                 {['Verified Professionals', '24/7 Support', 'Satisfaction Guaranteed'].map((feature, i) => (
//                   <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
//                     <div className="w-1.5 h-1.5 rounded-full bg-custom-yellow" />
//                     {feature}
//                   </div>
//                 ))}
//               </div>

//               {/* CTA Button */}
//               <Link to={`/services/${grp.id}`} className="block">
//                 <button className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-custom-yellow to-amber-500 text-black font-bold py-3 px-6 transition-all duration-300 hover:shadow-lg hover:shadow-custom-yellow/25">
//                   <span className="relative z-10 flex items-center justify-center gap-2">
//                     Explore Services
//                     <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
//                   </span>
//                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CSS for 3D transforms */}
//       <style jsx>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//     </div>
//   )
// }

// export default BrowseServicesPage


// import React, { useEffect, useMemo, useState } from 'react'
// import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { ArrowRight, Search, Filter, MapPin, Star, Clock, ChevronDown, Sparkles, Zap, ChevronRight } from 'lucide-react'
// import Button from '../../components/ui/Button'
// import Card from '../../components/ui/Card'
// import { useServices } from '../../hooks/useServices'
// import { serviceGroups, serviceCategories, normalizeCatalogValue, categoriesInGroup } from '../../data/catalog'

// // ─── 3D Tilt Flip Card Component ───────────────────────────────
// const ServiceCard = ({ grp }) => {
//   const [isHovered, setIsHovered] = useState(false)
//   const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect()
//     const x = (e.clientX - rect.left) / rect.width
//     const y = (e.clientY - rect.top) / rect.height
//     setMousePosition({ x, y })
//   }

//   return (
//     <div
//       className="group h-[350px] w-full cursor-pointer"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => {
//         setIsHovered(false)
//         setMousePosition({ x: 0.5, y: 0.5 })
//       }}
//       onMouseMove={handleMouseMove}
//     >
//       <div
//         className={`
//           relative w-full h-full transition-all duration-500 ease-out
//           ${isHovered ? 'scale-[1.02]' : 'scale-100'}
//         `}
//         style={{
//           transform: isHovered
//             ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg)`
//             : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
//           transformStyle: 'preserve-3d',
//         }}
//       >
//         {/* Floating particles */}
//         <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-20">
//           {[...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className={`
//                 absolute w-1.5 h-1.5 rounded-full bg-yellow-400/70
//                 transition-all duration-1000 ease-in-out
//                 ${isHovered ? 'opacity-100' : 'opacity-0'}
//               `}
//               style={{
//                 left: `${15 + i * 14}%`,
//                 top: `${60 + (i % 3) * 25}%`,
//                 transform: isHovered
//                   ? `translateY(-${30 + i * 15}px) scale(${1 + i * 0.3})`
//                   : 'translateY(0) scale(0)',
//                 transitionDelay: `${i * 120}ms`,
//               }}
//             />
//           ))}
//         </div>

//         {/* Glow aura */}
//         <div
//           className={`
//             absolute -inset-2 rounded-3xl bg-gradient-to-r from-yellow-400/30 via-amber-500/20 to-yellow-500/30
//             blur-2xl transition-opacity duration-500 -z-10
//             ${isHovered ? 'opacity-100' : 'opacity-0'}
//           `}
//         />

//         {/* Main card */}
//         <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-gray-900/95 backdrop-blur-sm shadow-2xl">

//           {/* ═══════ FRONT SIDE ═══════ */}
//           <div
//             className={`
//               absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
//               ${isHovered ? 'opacity-0 scale-90 rotate-y-180' : 'opacity-100 scale-100 rotate-y-0'}
//             `}
//             style={{ backfaceVisibility: 'hidden' }}
//           >
//             {/* Image layer */}
//             <div className="absolute inset-0">
//               <img
//                 src={grp.image}
//                 alt={String(grp.label || 'service')}
//                 className="h-full w-full object-cover transition-transform duration-700"
//                 style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
//               <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent mix-blend-overlay" />
//             </div>

//             {/* Top-right corner bracket */}
//             <div className="absolute top-5 right-5 w-10 h-10">
//               <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-yellow-400 to-transparent" />
//               <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-yellow-400 to-transparent" />
//             </div>

//             {/* Bottom content */}
//             <div className="absolute inset-0 flex flex-col justify-end p-5">
//               <div className="mb-2">
//                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/15 text-yellow-400 text-xs font-semibold border border-yellow-400/25 backdrop-blur-sm">
//                   <Zap className="w-3 h-3" />
//                   Premium
//                 </span>
//               </div>

//               <h3 className="text-xl font-bold text-white mb-1.5 drop-shadow-lg tracking-tight">
//                 {String(grp.label || '')}
//               </h3>

//               <div className="flex items-center gap-2 text-gray-400 text-sm">
//                 <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
//                 <span className="text-gray-300">4.9</span>
//                 <span className="text-gray-500">(2.4k reviews)</span>
//               </div>
//             </div>
//           </div>

//           {/* ═══════ BACK SIDE ═══════ */}
//           <div
//             className={`
//               absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
//               ${isHovered ? 'opacity-100 scale-100 rotate-y-0' : 'opacity-0 scale-90 -rotate-y-180'}
//             `}
//             style={{ backfaceVisibility: 'hidden' }}
//           >
//             {/* Background */}
//             <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
//               <div className="absolute inset-0 opacity-[0.03]"
//                 style={{
//                   backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
//                   backgroundSize: '24px 24px',
//                 }}
//               />
//             </div>

//             {/* Animated rotating border */}
//             <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
//               <div
//                 className="absolute -inset-[100%] rounded-2xl"
//                 style={{
//                   background: 'conic-gradient(from 0deg, transparent, rgba(250,204,21,0.4), transparent 25%, transparent, rgba(250,204,21,0.4), transparent 75%)',
//                   animation: isHovered ? 'spin 3s linear infinite' : 'none',
//                 }}
//               />
//               <div className="absolute inset-[1px] rounded-2xl bg-gray-950" />
//             </div>

//             {/* Content */}
//             <div className="relative h-full flex flex-col p-5 z-10">
//               {/* Header */}
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h3 className="text-lg font-bold text-white mb-1">
//                     {String(grp.label || '')}
//                   </h3>
//                   <div className="flex items-center gap-0.5">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
//                     ))}
//                     <span className="text-xs text-gray-500 ml-1">(2.4k)</span>
//                   </div>
//                 </div>
//                 <div className="w-9 h-9 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
//                   <Sparkles className="w-4 h-4 text-yellow-400" />
//                 </div>
//               </div>

//               {/* Price */}
//               <div className="mb-3">
//                 <span className="text-2xl font-bold text-yellow-400">
//                   {String(grp.price || '')}
//                 </span>
//                 <span className="text-gray-500 text-sm ml-1">/service</span>
//               </div>

//               {/* Description */}
//               <p className="text-sm leading-relaxed text-gray-400 mb-4 flex-grow line-clamp-3">
//                 {String(grp.description || '')}
//               </p>

//               {/* Features */}
//               <div className="space-y-2 mb-4">
//                 {['Verified Professionals', '24/7 Support', 'Satisfaction Guaranteed'].map((feature, i) => (
//                   <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
//                     <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm shadow-yellow-400/30" />
//                     {feature}
//                   </div>
//                 ))}
//               </div>

//               {/* CTA */}
//               <Link to={`/services/${grp.id}`} className="block mt-auto">
//                 <button className="w-full group/btn relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-black font-bold py-3 px-5 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-[1.02] active:scale-[0.98]">
//                   <span className="relative z-10 flex items-center justify-center gap-2">
//                     Explore Services
//                     <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
//                   </span>
//                   {/* Shine effect */}
//                   <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Main Page Component ───────────────────────────────────────
// const BrowseServicesPage = () => {
//   const { services, isLoading, fetchServices, filters } = useServices()
//   const navigate = useNavigate()
//   const [category, setCategory] = useState(filters.category || '')
//   const [group, setGroup] = useState(filters.group || '')
//   const [search, setSearch] = useState(filters.search || '')
//   const location = useLocation()

//   useEffect(() => {
//     const params = new URLSearchParams(location.search)
//     const nextGroup = params.get('group') || ''
//     const nextCategory = params.get('category') || ''
//     const nextSearch = params.get('q') || ''
//     setGroup(nextGroup)
//     setCategory(nextCategory)
//     setSearch(nextSearch)
//     fetchServices({ search: nextSearch, category: nextCategory, group: nextGroup })
//   }, [location.search])

//   const liveListings = useMemo(
//     () => services.filter((s) => s.isApproved !== false),
//     [services],
//   )

//   const groupKey = String(group || '').toLowerCase()
//   const categoryKey = String(category || '').toLowerCase()
//   const searchTrim = search.trim()
//   const showSubcategoryHub = Boolean(groupKey && !categoryKey && !searchTrim)

//   const liveInGroup = useMemo(() => {
//     if (!groupKey) return liveListings
//     return liveListings.filter((s) => String(s.group || '').toLowerCase() === groupKey)
//   }, [liveListings, groupKey])

//   const subcategoriesWithProviders = useMemo(() => {
//     if (!groupKey) return []
//     const slugNorm = (slug) => normalizeCatalogValue(slug)
//     const present = new Set(liveInGroup.map((s) => slugNorm(s.slug)))
//     return categoriesInGroup(groupKey).filter((c) => present.has(slugNorm(c.id)))
//   }, [groupKey, liveInGroup])

//   const listingRows = useMemo(() => {
//     if (showSubcategoryHub) return []
//     let rows = liveListings
//     if (groupKey) rows = rows.filter((s) => String(s.group || '').toLowerCase() === groupKey)
//     if (categoryKey) rows = rows.filter((s) => String(s.category || '').toLowerCase() === categoryKey)
//     if (searchTrim) {
//       const q = searchTrim.toLowerCase()
//       rows = rows.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
//     }
//     return rows
//   }, [liveListings, groupKey, categoryKey, searchTrim, showSubcategoryHub])

//   const filteredGroups = useMemo(() => {
//     let groups = [...serviceGroups]
//     if (groupKey) groups = groups.filter(g => String(g.id).toLowerCase() === groupKey)
//     return groups
//   }, [groupKey])

//   const handleSearch = (e) => {
//     const q = e.target.value
//     setSearch(q)
//     const params = new URLSearchParams(location.search)
//     if (q) params.set('q', q)
//     else params.delete('q')
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true })
//   }

//   const handleGroupChange = (g) => {
//     setGroup(g)
//     setCategory('')
//     const params = new URLSearchParams()
//     if (g) params.set('group', g)
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true })
//   }

//   const handleCategoryChange = (c) => {
//     setCategory(c)
//     const params = new URLSearchParams()
//     if (groupKey) params.set('group', groupKey)
//     if (c) params.set('category', c)
//     navigate(`${location.pathname}?${params.toString()}`, { replace: true })
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-white">Loading services...</div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen">
//       {/* Header */}
//       <section className="relative lg:py-24  mt-5 pb-8 overflow-hidden">
      
//         <div className="absolute inset-0 bg-gradient-to-br from-custom-yellow/5 via-orange-500/5 to-yellow-500/5" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-70px]">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center"
//           >
//             <h1 className="text-5xl lg:text-5xl font-bold mt-8">
//               <span>Browse <span className='text-yellow-400'>Services</span></span>
//             </h1>
//             <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
//               Find the perfect service provider for your needs
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Filters */}
//       <section className="">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
//           <div className="flex flex-wrap gap-4 items-center justify-end">
//             <div className="flex items-center gap-2 text-gray-400">
//               <Filter className="w-4 h-4" />
//               <span>Filters:</span>
//             </div>
//             <div className="relative">
//               <select
//                 value={group}
//                 onChange={(e) => handleGroupChange(e.target.value)}
//                 className="appearance-none w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-transparent transition-all duration-200 cursor-pointer"
//               >
//                 <option value="" className="bg-black text-gray-400">All Categories</option>
//                 {serviceGroups.map((g) => (
//                   <option key={String(g.id)} value={g.id} className="bg-black text-white">
//                     {String(g.emoji || '')} {String(g.label || '')}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
//                 <ChevronDown className="w-5 h-5 text-custom-yellow transition-transform duration-300" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ═══════ 3D FLIP CARDS GRID ═══════ */}
//       <section className="pt-8 pb-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//             {filteredGroups.map((grp) => (
//               <ServiceCard key={String(grp.id)} grp={grp} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Subcategory Hub */}
//       {showSubcategoryHub && subcategoriesWithProviders.length > 0 && (
//         <section className="py-12">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <h2 className="text-3xl font-bold text-white mb-8">Explore {String(serviceGroups.find(g => g.id === groupKey)?.label || '')} Services</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {subcategoriesWithProviders.map((cat) => (
//                 <motion.div
//                   key={String(cat.id)}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   <Card className="p-6 cursor-pointer hover:border-custom-yellow/50 transition-all"
//                     onClick={() => handleCategoryChange(cat.id)}>
//                     <h3 className="text-xl font-semibold text-white mb-2">{String(cat.label || '')}</h3>
//                     <p className="text-gray-400 mb-4">{String(cat.description || '')}</p>
//                     <div className="flex items-center justify-between">
//                       <span className="text-custom-yellow">
//                         {liveInGroup.filter(s => normalizeCatalogValue(s.slug) === normalizeCatalogValue(cat.id)).length} providers
//                       </span>
//                       <ArrowRight className="w-4 h-4 text-custom-yellow" />
//                     </div>
//                   </Card>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }

// export default BrowseServicesPage










import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Filter, MapPin, Star, Clock, ChevronDown, Sparkles, Zap, ChevronRight } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useServices } from '../../hooks/useServices'
import { serviceGroups, serviceCategories, normalizeCatalogValue, categoriesInGroup } from '../../data/catalog'
import { getCategoryImage } from '../../utils/serviceImages'

const countServiceReviews = (service) => {
  if (Array.isArray(service.reviews)) return service.reviews.length
  const parsed = Number(service.reviews)
  return Number.isFinite(parsed) ? parsed : 0
}

const buildGroupRatingStats = (listings) => {
  const stats = {}

  serviceGroups.forEach((grp) => {
    const groupId = String(grp.id).toLowerCase()
    const inGroup = listings.filter(
      (service) => String(service.group || '').toLowerCase() === groupId
    )

    if (inGroup.length === 0) {
      stats[groupId] = { rating: 0, reviews: 0 }
      return
    }

    const ratedServices = inGroup
      .map((service) => Number(service.rating) || 0)
      .filter((value) => value > 0)

    stats[groupId] = {
      rating: ratedServices.length
        ? ratedServices.reduce((sum, value) => sum + value, 0) / ratedServices.length
        : 0,
      reviews: inGroup.reduce((sum, service) => sum + countServiceReviews(service), 0),
    }
  })

  return stats
}

// ─── 3D Tilt Flip Card Component ───────────────────────────────
const ServiceCard = ({ grp, ratingStats }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const categoryImage = getCategoryImage(grp.id)
  const [imageSrc, setImageSrc] = useState(categoryImage || grp.image || '')

  const rating = ratingStats?.rating ?? 0
  const reviews = ratingStats?.reviews ?? 0
  const hasRatings = rating > 0 || reviews > 0

  useEffect(() => {
    setImageSrc(categoryImage || grp.image || '')
  }, [categoryImage, grp.id, grp.image])

  const handleImageError = () => {
    setImageSrc((current) => {
      if (grp.image && current !== grp.image) return grp.image
      return ''
    })
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }

  return (
    <div
      className="group h-[350px] w-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0.5, y: 0.5 })
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`
          relative w-full h-full transition-all duration-500 ease-out
          ${isHovered ? 'scale-[1.02]' : 'scale-100'}
        `}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1.5 h-1.5 rounded-full bg-yellow-400/70
                transition-all duration-1000 ease-in-out
                ${isHovered ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                left: `${15 + i * 14}%`,
                top: `${60 + (i % 3) * 25}%`,
                transform: isHovered
                  ? `translateY(-${30 + i * 15}px) scale(${1 + i * 0.3})`
                  : 'translateY(0) scale(0)',
                transitionDelay: `${i * 120}ms`,
              }}
            />
          ))}
        </div>

        {/* Glow aura */}
        <div
          className={`
            absolute -inset-2 rounded-3xl bg-gradient-to-r from-yellow-400/30 via-amber-500/20 to-yellow-500/30
            blur-2xl transition-opacity duration-500 -z-10
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Main card */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-gray-900/95 backdrop-blur-sm shadow-2xl">

          {/* ═══════ FRONT SIDE ═══════ */}
          <div
            className={`
              absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isHovered ? 'opacity-0 scale-90 rotate-y-180' : 'opacity-100 scale-100 rotate-y-0'}
            `}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Image layer */}
            <div className="absolute inset-0">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={String(grp.label || 'service')}
                  className="h-full w-full object-cover transition-transform duration-700"
                  style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
                  onError={handleImageError}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent mix-blend-overlay" />
            </div>

            {/* Top-right corner bracket */}
            <div className="absolute top-5 right-5 w-10 h-10">
              <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-yellow-400 to-transparent" />
              <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-yellow-400 to-transparent" />
            </div>

            {/* Bottom content */}
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-400/15 text-yellow-400 text-xs font-semibold border border-yellow-400/25 backdrop-blur-sm">
                  <Zap className="w-3 h-3" />
                  Premium
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1.5 drop-shadow-lg tracking-tight">
                {String(grp.label || '')}
              </h3>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {hasRatings ? (
                  <>
                    <span className="text-gray-300">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
                    <span className="text-gray-500">({reviews.toLocaleString()} reviews)</span>
                  </>
                ) : (
                  <span className="text-gray-500">No ratings yet</span>
                )}
              </div>
            </div>
          </div>

          {/* ═══════ BACK SIDE ═══════ */}
          <div
            className={`
              absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isHovered ? 'opacity-100 scale-100 rotate-y-0' : 'opacity-0 scale-90 -rotate-y-180'}
            `}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            {/* Animated rotating border */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div
                className="absolute -inset-[100%] rounded-2xl"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(250,204,21,0.4), transparent 25%, transparent, rgba(250,204,21,0.4), transparent 75%)',
                  animation: isHovered ? 'spin 3s linear infinite' : 'none',
                }}
              />
              <div className="absolute inset-[1px] rounded-2xl bg-gray-950" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col p-5 z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {String(grp.label || '')}
                  </h3>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${hasRatings && i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      {hasRatings ? `(${reviews.toLocaleString()})` : 'No ratings yet'}
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
              </div>

              {/* Price */}
              <div className="mb-3">
                <span className="text-2xl font-bold text-yellow-400">
                  {String(grp.price || '')}
                </span>
                <span className="text-gray-500 text-sm ml-1">/service</span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-400 mb-4 flex-grow line-clamp-3">
                {String(grp.description || '')}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {['Verified Professionals', '24/7 Support', 'Satisfaction Guaranteed'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-sm shadow-yellow-400/30" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link to={`/services/${grp.id}`} className="block mt-auto">
                <button className="w-full group/btn relative overflow-hidden rounded-lg bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 text-black font-bold py-3 px-5 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30 hover:scale-[1.02] active:scale-[0.98]">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Explore Services
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page Component ───────────────────────────────────────
const BrowseServicesPage = () => {
  const { services, isLoading, fetchServices, filters } = useServices()
  const navigate = useNavigate()
  const [category, setCategory] = useState(filters.category || '')
  const [group, setGroup] = useState(filters.group || '')
  const [search, setSearch] = useState(filters.search || '')
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const nextGroup = params.get('group') || ''
    const nextCategory = params.get('category') || ''
    const nextSearch = params.get('q') || ''
    setGroup(nextGroup)
    setCategory(nextCategory)
    setSearch(nextSearch)
    fetchServices({
      search: nextSearch,
      category: nextCategory,
      group: nextGroup,
      isApproved: 'true',
    })
  }, [location.search, fetchServices])

  const liveListings = useMemo(
    () => services.filter((s) => s.isApproved !== false),
    [services],
  )

  const groupKey = String(group || '').toLowerCase()
  const categoryKey = String(category || '').toLowerCase()
  const searchTrim = search.trim()
  const showSubcategoryHub = Boolean(groupKey && !categoryKey && !searchTrim)

  const liveInGroup = useMemo(() => {
    if (!groupKey) return liveListings
    return liveListings.filter((s) => String(s.group || '').toLowerCase() === groupKey)
  }, [liveListings, groupKey])

  const subcategoriesWithProviders = useMemo(() => {
    if (!groupKey) return []
    const slugNorm = (slug) => normalizeCatalogValue(slug)
    const present = new Set(liveInGroup.map((s) => slugNorm(s.slug)))
    return categoriesInGroup(groupKey).filter((c) => present.has(slugNorm(c.id)))
  }, [groupKey, liveInGroup])

  const listingRows = useMemo(() => {
    if (showSubcategoryHub) return []
    let rows = liveListings
    if (groupKey) rows = rows.filter((s) => String(s.group || '').toLowerCase() === groupKey)
    if (categoryKey) rows = rows.filter((s) => String(s.category || '').toLowerCase() === categoryKey)
    if (searchTrim) {
      const q = searchTrim.toLowerCase()
      rows = rows.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
    }
    return rows
  }, [liveListings, groupKey, categoryKey, searchTrim, showSubcategoryHub])

  const filteredGroups = useMemo(() => {
    let groups = [...serviceGroups]
    if (groupKey) groups = groups.filter(g => String(g.id).toLowerCase() === groupKey)
    return groups
  }, [groupKey])

  const groupRatingStats = useMemo(
    () => buildGroupRatingStats(liveListings),
    [liveListings],
  )

  const handleSearch = (e) => {
    const q = e.target.value
    setSearch(q)
    const params = new URLSearchParams(location.search)
    if (q) params.set('q', q)
    else params.delete('q')
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  const handleGroupChange = (g) => {
    setGroup(g)
    setCategory('')
    const params = new URLSearchParams()
    if (g) params.set('group', g)
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  const handleCategoryChange = (c) => {
    setCategory(c)
    const params = new URLSearchParams()
    if (groupKey) params.set('group', groupKey)
    if (c) params.set('category', c)
    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading services...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative lg:py-24 mt-5 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-custom-yellow/5 via-orange-500/5 to-yellow-500/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-70px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-5xl font-bold mt-8">
              <span>Browse <span className='text-yellow-400'>Services</span></span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
              Find the perfect service provider for your needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-end">
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
            </div>
            <div className="relative">
              <select
                value={group}
                onChange={(e) => handleGroupChange(e.target.value)}
                className="appearance-none w-full px-4 py-3 glass-card border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:border-transparent transition-all duration-200 cursor-pointer"
              >
                <option value="" className="bg-black text-gray-400">All Categories</option>
                {serviceGroups.map((g) => (
                  <option key={String(g.id)} value={g.id} className="bg-black text-white">
                    {String(g.emoji || '')} {String(g.label || '')}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-custom-yellow transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 3D FLIP CARDS GRID ═══════ */}
      <section className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredGroups.map((grp) => (
              <ServiceCard
                key={String(grp.id)}
                grp={grp}
                ratingStats={groupRatingStats[String(grp.id).toLowerCase()]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Subcategory Hub */}
      {showSubcategoryHub && subcategoriesWithProviders.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Explore {String(serviceGroups.find(g => g.id === groupKey)?.label || '')} Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategoriesWithProviders.map((cat) => (
                <motion.div
                  key={String(cat.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 cursor-pointer hover:border-custom-yellow/50 transition-all"
                    onClick={() => handleCategoryChange(cat.id)}>
                    <h3 className="text-xl font-semibold text-white mb-2">{String(cat.label || '')}</h3>
                    <p className="text-gray-400 mb-4">{String(cat.description || '')}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-custom-yellow">
                        {liveInGroup.filter(s => normalizeCatalogValue(s.slug) === normalizeCatalogValue(cat.id)).length} providers
                      </span>
                      <ArrowRight className="w-4 h-4 text-custom-yellow" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default BrowseServicesPage