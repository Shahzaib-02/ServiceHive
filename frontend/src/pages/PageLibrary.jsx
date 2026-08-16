import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import LandingPage from './public/LandingPage'
import ServiceSubcategoryPage from './public/ServiceSubcategoryPage'
import ProviderServiceManagementPage from './provider/ProviderServiceManagementPage'
import ManageUsersPage from './admin/ManageUsersPage'

import BookingChatDrawer from '../components/chat/BookingChatDrawer'
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Ban,
  Bell,
  Calendar,
  Camera,
  Car,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Crown,
  Banknote,
  Download,
  Edit,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Globe,
  Grid,
  Heart,
  Home,
  Info,
  Layout,
  LifeBuoy,
  Link as LinkIcon,
  List,
  Loader,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MoreVertical,
  Package,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Trash2,
  Truck,
  User,
  UserCheck,
  Users,
  Wallet,
  Watch,
  Wrench,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import DashboardProfileEditor from '../components/ui/DashboardProfileEditor'
import FileUploadField from '../components/forms/FileUploadField'
import MultiImageUploadField from '../components/forms/MultiImageUploadField'
import GoogleLiveTrackingMap from '../components/maps/GoogleLiveTrackingMap'
import GoogleLocationMap from '../components/maps/GoogleLocationMap'
import { useGeolocation } from '../hooks/useGeolocation'
import StripeCheckoutPanel from '../components/payments/StripeCheckoutPanel'
import ChatPanel from '../components/realtime/ChatPanel'
import { useAuth } from '../hooks/useAuth'
import { useBookings } from '../hooks/useBookings'
import { useRealtime } from '../hooks/useRealtime'
import { useServices } from '../hooks/useServices'
import { 
  fetchAdminOverviewRequest, 
  fetchAdminUsersRequest, 
  updateAdminUserRequest, 
  deleteAdminUserRequest,
  createAdminUserRequest,
  updateAdminServiceRequest,
  deleteAdminServiceRequest,
} from '../services/api/adminApi'
import {
  fetchServicesRequest, 
  fetchServiceByIdRequest, 
  updateServiceRequest,
  deleteServiceRequest,
  createServiceRequest
} from '../services/api/servicesApi'
import {
  fetchReviewsRequest,
  createReviewRequest,
} from '../services/api/reviewsApi'
import { 
  fetchBookingsRequest, 
  updateBookingRequest
} from '../services/api/bookingsApi'
import { 
  fetchPaymentsRequest
} from '../services/api/paymentsApi'
import { formatMoney, buildAuthHeaders } from '../utils/format'
import { sumProviderEarnings, ADMIN_COMMISSION_RATE } from '../utils/earnings'
import {
  serviceGroups,
  serviceCategories,
  normalizeCatalogValue,
  serviceMap,
  categoriesInGroup,
  landingCtaBackdropImage,
} from '../data/catalog'
import {
  BOOKING_STATUS,
  customerCanChat,
  customerCanReviewBooking,
  customerCanTrack,
  labelForBookingStatus,
} from '../utils/bookingStatus'

const paymentRows = [
  { client: 'Corporate Office Care', amount: 'PKR 8,400', status: 'Settled', date: 'Apr 01' },
  { client: 'Residential Bundle', amount: 'PKR 3,920', status: 'In review', date: 'Mar 30' },
  { client: 'Fleet Maintenance', amount: 'PKR 12,250', status: 'Processing', date: 'Mar 28' },
]

const transitionUp = {
  hidden: { opacity: 0, y: 20 },
  show: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: index * 0.08, ease: 'easeOut' },
  })
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const roleLandingPath = {
  customer: '/customer/dashboard',
  provider: '/provider/dashboard',
  admin: '/admin/dashboard',
}

const isComponentType = (value) => (
  typeof value === 'function'
  || (typeof value === 'object' && value !== null && '$$typeof' in value)
)

const resolveServiceCategory = (service = {}) => {
  const candidateValues = [
    service.id,
    service.slug,
    service.category,
    service.categoryLabel,
    service.title,
  ]
    .map(normalizeCatalogValue)
    .filter(Boolean)

  return serviceCategories.find((catalogItem) => {
    const catalogValues = [
      catalogItem.id,
      catalogItem.slug,
      catalogItem.title,
    ]
      .map(normalizeCatalogValue)
      .filter(Boolean)

    return candidateValues.some((candidateValue) => catalogValues.includes(candidateValue))
  })
}

const enrichServicePresentation = (service = {}) => {
  const categoryMatch = resolveServiceCategory(service)
  const gallery = Array.isArray(service.images) && service.images.length ? service.images : null
  const primary = (gallery && gallery[0]) || service.image

  return {
    ...categoryMatch,
    ...service,
    icon: isComponentType(service.icon) ? service.icon : categoryMatch?.icon || Package,
    image: primary || categoryMatch?.image || serviceCategories[0].image,
    title: service.title || categoryMatch?.title || 'Service',
    description: service.description || categoryMatch?.description || 'Professional support tailored to your request.',
    eta: service.eta || categoryMatch?.eta || 'Flexible scheduling',
    price: service.price || categoryMatch?.price,
  }
}

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

const getServiceByParam = (id, services = []) => {
  const resolvedService = services.find((service) => service.id === id || service.slug === id)

  if (resolvedService) {
    return enrichServicePresentation(resolvedService)
  }

  const directMatch = serviceCategories.find((service) => service.id === id)

  if (directMatch) {
    return enrichServicePresentation(directMatch)
  }

  const index = Number.parseInt(id || '1', 10)
  return enrichServicePresentation(serviceCategories[(Number.isNaN(index) ? 0 : index - 1 + serviceCategories.length) % serviceCategories.length])
}

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Could not read image file.'))
    reader.readAsDataURL(file)
  })

const formatStatus = (value) => String(value || 'pending').replace(/_/g, ' ')

const bookingBadge = (status) => labelForBookingStatus(status)

const PageSection = ({ eyebrow, title, description, actions, aside, children, compact = false }) => (
  <section className="space-y-8 relative">
    <div className="hero-grid items-start relative z-10">
      <motion.div
        variants={transitionUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="space-y-5"
      >
        {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
        <div className="space-y-3">
          <h1 className={`font-['Space_Grotesk'] font-bold leading-tight text-white ${compact ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}>
            {title}
          </h1>
          <p className={`max-w-2xl text-slate-300 ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </motion.div>
      {aside ? aside : null}
    </div>
    {children}
  </section>
)

const SectionHeader = ({ eyebrow, title, description }) => (
  <div className="space-y-3">
    {eyebrow ? <span className="section-eyebrow">{eyebrow}</span> : null}
    <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white">{title}</h2>
    {description ? <p className="max-w-3xl text-slate-300">{description}</p> : null}
  </div>
)

const StatGrid = ({ items }) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="show"
    className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
  >
    {items.map((item, index) => {
      const Icon = item.icon || Package
      return (
        <motion.div key={String(item.label || index)} variants={transitionUp} custom={index}>
          <Card className="hover-lift h-full rounded-[1.75rem] p-5" hover={false}>
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-3">
                <Icon className="h-5 w-5 text-custom-yellow" />
              </div>
              <span className="badge-chip">{String(item.note || 'Live metric')}</span>
            </div>
            <p className="text-3xl font-bold text-white">{String(item.value || '—')}</p>
            <p className="mt-2 text-sm text-slate-400">{String(item.label || '—')}</p>
          </Card>
        </motion.div>
      )
    })}
  </motion.div>
)

const ImageGrid = ({ items, compact = false, actionLabel = 'Explore' }) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="show"
    className={`grid gap-5 ${compact ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2 xl:grid-cols-3'}`}
  >
    {items.map((item, index) => {
      const service = enrichServicePresentation(item)
      const Icon = service.icon
      return (
        <motion.div key={String(service.id || service.title || service.name || index)} variants={transitionUp} custom={index}>
          <Card className="hover-lift overflow-hidden p-0" hover={false}>
            <div className="relative h-56 overflow-hidden">
              <img src={service.image} alt={String(service.title || 'service')} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
              <div className="image-mask" />
              <div className="absolute left-5 top-5 rounded-2xl border border-white/10 bg-slate-950/60 p-3 backdrop-blur">
                <Icon className="h-5 w-5 text-custom-yellow" />
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{String(service.title || '—')}</h3>
                    <p className="mt-2 text-sm text-slate-200/80">{String(service.description || '—')}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white">
                    {String(service.price || service.metric || actionLabel || '—')}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="badge-chip">{String(service.eta || 'Instant booking')}</span>
                <span className="badge-chip">{String(service.tag || 'Verified pros')}</span>
              </div>
              <Link to={service.href || '/browse-services'} className="text-sm font-semibold text-custom-yellow">
                {actionLabel}
              </Link>
            </div>
          </Card>
        </motion.div>
      )
    })}
  </motion.div>
)

const ListPanel = ({ title, description, items, tone = 'default' }) => {
  const toneClass = tone === 'success'
    ? 'from-emerald-400/20 to-transparent'
    : tone === 'alert'
      ? 'from-amber-400/20 to-transparent'
      : 'from-custom-yellow/20 to-transparent'

  return (
    <Card className="h-full bg-transparent  overflow-hidden p-0  border-0 shadow-none m-0 space-y-4" hover={false}>
      <div className={`bg-gradient-to-r ${toneClass} px-6 py-5`}>
        <h3 className="text-xl font-semibold text-yellow-500">{title}</h3>
        <p className="mt-2 text-sm text-slate-300">{description}</p>
      </div>
      <div className="space-y-4 p-6">
        {items.map((item) => (
          <div key={item.id || String(item.title || item.name || item.zone || 'item')} className="rounded-3xl bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-base font-semibold text-white">{String(item.title || item.name || item.zone || '—')}</p>
                <p className="mt-1 text-sm text-slate-400">{String(item.subtitle || item.provider || item.specialty || item.active || '—')}</p>
                {item.meta ? <p className="mt-3 text-sm text-slate-300">{String(item.meta || '—')}</p> : null}
                {item.location ? <p className="mt-3 text-sm text-slate-300">{String(item.location || '—')}</p> : null}
                {item.price ? <p className="mt-3 text-sm font-semibold text-cyan-200">{String(item.price || '—')}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-chip">{String(item.status || item.date || item.health || '—')}</span>
                {item.onDelete && (
                  <button
                    onClick={item.onDelete}
                    className="rounded-2xl border border-rose-400/40 bg-transparent px-3 py-2 text-rose-400 transition-all hover:bg-rose-500 hover:text-slate-950"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

const TimelinePanel = ({ title, steps }) => (
  <Card className="h-full" hover={false}>
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">Every milestone is animated and synced with the service lifecycle.</p>
      </div>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={String(step.title || index)} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${step.active ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white'}`}>
                {index + 1}
              </div>
              {index !== steps.length - 1 ? <div className="mt-2 h-full w-px bg-white/10" /> : null}
            </div>
            <div className="pb-5">
              <p className="text-base font-semibold text-white">{String(step.title || '—')}</p>
              <p className="mt-1 text-sm text-slate-400">{String(step.description || '—')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Card>
)

const AuthShell = ({ title, description, highlights, form }) => (
  <div className="grid min-h-[calc(100vh-10rem)] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="surface-card-strong relative overflow-hidden px-8 py-10 sm:px-10"
    >
      <div className="absolute -left-12 top-0 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-0 top-24 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="relative space-y-8">
        <span className="section-eyebrow">Modern service experience</span>
        <div className="space-y-4">
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white sm:text-5xl">{title}</h1>
          <p className="max-w-xl text-lg text-slate-300">{description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => {
            const Icon = item.icon
            return (
              <div key={String(item.title || index)} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 inline-flex rounded-2xl border border-white/10 bg-white/10 p-3">
                  <Icon className="h-5 w-5 text-custom-yellow" />
                </div>
                <p className="text-base font-semibold text-white">{String(item.title || '—')}</p>
                <p className="mt-2 text-sm text-slate-400">{String(item.description || '—')}</p>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="surface-card-strong p-8 sm:p-10"
    >
      {form}
    </motion.div>
  </div>
)

const DashboardHighlights = ({ title, items }) => (
  <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
    <ListPanel title={title} description="Designed to feel like a professional operating cockpit across roles." items={items} />
    <TimelinePanel
      title="Service journey"
      steps={[
        { title: 'Request created', description: 'Search, compare, and confirm a provider in a few steps.', active: true },
        { title: 'Smart dispatch', description: 'Providers receive geo-aware jobs with ETA updates.', active: true },
        { title: 'Completion and review', description: 'Payments, ratings, and follow-up support stay in one flow.', active: false },
      ]}
    />
  </div>
)

                                            
      
    
  
                                                                                                                                                                                                          
                              
      
                                                                                                        
                    
                                                                                                                                                            const CustomerProfileSettings = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(getProfileInitialValues(user))

  useEffect(() => {
    setProfile(getProfileInitialValues(user))
  }, [user])

  const handleSave = async (values) => {
    const updatedUser = await updateProfile({
      name: values.fullName,
      phone: values.phone,
      city: values.city,
      profileImageDataUrl: values.photo,
    })
    setProfile(getProfileInitialValues(updatedUser))
  }

  return (
    <DashboardProfileEditor
      initialValues={profile}
      onSave={handleSave}
      workspaceBadge="Customer"
      title="Your account"
      description="Set your name, phone, city, and profile photo. Everything here is saved to your account and shows across this customer workspace whenever you sign in."
      nameFieldLabel="Full name"
      submitButtonLabel="Save changes"
      tips={[
        'Use a clear face or logo so providers recognize you on bookings.',
        'Keep phone and city updated for service visits and notifications.',
      ]}
    />
  )
}


const EditServicePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    basePrice: '',
    availability: '',
    location: '',
    description: '',
    group: serviceGroups[0]?.id || 'home',
    category: '',
  })
  const [existingUrls, setExistingUrls] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [imageError, setImageError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceMeta, setServiceMeta] = useState(null)
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationSearch, setLocationSearch] = useState('')

  const subcategoryOptions = useMemo(
    () => categoriesInGroup(formData.group).map((c) => ({ value: c.id, label: c.title })),
    [formData.group],
  )

  // Dynamic Bahawalpur locations extracted from map components
  const bahawalpurLocationPatterns = [
    'university chowk', 'mohajor colony', 'unichowk', 'riaz colony',
    'model town', 'satellite town', 'muslim town', 'islamabad colony',
    'shah shams colony', 'baghdad colony', 'dha bahawalpur', 'railway colony',
    'jinnah colony', 'iqbal colony', 'sadiq colony', 'bilal colony',
    'abu bakar colony', 'usman colony', 'ali colony', 'rehman colony',
    'shah nawaz colony', 'nawab colony', 'zafar colony', 'punjab colony',
    'bela colony', 'gulshan colony', 'gulberg colony', 'gulzar colony',
    'zahoor colony', 'hashmi colony', 'quaid e azam town', 'circular road',
    'abbott road', 'airport road', 'multan road', 'ahmedpur road',
    'bahawalpur cantonment', 'noor mahal', 'farid town', 'new sadiqabad',
    'rajpura', 'shah abdul latif town', 'sheikh colony', 'ubaidullah colony',
    'ahmedpur west', 'islamia university', 'medical colony', 'university area',
    'ahmedpur east', 'ahmedpur sharif', 'hasilpur', 'haroonabad',
    'chishtian', 'fort abbas', 'minchinabad', 'liaquatpur',
    'dunyapur', 'kalurkot', 'khawaja ghulam', 'qasim bela',
    'mansa', 'bhawana', 'noorpur', 'tandlianwala', 'chechawatni',
    'mochh', 'uch sharif', 'dera nawab', 'buchiana', 'kotla arab khan',
    'makhdoompur', 'mauza mian khan', 'mauza ghanian', 'sheikhupur',
    'samanabad', 'dhodiala', 'yazman', 'sadiqabad'
  ]

  const generateBahawalpurLocations = () => {
    return bahawalpurLocationPatterns.map((pattern, index) => {
      const name = pattern.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ')
      
      let type = 'area'
      if (pattern.includes('colony')) type = 'colony'
      else if (pattern.includes('town')) type = 'town'
      else if (pattern.includes('university') || pattern.includes('medical')) type = 'area'
      else if (pattern.includes('road') || pattern.includes('chowk')) type = 'area'
      
      const baseLat = 29.3943
      const baseLng = 71.6837
      const latOffset = (Math.random() - 0.5) * 0.2
      const lngOffset = (Math.random() - 0.5) * 0.2
      
      return {
        id: `location-${index}`,
        name: name,
        type: type,
        lat: baseLat + latOffset,
        lng: baseLng + lngOffset
      }
    })
  }

  const bahawalpurLocations = generateBahawalpurLocations()

  const filteredLocations = bahawalpurLocations.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase())
  )

  // FIX: Helper to safely compare ObjectId vs string
  const idsMatch = (id1, id2) => {
    const str1 = typeof id1 === 'object' && id1 !== null 
      ? String(id1._id || id1.id || id1) 
      : String(id1 || '')
    const str2 = typeof id2 === 'object' && id2 !== null 
      ? String(id2._id || id2.id || id2) 
      : String(id2 || '')
    return str1 === str2 && str1 !== '' && str1 !== 'undefined'
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError('')
    
    if (!id || id === 'undefined') {
      setLoadError('Invalid service ID')
      setLoading(false)
      return
    }
    
    fetchServiceByIdRequest(id)
      .then((svc) => {
        if (cancelled) return
        
        // FIX: Use idsMatch helper to compare ObjectId vs string
        const currentUserId = user?.id || user?._id
        if (currentUserId && svc.providerId && !idsMatch(svc.providerId, currentUserId)) {
          setLoadError('This listing does not belong to your account.')
          setLoading(false)
          return
        }
        
        setServiceMeta(svc)
        const bySlug = serviceCategories.find((c) => c.id === svc.slug)
        const byLabel = !bySlug && svc.category
          ? serviceCategories.find((c) => c.title === svc.category)
          : null
        const cat = bySlug || byLabel
        const groupId = cat?.group || svc.group || serviceGroups[0]?.id || 'home'
        const subs = categoriesInGroup(groupId)
        const subId = cat?.id ?? subs.find((s) => s.id === svc.slug)?.id ?? subs[0]?.id ?? ''
        setFormData({
          title: svc.title || '',
          basePrice: String(svc.basePrice ?? ''),
          eta: svc.eta || '',
          description: svc.description || '',
          group: groupId,
          category: subId,
        })
        const imgs = Array.isArray(svc.images) && svc.images.length ? svc.images : svc.image ? [svc.image] : []
        setExistingUrls(imgs)
        setNewFiles([])
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError('Could not load this service.')
          setLoading(false)
        }
      })
      
    return () => { cancelled = true }
  }, [id, user?.id, user?._id])

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'group') {
      const nextSubs = categoriesInGroup(value)
      setFormData((current) => ({
        ...current,
        group: value,
        category: nextSubs[0]?.id || '',
      }))
      return
    }
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const removeExistingAt = (index) => {
    setExistingUrls((current) => current.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setImageError('')
    const newUrls = await Promise.all(newFiles.map((f) => readFileAsDataUrl(f)))
    const combined = [...existingUrls, ...newUrls]
    if (combined.length < 2 || combined.length > 5) {
      setImageError('Keep between 2 and 5 images total (existing + new uploads).')
      return
    }
    if (!formData.category) {
      setSubmitError('Choose a subcategory for your service.')
      return
    }
    setIsSubmitting(true)
    try {
      const categoryDetails = serviceCategories.find((c) => c.id === formData.category)
      await updateServiceRequest(id, {
        title: formData.title,
        description: formData.description,
        price: Number(formData.basePrice),
        duration: formData.eta,
        images: combined,
        slug: formData.category,
        group: formData.group,
        category: categoryDetails?.title || formData.category,
        availability: formData.availability,
        location: formData.location,
      }, buildAuthHeaders(token, user))
      navigate('/provider/manage-services')
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this service permanently?')) {
      return
    }
    try {
      await deleteServiceRequest(id, buildAuthHeaders(token, user))
      navigate('/provider/manage-services')
    } catch (error) {
      setSubmitError(error.message)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-10">
        <Card className="p-8 text-center text-slate-300" hover={false}>Loading service…</Card>
      </div>
    )
  }

  if (loadError || !serviceMeta) {
    return (
      <div className="space-y-6 px-4 py-10">
        <Card className="p-8 text-center text-rose-300" hover={false}>{loadError || 'Not found.'}</Card>
        <Link to="/provider/manage-services"><Button variant="secondary">Back to services</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Edit service"
        title={formData.title || 'Edit listing'}
        description="Change group and subcategory, update text, keep 2–5 photos total, or delete the listing."
      />
      <Card className="p-8" hover={false}>
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <Input name="title" label="Service title" value={formData.title} onChange={handleChange} required />
          <Select
            name="group"
            label="Service group"
            value={formData.group}
            onChange={handleChange}
            options={serviceGroups.map((g) => ({ value: g.id, label: `${g.emoji} ${g.label}` }))}
            required
          />
          <Select
            name="category"
            label="Subcategory"
            value={formData.category}
            onChange={handleChange}
            options={subcategoryOptions.length ? subcategoryOptions : [{ value: '', label: 'Select group first' }]}
            required
          />
          <Input name="basePrice" label="Starting price" value={formData.basePrice} onChange={handleChange} required />
          <Input name="availability" label="Availability" placeholder="mon-fri" value={formData.availability} onChange={handleChange} required />
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location (Bahawalpur Only)
            </label>
            <div className="relative">
              <input
                type="text"
                name="location"
                value={formData.location}
                onClick={() => setShowMap(true)}
                placeholder="Select Bahawalpur location..."
                className="w-full pl-10 pr-4 py-3 glass-card border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent cursor-pointer"
                readOnly
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            {showMap && (
              <div className="absolute z-50 w-full mt-2 glass-card border border-white/20 rounded-xl overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">Select Location</h3>
                    <button
                      type="button"
                      onClick={() => setShowMap(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {bahawalpurLocations.map((location) => (
                        <button
                          key={location.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, location: location.name })
                            setSelectedLocation(location)
                            setShowMap(false)
                          }}
                          className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-custom-yellow" />
                            <div>
                              <span className="text-white block">{String(location.name || '—')}</span>
                              <span className="text-xs text-gray-400 capitalize">{String(location.type || '—')}</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 group-hover:text-cyan-400">
                            {location.type === 'area' ? 'Area' : 'Town'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {selectedLocation && (
                    <div className="mt-3 p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-custom-yellow" />
                        <span className="text-white text-sm">{String(selectedLocation.name || '—')}</span>
                        <span className="text-xs text-gray-400 capitalize">({String(selectedLocation.type || '—')})</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="sm:col-span-2 space-y-3">
            <p className="text-sm font-medium text-slate-200">Current images (tap × to remove)</p>
            <div className="flex flex-wrap gap-3">
              {existingUrls.map((url, index) => (
                <div key={`${url.slice(0, 40)}-${index}`} className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/15">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingAt(index)}
                    className="absolute right-1 top-1 rounded-lg bg-black/70 p-1 text-white hover:bg-rose-600/90"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <MultiImageUploadField
              label="Add more photos"
              min={0}
              max={Math.max(0, 5 - existingUrls.length)}
              files={newFiles}
              onChange={setNewFiles}
              hint="New files add to the images above; total must stay between 2 and 5."
            />
            {imageError ? <p className="text-sm text-rose-400">{imageError}</p> : null}
          </div>
          <div className="sm:col-span-2">
            <Input name="description" label="Short summary" value={formData.description} onChange={handleChange} required />
          </div>
          {submitError ? <p className="sm:col-span-2 text-sm text-rose-400">{submitError}</p> : null}
          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : 'Save changes'}</Button>
            <Button variant="outline" type="button" onClick={handleDelete} className="border-rose-500/40 text-rose-200">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete service
            </Button>
            <Link to="/provider/manage-services"><Button variant="secondary" type="button">Cancel</Button></Link>
          </div>
        </form>
      </Card>
    </div>
  )
}











const ManageServicesPage = () => {
  const { user } = useAuth()
  const { services, fetchServices } = useServices()
  
  // Fix: Use String() comparison for ObjectId and check both providerId and providerIdStr
  const ownServices = services.filter((service) => 
    String(service.providerId) === String(user?.id) || 
    String(service.providerIdStr) === String(user?.id)
  )
  
  // Restrict to one service per provider (regardless of approval status)
  const hasAnyService = ownServices.length > 0
  const canAddListing = !hasAnyService

  useEffect(() => {
    // Force refresh services when component mounts
    fetchServices({ search: '', category: '', group: '' })
  }, [fetchServices, user?.id]) // Add user?.id to refetch when user changes

  // Debug logging to help troubleshoot
  console.log('🔍 Debug - All services:', services)
  console.log('🔍 Debug - User ID:', user?.id)
  console.log('🔍 Debug - User ID type:', typeof user?.id)
  console.log('🔍 Debug - Own services:', ownServices)
  console.log('🔍 Debug - Own services count:', ownServices.length)
  console.log('🔍 Debug - Has any service:', hasAnyService)
  console.log('🔍 Debug - Can add listing:', canAddListing)
  
  // Additional debugging for each service
  services.forEach((service, index) => {
    console.log(`🔍 Service ${index}:`, {
      id: service.id,
      providerId: service.providerId,
      providerIdStr: service.providerIdStr,
      providerIdType: typeof service.providerId,
      providerIdStrType: typeof service.providerIdStr,
      isApproved: service.isApproved,
      matches: String(service.providerId) === String(user?.id) || String(service.providerIdStr) === String(user?.id)
    })
  })

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Manage services"
        title="Your listing"
        description="You can publish only one service as a provider. Manage your service listing here - view and edit both pending and approved services. Each service needs 2–5 images."
      />
      {canAddListing ? (
        <div className="flex flex-wrap gap-3">
          <Link to="/provider/add-service"><Button variant='outline'>Add service</Button></Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button disabled className="opacity-100 cursor-not-allowed">
            Service limit reached (1 service max)
          </Button>
        </div>
      )}
      {ownServices.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ownServices.map((item) => {
            const presented = enrichServicePresentation(item)
            const Icon = presented.icon
            return (
              <Card key={item.id} className="overflow-hidden p-0" hover={false}>
                <div className="relative h-48 overflow-hidden">
                  <img src={presented.image} alt="" className="h-full w-full object-cover" />
                  <div className="image-mask" />
                  <div className="absolute left-4 top-4 rounded-2xl border border-white/10 bg-slate-950/60 p-2 backdrop-blur">
                    <Icon key={`icon-${item.id}`} className="h-4 w-4 text-cyan-200" />
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  <div key={`header-${item.id}`} className="flex items-start justify-between gap-2">
                    <h3 key={`title-${item.id}`} className="text-lg font-semibold text-white">{String(presented.title || '—')}</h3>
                    <span key={`status-${item.id}`} className="badge-chip shrink-0">{item.isApproved === false ? 'Pending' : 'Live'}</span>
                  </div>
                  <p key={`desc-${item.id}`} className="text-sm text-slate-400 line-clamp-2">{String(presented.description || '—')}</p>
                  <p key={`price-${item.id}`} className="text-sm text-cyan-200">{String(presented.price || `From $${item.basePrice}` || '—')}</p>
                  <div key={`actions-${item.id}`} className="flex flex-wrap gap-2 pt-2">
                    <Link key={`edit-${item.id}`} to={`/provider/edit-service/${item.id}`}>
                      <Button variant="outline"  size="sm" className="inline-flex items-center gap-1">
                        <Pencil key={`pencil-${item.id}`} className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-10 text-center" hover={false}>
          <p className="text-lg font-medium text-white">No services yet</p>
          <p className="mt-2 text-sm text-slate-400">Publish your first service listing with 2–5 photos to appear here. Note: You can only publish one service as a provider.</p>
          <div className="mt-6">
            <Link to="/provider/add-service"><Button variant='outline'>Add your service</Button></Link>
          </div>
        </Card>
      )}
    </div>
  )
}








const BookingRequestsPage = () => {
  const { bookings, fetchBookings } = useBookings()
  const { user } = useAuth()
  const [busyId, setBusyId] = useState('')
  const [pageError, setPageError] = useState('')

  // Filter by 'pending' status and match providerId
  const pendingRequests = bookings.filter((booking) => {
    const bookingProviderId = typeof booking.providerId === 'object' 
      ? String(booking.providerId?._id || booking.providerId?.id) 
      : String(booking.providerId)
    const currentUserId = String(user?.id || user?._id)

    return booking.status === 'pending' && bookingProviderId === currentUserId
  })

  // FIXED: Use correct PATCH /api/bookings/:id/status endpoint
  const handleStatusChange = async (bookingId, newStatus) => {
    setPageError('')
    setBusyId(bookingId)

    try {
      const storedAuth = localStorage.getItem('service-hive-auth')
      const authData = storedAuth ? JSON.parse(storedAuth) : null
      const token = authData?.token

      if (!token) {
        setPageError('Not authenticated. Please log in again.')
        return
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed: ${response.status}`)
      }

      await fetchBookings()

    } catch (error) {
      setPageError(error.message || 'Failed to update booking status')
      console.error('Status update error:', error)
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Booking requests"
        title="Review your incoming service requests"
        description="Accept or decline new bookings from customers. Accepted bookings will move to your active jobs."
      />

      {pageError ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="alert">
          {pageError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        {pendingRequests.map((request) => (
          <Card key={request._id || request.id} hover={false}>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {request.serviceId?.title || request.serviceTitle || 'Service'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {request.location?.address || request.address || 'No address'}
                  </p>
                </div>
                <span className="badge-chip">{bookingBadge(request.status)}</span>
              </div>
              <p className="text-slate-200">
                {request.bookingDate 
                  ? new Date(request.bookingDate).toLocaleDateString() 
                  : request.scheduledDate || 'N/A'}
                {request.scheduledTime ? ` at ${request.scheduledTime}` : ''}
              </p>
              <p className="text-sm text-cyan-200">
                {formatMoney(request.totalAmount || request.amount || 0)} · paid by customer
              </p>
              <div className="flex gap-3">
                <Button 
                variant='outline'
                  className="flex-1" 
                  disabled={busyId === (request._id || request.id)}
                  onClick={() => handleStatusChange(request._id || request.id, 'accepted')}
                >
                  {busyId === (request._id || request.id) ? 'Processing...' : 'Accept'}
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1" 
                  disabled={busyId === (request._id || request.id)}
                  onClick={() => {
                    if (confirm('Rejecting this booking will initiate a refund to the customer. Continue?')) {
                      handleStatusChange(request._id || request.id, 'rejected')
                    }
                  }}
                >
                  {busyId === (request._id || request.id) ? 'Processing...' : 'Reject'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!pendingRequests.length ? <Card className="p-8 text-center text-slate-300" hover={false}>No pending requests right now.</Card> : null}
    </div>
  )
}










// const ActiveJobsPage = () => {
//   const { bookings, fetchBookings } = useBookings()
//   const { user } = useAuth()
//   const [busyId, setBusyId] = useState('')
//   const [confirmingId, setConfirmingId] = useState('')
//   const [pageError, setPageError] = useState('')

//   // Filter by actual DB status values + provider match
//   const active = bookings.filter((booking) => {
//     const bookingProviderId = typeof booking.providerId === 'object' 
//       ? String(booking.providerId?._id || booking.providerId?.id) 
//       : String(booking.providerId)
//     const currentUserId = String(user?.id || user?._id)

//     return ['accepted', 'in_progress'].includes(booking.status) && bookingProviderId === currentUserId
//   })

//   // Update status (accept -> in_progress, in_progress -> completed)
//   const handleStatusChange = async (bookingId, newStatus) => {
//     setBusyId(bookingId)
//     try {
//       const storedAuth = localStorage.getItem('service-hive-auth')
//       const authData = storedAuth ? JSON.parse(storedAuth) : null
//       const token = authData?.token

//       const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ status: newStatus })
//       })

//       if (!response.ok) throw new Error(`Failed: ${response.status}`)
//       await fetchBookings()
//     } catch (error) {
//       setPageError(error.message)
//       console.error('Status update error:', error)
//     } finally {
//       setBusyId('')
//     }
//   }

//   // NEW: Provider confirms completion (triggers payout when customer also confirms)
//   const handleProviderConfirm = async (bookingId) => {
//     setConfirmingId(bookingId)
//     try {
//       const storedAuth = localStorage.getItem('service-hive-auth')
//       const authData = storedAuth ? JSON.parse(storedAuth) : null
//       const token = authData?.token

//       const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/confirm-complete`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       if (!response.ok) throw new Error(`Failed: ${response.status}`)

//       const result = await response.json()
//       await fetchBookings()

//       if (result.bothConfirmed) {
//         alert('Payment released! You will receive your payout (minus 8% commission) shortly.')
//       } else {
//         alert('Confirmation recorded. Waiting for customer to confirm.')
//       }
//     } catch (error) {
//       setPageError(error.message)
//     } finally {
//       setConfirmingId('')
//     }
//   }

//   return (
//     <div className="space-y-10">
//       <PageSection
//         eyebrow="Active jobs"
//         title="Monitor and prioritize your active jobs"
//         description="Start service when you arrive, then mark complete when the work is done."
//       />

//       {pageError ? (
//         <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
//           {pageError}
//         </div>
//       ) : null}

//       <div className="grid gap-6 xl:grid-cols-2">
//         {active.map((job) => (
//           <Card key={job._id || job.id} hover={false}>
//             <div className="space-y-4">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">
//                     {job.serviceId?.title || job.serviceTitle || 'Service'}
//                   </h3>
//                   <p className="mt-1 text-sm text-slate-400">
//                     {job.location?.address || job.address || 'No address'}
//                   </p>
//                 </div>
//                 <span className="badge-chip">{bookingBadge(job.status)}</span>
//               </div>
//               <p className="text-slate-200">
//                 {job.bookingDate 
//                   ? new Date(job.bookingDate).toLocaleDateString() 
//                   : job.scheduledDate || 'N/A'}
//                 {job.scheduledTime ? ` · ${job.scheduledTime}` : ''}
//               </p>

//               {/* Show payout info if payment released */}
//               {job.paymentStatus === 'released' && (
//                 <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
//                   <p className="text-sm text-emerald-300">
//                     Payout: {formatMoney(job.providerPayout || 0)} (Commission: {formatMoney(job.adminCommission || 0)})
//                   </p>
//                 </div>
//               )}

//               <div className="flex flex-wrap gap-3">
//                 {job.status === 'accepted' ? (
//                   <Button 
//                     disabled={busyId === (job._id || job.id)}
//                     onClick={() => handleStatusChange(job._id || job.id, 'in_progress')}
//                   >
//                     {busyId === (job._id || job.id) ? 'Updating...' : 'Start service'}
//                   </Button>
//                 ) : null}

//                 {job.status === 'in_progress' ? (
//                   <Button 
//                     disabled={busyId === (job._id || job.id)}
//                     onClick={() => handleStatusChange(job._id || job.id, 'completed')}
//                   >
//                     {busyId === (job._id || job.id) ? 'Updating...' : 'Mark complete'}
//                   </Button>
//                 ) : null}

//                 {/* NEW: Confirm completion button (only shows when status is completed but not confirmed) */}
//                 {job.status === 'completed' && !job.providerConfirmed && (
//                   <Button 
//                     variant="secondary"
//                     disabled={confirmingId === (job._id || job.id)}
//                     onClick={() => handleProviderConfirm(job._id || job.id)}
//                   >
//                     {confirmingId === (job._id || job.id) ? 'Confirming...' : 'Confirm completion'}
//                   </Button>
//                 )}

//                 {job.providerConfirmed && (
//                   <span className="text-sm text-emerald-400 flex items-center gap-1">
//                     <CheckCircle className="h-4 w-4" />
//                     You confirmed
//                   </span>
//                 )}
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//       {!active.length ? (
//         <Card className="p-8 text-center text-slate-300" hover={false}>
//           No active jobs. Accept a paid request from Booking requests to begin.
//         </Card>
//       ) : null}
//     </div>
//   )
// }



const ActiveJobsPage = () => {
  const { bookings, fetchBookings } = useBookings()
  const { user } = useAuth()
  const [busyId, setBusyId] = useState('')
  const [confirmingId, setConfirmingId] = useState('')
  const [pageError, setPageError] = useState('')

  // ── Chat drawer state ────────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false)
  const [chatJob, setChatJob] = useState(null)
  const openChat  = (job) => { setChatJob(job); setChatOpen(true) }
  const closeChat = ()    => { setChatOpen(false); setChatJob(null) }
  // ────────────────────────────────────────────────────────────────────────

  // Filter by actual DB status values + provider match
  const active = bookings.filter((booking) => {
    const bookingProviderId = typeof booking.providerId === 'object' 
      ? String(booking.providerId?._id || booking.providerId?.id) 
      : String(booking.providerId)
    const currentUserId = String(user?.id || user?._id)

    return ['accepted', 'in_progress'].includes(booking.status) && bookingProviderId === currentUserId
  })

  // Update status (accepted -> in_progress, in_progress -> completed)
  const handleStatusChange = async (bookingId, newStatus) => {
    setBusyId(bookingId)
    try {
      const storedAuth = localStorage.getItem('service-hive-auth')
      const authData = storedAuth ? JSON.parse(storedAuth) : null
      const token = authData?.token

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error(`Failed: ${response.status}`)
      await fetchBookings()
    } catch (error) {
      setPageError(error.message)
      console.error('Status update error:', error)
    } finally {
      setBusyId('')
    }
  }

  // Provider confirms completion (triggers payout when customer also confirms)
  const handleProviderConfirm = async (bookingId) => {
    setConfirmingId(bookingId)
    try {
      const storedAuth = localStorage.getItem('service-hive-auth')
      const authData = storedAuth ? JSON.parse(storedAuth) : null
      const token = authData?.token

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/confirm-complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`Failed: ${response.status}`)

      const result = await response.json()
      await fetchBookings()

      if (result.bothConfirmed) {
        alert('Payment released! You will receive your payout (minus 8% commission) shortly.')
      } else {
        alert('Confirmation recorded. Waiting for customer to confirm.')
      }
    } catch (error) {
      setPageError(error.message)
    } finally {
      setConfirmingId('')
    }
  }

  return (
    <div className="space-y-10">

      {/* Chat Drawer — slides in from the right when Chat button clicked */}
      <BookingChatDrawer
        bookingId={chatJob ? String(chatJob._id || chatJob.id) : null}
        title={chatJob ? `Chat · ${chatJob.serviceId?.title || chatJob.serviceTitle || 'Service'}` : 'Chat'}
        isOpen={chatOpen}
        onClose={closeChat}
      />

      <PageSection
        eyebrow="Active jobs"
        title="Monitor and prioritize your active jobs"
        description="Start service when you arrive, then mark complete when the work is done."
      />

      {pageError ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {pageError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {active.map((job) => (
          <Card key={job._id || job.id} hover={false}>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {job.serviceId?.title || job.serviceTitle || 'Service'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {job.location?.address || job.address || 'No address'}
                  </p>
                </div>

                {/* Status badge + Chat button side by side */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Chat always available for accepted/in_progress jobs */}
                  <button
                    onClick={() => openChat(job)}
                    className="flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400 hover:bg-cyan-500/25 transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Chat
                  </button>
                  <span className="badge-chip">{bookingBadge(job.status)}</span>
                </div>
              </div>

              <p className="text-slate-200">
                {job.bookingDate 
                  ? new Date(job.bookingDate).toLocaleDateString() 
                  : job.scheduledDate || 'N/A'}
                {job.scheduledTime ? ` · ${job.scheduledTime}` : ''}
              </p>

              {/* Show payout info if payment released */}
              {job.paymentStatus === 'released' && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                  <p className="text-sm text-emerald-300">
                    Payout: {formatMoney(job.providerPayout || 0)} (Commission: {formatMoney(job.adminCommission || 0)})
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {job.status === 'accepted' ? (
                  <Button 
                  variant='outline'
                    disabled={busyId === (job._id || job.id)}
                    onClick={() => handleStatusChange(job._id || job.id, 'in_progress')}
                  >
                    {busyId === (job._id || job.id) ? 'Updating...' : 'Start service'}
                  </Button>
                ) : null}

                {job.status === 'in_progress' ? (
                  <Button 
                  variant='outline'
                    disabled={busyId === (job._id || job.id)}
                    onClick={() => handleStatusChange(job._id || job.id, 'completed')}
                  >
                    {busyId === (job._id || job.id) ? 'Updating...' : 'Mark complete'}
                  </Button>
                ) : null}

                {/* Confirm completion button */}
                {job.status === 'completed' && !job.providerConfirmed && (
                  <Button 
                    variant="secondary"
                    disabled={confirmingId === (job._id || job.id)}
                    onClick={() => handleProviderConfirm(job._id || job.id)}
                  >
                    {confirmingId === (job._id || job.id) ? 'Confirming...' : 'Confirm completion'}
                  </Button>
                )}

                {job.providerConfirmed && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    You confirmed
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!active.length ? (
        <Card className="p-8 text-center text-slate-300" hover={false}>
          No active jobs. Accept a paid request from Booking requests to begin.
        </Card>
      ) : null}
    </div>
  )
}







const EarningsPage = () => {
  const { token, user } = useAuth()
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    totalCommission: 0,
    totalJobs: 0,
    bookings: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user || user.role !== 'provider') {
      setLoading(false)
      return
    }

    const fetchEarnings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/provider/earnings', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setEarnings(data)
        }
      } catch (error) {
        console.error('Error fetching earnings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEarnings()
  }, [token, user])

  const stats = [
    {
      label: 'Total Earnings',
      value: formatMoney(earnings.totalEarnings || 0),
      note: 'Net after 6% commission',
      icon: Banknote
    },
    {
      label: 'Commission Paid',
      value: formatMoney(earnings.totalCommission || 0),
      note: '8% platform fee',
      icon: TrendingUp
    },
    {
      label: 'Completed Jobs',
      value: String(earnings.totalJobs || 0),
      note: 'Successfully delivered',
      icon: CheckCircle
    },
    {
      label: 'Avg per Job',
      value: formatMoney(earnings.totalJobs > 0 ? (earnings.totalEarnings / earnings.totalJobs) : 0),
      note: 'Average net payout',
      icon: Star
    }
  ]

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Earnings"
        title="Your Payouts"
        description="Track your completed jobs, commission deductions, and net earnings."
      />

      <StatGrid items={stats} />

      {/* Commission Breakdown Card */}
      <Card className="p-6" hover={false}>
        <h3 className="text-lg font-semibold text-white mb-4">Commission Structure</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5">
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-sm text-slate-400">Gross Booking</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-2xl font-bold text-amber-400">8%</p>
            <p className="text-sm text-slate-400">Platform Fee</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-2xl font-bold text-emerald-400">92%</p>
            <p className="text-sm text-slate-400">Your Payout</p>
          </div>
        </div>
      </Card>

      {/* Earnings History */}
      <div className="space-y-6">
        <SectionHeader
          eyebrow="History"
          title="Completed Jobs & Payouts"
          description="All your completed services with payout details."
        />

        {loading ? (
          <Card className="p-8 text-center text-slate-300" hover={false}>
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-custom-yellow" />
            Loading earnings...
          </Card>
        ) : earnings.bookings.length === 0 ? (
          <Card className="p-8 text-center text-slate-300" hover={false}>
            <Banknote className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium text-white">No earnings yet</p>
            <p className="mt-2 text-sm text-slate-400">
              Complete jobs and wait for both confirmations to receive payouts.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {earnings.bookings.map((booking) => (
              <Card key={booking._id} hover={false} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">
                      {booking.serviceId?.title || 'Service'}
                    </h3>
                    <p className="text-sm text-slate-400">
                      Completed: {booking.completionDate 
                        ? new Date(booking.completionDate).toLocaleDateString() 
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-slate-400">
                      Released: {booking.releasedAt 
                        ? new Date(booking.releasedAt).toLocaleDateString() 
                        : 'Pending'}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-slate-400">Gross: {formatMoney(booking.totalAmount || 0)}</p>
                    <p className="text-sm text-amber-400">Fee (8%): -{formatMoney(booking.adminCommission || 0)}</p>
                    <p className="text-lg font-bold text-emerald-400">Net: {formatMoney(booking.providerPayout || 0)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
const getProfileInitialValues = (user, defaultName = '') => ({
  fullName: user?.name || defaultName,
  phone: user?.phone || '',
  city: user?.city || '',
  photo: user?.profileImageDataUrl || null,
})

const ProviderProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(getProfileInitialValues(user, 'Service provider'))

  useEffect(() => {
    setProfile(getProfileInitialValues(user, 'Service provider'))
  }, [user])

  const handleSave = async (values) => {
    const updatedUser = await updateProfile({
      name: values.fullName,
      phone: values.phone,
      city: values.city,
      profileImageDataUrl: values.photo,
    })
    setProfile(getProfileInitialValues(updatedUser, 'Service provider'))
  }

  return (
    <DashboardProfileEditor
      initialValues={profile}
      onSave={handleSave}
      workspaceBadge="Service provider"
      title="Provider profile"
      description="Your display name, phone, city, and photo are saved to your account and appear in this workspace after every login. Customers see your professionalism wherever your profile is shown. Your service category is set when you create or edit your listing."
      nameFieldLabel="Display name"
      submitButtonLabel="Save profile"
      tips={[
        'A friendly, well-lit photo helps customers trust your listing.',
        'Service type and pricing are managed under Manage services, not here.',
      ]}
    />
  )
}

const AdminProfileSettings = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(getProfileInitialValues(user, 'servicehive.admin'))

  useEffect(() => {
    setProfile(getProfileInitialValues(user, 'servicehive.admin'))
  }, [user])

  const handleSave = async (values) => {
    const updatedUser = await updateProfile({
      name: values.fullName,
      phone: values.phone,
      city: values.city,
      profileImageDataUrl: values.photo,
    })
    setProfile(getProfileInitialValues(updatedUser, 'servicehive.admin'))
  }

  return (
    <DashboardProfileEditor
      initialValues={profile}
      onSave={handleSave}
      workspaceBadge="Admin"
      title="Admin account"
      description="Update your admin display name, contact fields, and profile photo. Changes are stored on your account and show in the sidebar and header for every admin session."
      nameFieldLabel="Full name"
      submitButtonLabel="Save changes"
      tips={[
        'Your photo helps teammates recognize the signed-in admin in shared environments.',
        'Use a work-appropriate image; it may appear in audit-style views later.',
      ]}
    />
  )
}

const LiveLocationTogglePage = () => (
  <div className="space-y-10">
    <PageSection
      eyebrow="Live location settings"
      title="Manage your live location and visibility"
      description="Control when customers can see your location and optimize your dispatch readiness."
    />
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <ListPanel
        title="Sharing controls"
        description="Surface the most important controls with stronger contrast and spacing."
        items={[
          { title: 'Live visibility', provider: 'Visible to assigned customers only', status: 'Enabled' },
          { title: 'Background updates', provider: 'Refresh every 30 seconds', status: 'Optimized' },
          { title: 'Emergency hide mode', provider: 'Manually disable when off shift', status: 'Ready' },
        ]}
      />
      <TimelinePanel
        title="Location workflow"
        steps={[
          { title: 'Share enabled', description: 'Platform reads provider position for active jobs.', active: true },
          { title: 'Customer notified', description: 'Arrival window updates on the tracking screen.', active: true },
          { title: 'Session completed', description: 'Visibility ends automatically after checkout.', active: false },
        ]}
      />
    </div>
  </div>
)


const adminUserStatusPill = (entry) => {
  if (entry.role === 'admin') {
    return 'border-white/15 bg-white/10 text-slate-100'
  }
  if (entry.isSuspended) {
    return 'border-rose-400/35 bg-rose-500/15 text-rose-100'
  }
  if (entry.isApproved) {
    return 'border-emerald-400/35 bg-emerald-500/12 text-emerald-100'
  }
  if (entry.rejectionReason) {
    return 'border-amber-400/35 bg-amber-500/12 text-amber-100'
  }
  return 'border-cyan-400/25 bg-cyan-500/10 text-cyan-100'
}

const canModerate = (entry) => {
  // Simple moderation check - in real app this would check current user permissions
  return entry.role !== 'admin'
}

const providerNetAmount = (amount) => {
  // Calculate provider net after commission
  return amount * (1 - ADMIN_COMMISSION_RATE)
}

const adminStats = [
  { label: 'Total Payments', value: 'PKR 12,450', note: 'Last 30 days', icon: Banknote },
  { label: 'Pending', value: 'PKR 2,340', note: 'Awaiting settlement', icon: Clock },
  { label: 'Completed', value: 'PKR 10,110', note: 'Successfully processed', icon: CheckCircle },
]

const ApproveProvidersPage = () => {
  const { token, user, bumpDb } = useAuth()
  const [users, setUsers] = useState([])
  const [busyId, setBusyId] = useState('')
  const [pageError, setPageError] = useState('')

  useEffect(() => {
    if (!token || !user) {
      return
    }
    fetchAdminUsersRequest(buildAuthHeaders(token, user)).then(setUsers).catch(() => setUsers([]))
  }, [token, user])

  /** Not approved yet (includes rejected signups so you can approve them again). */
  const needsDecision = (entry) => (
    entry.role !== 'admin'
    && !entry.isSuspended
    && !entry.isApproved
  )

  const pendingAccounts = (Array.isArray(users) ? users : []).filter(needsDecision)

  const handleApprove = async (accountId) => {
    setPageError('')
    setBusyId(accountId)
    try {
      const updatedUser = await updateAdminUserRequest(accountId, { isApproved: true }, buildAuthHeaders(token, user))
      setUsers((current) => (Array.isArray(current) ? current : []).map((entry) => (entry.id === accountId ? updatedUser : entry)))
      bumpDb()
    } catch (e) {
      setPageError(e.message || 'Approve failed.')
    } finally {
      setBusyId('')
    }
  }

  const handleReject = async (accountId) => {
    const reason = window.prompt('Rejection reason (shown to the user):', 'Did not meet verification requirements.') || ''
    if (!reason.trim()) {
      return
    }
    setPageError('')
    setBusyId(accountId)
    try {
      const updatedUser = await updateAdminUserRequest(
        accountId,
        { isApproved: false, rejectionReason: reason.trim() },
        buildAuthHeaders(token, user),
      )
      setUsers((current) => (Array.isArray(current) ? current : []).map((entry) => (entry.id === accountId ? updatedUser : entry)))
      bumpDb()
    } catch (e) {
      setPageError(e.message || 'Reject failed.')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="space-y-10">
      <PageSection
        compact
        eyebrow="Approvals"
        title="Registration queue"
        description="Everyone here is waiting for approval (including previously rejected signups you can approve from this list or from Users). Approve to allow sign-in, or reject with a reason."
      />
      {pageError ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100" role="alert">
          {pageError}
        </div>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-2">
        {pendingAccounts.map((account) => (
          <Card key={account.id} hover={false} className="surface-card-strong border-white/10 p-6 transition hover:border-cyan-400/15">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-white">{account.name}</h3>
                <span className="badge-chip capitalize">{account.role}</span>
              </div>
              <p className="text-sm text-slate-400">{account.email}</p>
              <p className="text-slate-200">{account.city || 'No city'} · {account.phone || 'No phone'}</p>
              {account.rejectionReason ? (
                <p className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-100">
                  Previous rejection: {account.rejectionReason}
                </p>
              ) : null}
              {account.role === 'provider' ? (
                <p className="text-sm text-slate-400">CNIC: {account.cnic || 'Not supplied'} · File: {account.cnicFileName || 'Missing'}</p>
              ) : null}
              {account.cnicDocumentDataUrl ? (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/50">
                  <img src={account.cnicDocumentDataUrl} alt="Submitted CNIC preview" className="max-h-44 w-full object-contain object-top" />
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                <Button
                  variant="success"
                  disabled={busyId === account.id}
                  onClick={() => handleApprove(account.id)}
                  className="inline-flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  disabled={busyId === account.id}
                  onClick={() => handleReject(account.id)}
                  className="inline-flex items-center gap-2 border-amber-500/40 text-amber-100 hover:bg-amber-500/10"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!pendingAccounts.length ? (
        <Card className="surface-card-strong border-dashed border-white/15 p-10 text-center" hover={false}>
          <p className="text-lg font-medium text-white">Queue is clear</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">No customers or providers are waiting for approval right now. Rejected signups will appear here so you can approve them later.</p>
        </Card>
      ) : null}
    </div>
  )
}

const AdminManageServicesPage = () => {
  const { token, user } = useAuth()
  const { services, fetchServices } = useServices()
  const [userList, setUserList] = useState([])
  const [view, setView] = useState(null)
  const [adminEdit, setAdminEdit] = useState({ title: '', basePrice: '', eta: '', description: '' })
  const [busy, setBusy] = useState('')
  const [err, setErr] = useState('')
  const headers = useMemo(() => {
  const builtHeaders = buildAuthHeaders(token, user)
  console.log('🔥 Built headers:', builtHeaders)
  console.log('🔥 User ID field:', user?.id || user?._id || 'missing')
  
  // Ensure we have a user ID for admin permissions
  if (!builtHeaders['x-user-id'] && (user?.id || user?._id)) {
    builtHeaders['x-user-id'] = user.id || user._id
  }
  
  return builtHeaders
}, [token, user])

  useEffect(() => {
    if (token && user?.role === 'admin') {
      fetchServices({ search: '', category: '', group: '' })
      fetchAdminUsersRequest(headers)
        .then((response) => {
          // Handle the response structure from backend
          if (response && response.approvedUsers) {
            setUserList(response.approvedUsers)
          } else if (Array.isArray(response)) {
            setUserList(response)
          } else {
            setUserList([])
          }
        })
        .catch(() => setUserList([]))
    }
  }, [token, user?.role, fetchServices, headers])

  const getProviderName = (provider) => {
  if (!provider) return "Unknown Provider";

  if (typeof provider === "string") return provider;

  if (typeof provider === "object") {
    return provider.name || provider.email || provider._id;
  }

  return "Unknown Provider";
};

  const openView = (svc) => {
    setView(svc)
    setAdminEdit({
      title: svc.title || '',
      basePrice: String(svc.basePrice ?? ''),
      eta: svc.eta || '',
      description: svc.description || '',
    })
    setErr('')
  }

  const handleToggle = async (serviceId, nextApproved) => {
    await updateAdminServiceRequest(serviceId, { isApproved: nextApproved }, headers)
    await fetchServices({ search: '', category: '', group: '' })
    if (view?._id === serviceId) {
      setView((v) => (v ? { ...v, isApproved: nextApproved } : null))
    }
  }

  const handleSaveAdminService = async () => {
    if (!view) {
      return
    }
    setBusy('save')
    setErr('')
    try {
      const imgs = Array.isArray(view.images) && view.images.length ? view.images : view.image ? [view.image] : []
      if (imgs.length < 2 || imgs.length > 5) {
        setErr('Service must keep 2–5 images. Edit from the provider side to adjust photos.')
        setBusy('')
        return
      }
      await updateAdminServiceRequest(view._id, {
        title: adminEdit.title,
        basePrice: Number(adminEdit.basePrice),
        eta: adminEdit.eta,
        description: adminEdit.description,
        images: imgs,
      }, headers)
      await fetchServices({ search: '', category: '', group: '' })
      setView(null)
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy('')
    }
  }

  const handleDeleteService = async (svc) => {
    if (!window.confirm(`Delete listing "${svc.title}"?`)) {
      return
    }
    setBusy(svc._id)
    try {
      console.log('🔥 Deleting service as admin:', svc._id)
      console.log('🔥 Headers being sent:', headers)
      console.log('🔥 User object:', user)
      console.log('🔥 Token exists:', !!token)
      
      // Use admin-specific delete service endpoint
      await deleteAdminServiceRequest(svc._id, headers)
      await fetchServices({ search: '', category: '', group: '' })
      if (view?._id === svc._id) {
        setView(null)
      }
      console.log('🔥 Service deleted successfully')
    } catch (e) {
      console.error('🔥 Delete service error:', e)
      setErr(e.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Service oversight"
        title="Moderate service listings"
        description="View full details, update copy and pricing, approve or suspend, or remove a listing."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.isArray(services) && services.map((svc) => {
          const isLive = svc.isApproved !== false
          const imgs = Array.isArray(svc.images) && svc.images.length ? svc.images : svc.image ? [svc.image] : []
          return (
            <Card key={svc._id} hover={false}>
              <div className="grid gap-4 p-5 sm:grid-cols-[120px_1fr]">
                <div className="h-28 overflow-hidden rounded-xl border border-white/10">
                  <img src={imgs[0] || svc.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-white">{String(svc.title || '—')}</h3>
                  <p className="text-sm text-slate-400">{String(svc.categoryLabel || svc.category || svc.slug || '—')} · {formatMoney(svc.basePrice)}</p>
                  <p className="mt-1 text-xs text-slate-500">Provider: {getProviderName(svc.providerId)}</p>
                  <span className="badge-chip mt-2 inline-block">{isLive ? 'Approved' : 'Suspended'}</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" type="button" onClick={() => openView(svc)}>View</Button>
                    <Button size="sm" variant={isLive ? 'secondary' : 'primary'} type="button" onClick={() => handleToggle(svc._id, !isLive)}>
                      {isLive ? 'Suspend' : 'Approve'}
                    </Button>
                    <Button size="sm" variant="outline" type="button" className="border-rose-500/40 text-rose-200" disabled={busy === svc._id} onClick={() => handleDeleteService(svc)}>Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      {!services.length ? <Card className="p-8 text-center text-slate-300" hover={false}>No services in catalog.</Card> : null}

      {view ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6" hover={false}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-semibold text-white">Service details</h3>
              <button type="button" onClick={() => setView(null)} className="rounded-lg p-1 text-slate-400 hover:bg-white/10" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p><span className="text-slate-500">ID:</span> {typeof view.providerId === 'object' ? String(view.providerId._id || view.providerId.id || '—') : String(view.providerId || '—')}</p>
              <p><span className="text-slate-500">Provider:</span> {getProviderName(view.providerId)}</p>
              <p><span className="text-slate-500">Category:</span> {String(view.categoryLabel || view.category || view.slug || '—')}</p>
              <p><span className="text-slate-500">Group:</span> {String(view.group || '—')}</p>
              <p><span className="text-slate-500">Status:</span> {view.isApproved !== false ? 'Approved' : 'Suspended'}</p>
            </div>
            <div className="mt-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Title</p>
                  <p className="text-white font-medium">{String(view.title || '—')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Base Price</p>
                  <p className="text-white font-medium">{formatMoney(view.basePrice)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">ETA</p>
                <p className="text-white font-medium">{String(view.eta || '—')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Description</p>
                <p className="text-white whitespace-pre-wrap">{String(view.description || '—')}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-500">Images ({(Array.isArray(view.images) ? view.images : []).length || 0}) — change count from provider edit (2–5 required).</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Array.isArray(view.images) && view.images.length ? view.images : view.image ? [view.image] : []).map((url, i) => (
                <div key={`img-${view.id}-${i}`} className="h-20 w-20 overflow-hidden rounded-lg border border-white/10">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
                      </Card>
        </div>
      ) : null}
    </div>
  )
}

// const AllBookingsPage = () => {
//   const { bookings } = useBookings()

//   return (
//     <div className="space-y-10">
//       <PageSection
//         eyebrow="All bookings"
//         title="All platform bookings"
//         description="Monitor booking state across customers and providers: service, schedule, status, and payment."
//       />
//       <ListPanel title="Platform bookings" description="The new card layout keeps status, provider, and value easy to compare." items={bookings.map((booking) => ({
//         title: booking.serviceTitle,
//         provider: `${booking.scheduledDate} · ${booking.address}`,
//         status: `${bookingBadge(booking.status)} · ${formatStatus(booking.paymentStatus)}`,
//         price: formatMoney(booking.amount),
//       }))} />
//     </div>
//   )
// }



const AllBookingsPage = () => {
  const { bookings, deleteBooking } = useBookings()

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      try {
        await deleteBooking(bookingId)
      } catch (error) {
        console.error('Error deleting booking:', error)
      }
    }
  }

  // Transform bookings to handle populated fields and missing data
  const formattedBookings = bookings.map((booking) => {
    // Handle service name from populated serviceId or fallback
    const serviceName = typeof booking.serviceId === 'object' && booking.serviceId?.title
      ? booking.serviceId.title
      : typeof booking.serviceId === 'object' && booking.serviceId?.category
        ? booking.serviceId.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        : booking.serviceTitle || 'Unknown Service'

    // Handle provider name from populated providerId
    const providerName = typeof booking.providerId === 'object' && booking.providerId?.name
      ? booking.providerId.name
      : typeof booking.providerId === 'string'
        ? `Provider ${booking.providerId.slice(-6)}`
        : 'Unknown Provider'

    // Handle date
    const dateStr = booking.bookingDate 
      ? new Date(booking.bookingDate).toLocaleDateString()
      : booking.scheduledDate || 'N/A'

    // Handle address
    const addressStr = booking.location?.address 
      || booking.address 
      || 'No address'

    // Handle amount
    const amount = booking.totalAmount || booking.amount || 0

    // Handle status display
    const statusLabel = bookingBadge(booking.status) || booking.status || 'pending'
    const paymentLabel = formatStatus(booking.paymentStatus) || 'pending'

    return {
      id: booking._id || booking.id,
      title: serviceName,
      provider: `${dateStr} · ${addressStr}`,
      status: `${statusLabel} · ${paymentLabel}`,
      price: formatMoney(amount),
      onDelete: () => handleDeleteBooking(booking._id || booking.id),
    }
  })

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="All bookings"
        title="All platform bookings"
        description="Monitor booking state across customers and providers: service, schedule, status, and payment."
      />
      <ListPanel 
        title="Platform bookings" 
        description="The new card layout keeps status, provider, and value easy to compare." 
        items={formattedBookings.length ? formattedBookings : [{
          title: 'No bookings yet',
          provider: 'Bookings will appear here',
          status: '—',
          price: '—'
        }]} 
      />
    </div>
  )
}

// const PaymentsReportsPage = () => {
//   const { token, user } = useAuth()
//   const [payments, setPayments] = useState([])

//   useEffect(() => {
//     if (!token || !user) {
//       return
//     }

//     fetchPaymentsRequest(buildAuthHeaders(token, user)).then(setPayments).catch(() => setPayments([]))
//   }, [token, user])

//   return (
//     <div className="space-y-10">
//       <PageSection
//         eyebrow="Payments and reports"
//         title="Reporting now looks like a premium finance dashboard"
//         description="Admins can review payment status, transaction totals, and settlement progress through the shared payments endpoint."
//         aside={(
//           <Card className="p-6" hover={false}>
//             <p className="section-eyebrow">Revenue snapshot</p>
//             <p className="mt-4 text-4xl font-bold text-white">{formatMoney(payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0))}</p>
//             <p className="mt-2 text-slate-400">Gross volume in the current mock dataset</p>
//           </Card>
//         )}
//       >
//         <StatGrid items={adminStats} />
//       </PageSection>
//       <ListPanel title="Payment status board" description="Large payment movements and exceptions are easier to read." items={payments.map((payment) => ({ title: payment.bookingId, provider: `${payment.id} · ${formatMoney(payment.amount)}`, status: formatStatus(payment.status) }))} />
//     </div>
//   )
// }






const PaymentsReportsPage = () => {
  const { token, user } = useAuth()
  const { bookings } = useBookings() // Use bookings hook instead of separate payments API
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token || !user) {
      setLoading(false)
      return
    }

    // Derive payments from paid bookings since your backend stores payment in booking
    const paidBookings = bookings.filter(b => b.paymentStatus === 'paid' || b.status === 'completed')
    
    const transformedPayments = paidBookings.map(booking => {
      const serviceName = typeof booking.serviceId === 'object' && booking.serviceId?.title
        ? booking.serviceId.title
        : typeof booking.serviceId === 'object' && booking.serviceId?.category
          ? booking.serviceId.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          : booking.serviceTitle || 'Unknown Service'

      return {
        id: booking._id || booking.id,
        bookingId: booking._id || booking.id,
        service: serviceName,
        amount: booking.totalAmount || booking.amount || 0,
        status: booking.paymentStatus === 'paid' ? 'Completed' : 'Processing',
        date: booking.paidAt 
          ? new Date(booking.paidAt).toLocaleDateString() 
          : booking.bookingDate 
            ? new Date(booking.bookingDate).toLocaleDateString()
            : 'N/A',
        customer: typeof booking.customerId === 'object' && booking.customerId?.name
          ? booking.customerId.name
          : 'Customer'
      }
    })

    setPayments(transformedPayments)
    setLoading(false)
  }, [token, user, bookings])

  // Calculate real stats from payments data
  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  const pendingAmount = bookings
    .filter(b => ['held', 'refund_pending'].includes(b.paymentStatus))
    .reduce((sum, b) => sum + Number(b.totalAmount || b.amount || 0), 0)
  const completedCount = bookings.filter(b => ['paid', 'released'].includes(b.paymentStatus)).length

  const dynamicAdminStats = [
    { 
      label: 'Total Revenue', 
      value: formatMoney(totalRevenue), 
      note: 'All paid bookings', 
      icon: Banknote
    },
    { 
      label: 'Pending', 
      value: formatMoney(pendingAmount), 
      note: 'Awaiting settlement', 
      icon: Clock 
    },
    { 
      label: 'Completed', 
      value: String(completedCount), 
      note: 'Successfully processed', 
      icon: CheckCircle 
    },
  ]

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Payments and reports"
        title="Payment Reports"
        description="Review payment status, transaction totals, and settlement progress across all platform bookings."
        aside={(
          <Card className="p-6" hover={false}>
            <p className="section-eyebrow">Revenue snapshot</p>
            <p className="mt-4 text-4xl font-bold text-white">{formatMoney(totalRevenue)}</p>
            <p className="mt-2 text-slate-400">Gross volume from paid bookings</p>
          </Card>
        )}
      >
        <StatGrid items={dynamicAdminStats} />
      </PageSection>
      
      <ListPanel 
        title="Payment Transactions" 
        description="All completed payments from customer bookings." 
        items={payments.length ? payments.map((payment) => ({
          title: payment.service,
          provider: `${payment.customer} · ${payment.date}`,
          status: payment.status,
          price: formatMoney(payment.amount)
        })) : [{
          title: 'No payments received yet',
          provider: 'Payments will appear when customers complete bookings',
          status: '—',
          price: '—'
        }]} 
      />
    </div>
  )
}
// const LiveMonitoringMapPage = () => (
//   <div className="space-y-10">
//     <PageSection
//       eyebrow="Live monitoring"
//       title="Operations overview"
//       description="Connect a real map or analytics backend here. The mock app only simulates provider positions for active jobs."
//     />
//     <Card className="border-white/10 bg-white/[0.03] p-8" hover={false}>
//       <p className="text-sm text-slate-300">
//         When you integrate production data, this area can show live provider locations, demand heatmaps, and alerts. No sample "zones" are shown—only real signals from your stack belong here.
//       </p>
//     </Card>
//   </div>
// )
const LiveMonitoringMapPage = () => {
  const { bookings } = useBookings()
  const { services } = useServices()
  const [activeProviders, setActiveProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get active jobs (accepted or in_progress) with provider details
    const activeJobs = bookings.filter(b => 
      ['accepted', 'in_progress'].includes(b.status)
    )

    // Extract unique providers with their active job count
    const providerMap = new Map()
    
    activeJobs.forEach(job => {
      const provider = job.providerId
      if (!provider) return

      const providerId = typeof provider === 'object' 
        ? provider._id || provider.id 
        : provider
      
      const providerName = typeof provider === 'object' 
        ? provider.name || provider.email || 'Unknown'
        : `Provider ${String(provider).slice(-6)}`

      if (providerMap.has(providerId)) {
        providerMap.get(providerId).jobCount += 1
      } else {
        providerMap.set(providerId, {
          id: providerId,
          name: providerName,
          jobCount: 1,
          status: job.status === 'in_progress' ? 'On Service' : 'En Route',
          service: typeof job.serviceId === 'object' 
            ? job.serviceId?.title || job.serviceId?.category 
            : 'Unknown Service',
          location: job.location?.address || job.address || 'Location N/A',
          customer: typeof job.customerId === 'object'
            ? job.customerId?.name || 'Customer'
            : 'Customer',
          updatedAt: job.updatedAt || job.bookingDate
        })
      }
    })

    setActiveProviders(Array.from(providerMap.values()))
    setLoading(false)
  }, [bookings])

  // Stats for monitoring dashboard
  const totalActiveProviders = activeProviders.length
  const totalActiveJobs = activeProviders.reduce((sum, p) => sum + p.jobCount, 0)
  const enRouteCount = activeProviders.filter(p => p.status === 'En Route').length
  const onServiceCount = activeProviders.filter(p => p.status === 'On Service').length

  const monitorStats = [
    { 
      label: 'Active Providers', 
      value: String(totalActiveProviders), 
      note: 'Currently working', 
      icon: Users 
    },
    { 
      label: 'Active Jobs', 
      value: String(totalActiveJobs), 
      note: 'In progress', 
      icon: Activity 
    },
    { 
      label: 'En Route', 
      value: String(enRouteCount), 
      note: 'Heading to customer', 
      icon: Truck 
    },
    { 
      label: 'On Service', 
      value: String(onServiceCount), 
      note: 'At customer location', 
      icon: Wrench 
    },
  ]

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Live monitoring"
        title="Operations overview"
        description="Real-time view of active providers, their current jobs, and service locations."
      />
      
      <StatGrid items={monitorStats} />

      {/* Active Providers List */}
      <div className="space-y-6">
        <SectionHeader 
          eyebrow="Active now"
          title="Provider Activity Feed"
          description="Providers currently assigned to active bookings."
        />
        
        {loading ? (
          <Card className="p-8 text-center text-slate-300" hover={false}>
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-custom-yellow" />
            Loading provider data...
          </Card>
        ) : activeProviders.length === 0 ? (
          <Card className="p-8 text-center text-slate-300" hover={false}>
            <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <p className="text-lg font-medium text-white">No active providers</p>
            <p className="mt-2 text-sm text-slate-400">
              Active providers will appear here when they accept or start jobs.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {activeProviders.map((provider) => (
              <Card key={provider.id} hover={false} className="surface-card-strong border-white/10">
                <div className="space-y-4 p-5">
                  {/* Provider Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                        <p className="text-sm text-slate-400">ID: {String(provider.id).slice(-8)}</p>
                      </div>
                    </div>
                    <span className={`badge-chip ${
                      provider.status === 'On Service' 
                        ? 'bg-emerald-500/15 text-emerald-100 border-emerald-400/35' 
                        : 'bg-amber-500/15 text-amber-100 border-amber-400/35'
                    }`}>
                      {provider.status}
                    </span>
                  </div>

                  {/* Job Details */}
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="h-4 w-4 text-custom-yellow" />
                      <span className="text-white">{provider.service}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-rose-400" />
                      <span className="text-slate-300">{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-cyan-400" />
                      <span className="text-slate-300">Customer: {provider.customer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-400">
                        {provider.updatedAt 
                          ? new Date(provider.updatedAt).toLocaleString() 
                          : 'Recently updated'}
                      </span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex gap-4 pt-2">
                    <div className="flex-1 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
                      <p className="text-2xl font-bold text-white">{provider.jobCount}</p>
                      <p className="text-xs text-slate-400">Active Jobs</p>
                    </div>
                    <div className="flex-1 rounded-xl border border-white/8 bg-white/[0.03] p-3 text-center">
                      <p className="text-2xl font-bold text-cyan-400">
                        {provider.status === 'On Service' ? 'Live' : '—'}
                      </p>
                      <p className="text-xs text-slate-400">Status</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Service Demand Overview */}
      <div className="space-y-6">
        <SectionHeader 
          eyebrow="Demand"
          title="Service Category Activity"
          description="Breakdown of active jobs by service type."
        />
        
        {services.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services
              .filter(s => s.isApproved !== false)
              .slice(0, 8)
              .map((service) => {
                const activeCount = bookings.filter(b => 
                  b.status === 'in_progress' && 
                  (b.serviceId?._id === service._id || b.serviceId === service._id)
                ).length
                
                return (
                  <Card key={service._id} hover={false} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{service.title || 'Service'}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {activeCount} active {activeCount === 1 ? 'job' : 'jobs'}
                        </p>
                      </div>
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        activeCount > 0 ? 'bg-cyan-500/20' : 'bg-white/5'
                      }`}>
                        <Activity className={`h-5 w-5 ${
                          activeCount > 0 ? 'text-cyan-400' : 'text-slate-600'
                        }`} />
                      </div>
                    </div>
                  </Card>
                )
              })}
          </div>
        ) : (
          <Card className="p-8 text-center text-slate-300" hover={false}>
            No services in catalog.
          </Card>
        )}
      </div>
    </div>
  )
}
const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings([
        { id: 1, service: 'Home Cleaning', date: '2024-01-15', status: 'confirmed', price: 150 },
        { id: 2, service: 'Plumbing Repair', date: '2024-01-18', status: 'pending', price: 200 },
        { id: 3, service: 'Electrical Work', date: '2024-01-20', status: 'completed', price: 300 }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Customer Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-cyan-400">{bookings.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Confirmed</h3>
            <p className="text-3xl font-bold text-green-400">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Spent</h3>
            <p className="text-3xl font-bold text-cyan-400">
              PKR {bookings.reduce((sum, b) => sum + (b.price || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Bookings</h2>
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-white">{booking.service}</h3>
                  <p className="text-gray-300">{booking.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {booking.status}
                  </span>
                  <span className="text-xl font-bold text-cyan-400">PKR {booking.price?.toLocaleString() || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Browse Services
          </button>
          <button
            onClick={() => navigate('/bookings')}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  )
}

// Provider Dashboard Component
const ProviderDashboard = () => {
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [earnings, setEarnings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices([
        { id: 1, name: 'Home Cleaning', price: 150, bookings: 12 },
        { id: 2, name: 'Plumbing Repair', price: 200, bookings: 8 },
        { id: 3, name: 'Electrical Work', price: 300, bookings: 6 }
      ])
      setBookings([
        { id: 1, service: 'Home Cleaning', customer: 'John Doe', date: '2024-01-15', status: 'pending' },
        { id: 2, service: 'Plumbing Repair', customer: 'Jane Smith', date: '2024-01-16', status: 'confirmed' },
        { id: 3, service: 'Electrical Work', customer: 'Bob Johnson', date: '2024-01-17', status: 'completed' }
      ])
      setEarnings(2450)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Provider Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Services</h3>
            <p className="text-3xl font-bold text-cyan-400">{services.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-green-400">
              {services.reduce((sum, s) => sum + s.bookings, 0)}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-cyan-400">${earnings}</p>
          </div>
        </div>

        {/* My Services */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">My Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-gray-300 mb-2">${service.price} per service</p>
                <p className="text-sm text-gray-400">{service.bookings} bookings</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Booking Requests */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Booking Requests</h2>
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-white">{booking.service}</h3>
                  <p className="text-gray-300">{booking.customer} • {booking.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    booking.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {booking.status}
                  </span>
                  {booking.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                        Accept
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Admin Dashboard Component
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalProviders: 180,
    totalBookings: 3420,
    totalRevenue: 45600
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', date: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'provider', date: '2024-01-14' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', date: '2024-01-13' }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
        
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-cyan-400">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Service Providers</h3>
            <p className="text-3xl font-bold text-green-400">{stats.totalProviders}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.totalBookings.toLocaleString()}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-cyan-400">${stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* System Policies */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">System Policies</h3>
          <div className="text-sm text-blue-200 space-y-1">
            <p>• Service providers can publish only one service per account</p>
            <p>• Services require admin approval before becoming visible to customers</p>
            <p>• Providers can edit existing services but cannot create additional ones</p>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3 text-gray-400">Name</th>
                  <th className="pb-3 text-gray-400">Email</th>
                  <th className="pb-3 text-gray-400">Role</th>
                  <th className="pb-3 text-gray-400">Join Date</th>
                  <th className="pb-3 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-700">
                    <td className="py-3 text-white">{user.name}</td>
                    <td className="py-3 text-gray-300">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                        user.role === 'provider' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">{user.date}</td>
                    <td className="py-3">
                      <button className="text-cyan-400 hover:text-cyan-300 mr-3">View</button>
                      <button className="text-yellow-400 hover:text-yellow-300 mr-3">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <button className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Manage Users</h3>
            <p className="text-gray-300">View and manage all users</p>
          </button>
          <button className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">Approve Providers</h3>
            <p className="text-gray-300">Review provider applications</p>
          </button>
          <button className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-cyan-400 transition-colors">
            <h3 className="text-lg font-semibold text-white mb-2">View Reports</h3>
            <p className="text-gray-300">Analytics and insights</p>
          </button>
          <div>
            Learn More
          </div>
        </div>
      </div>
    </div>
  )
}

// Additional utility components and functions
const BookingFormPage = () => {
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    address: '',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      navigate('/customer/bookings')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Book Service</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <label className="block text-white mb-2">Service Type</label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="">Select a service</option>
              <option value="1">Home Cleaning</option>
              <option value="2">Plumbing Repair</option>
              <option value="3">Electrical Work</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <label className="block text-white mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
            
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <label className="block text-white mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <label className="block text-white mb-2">Service Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Enter the service address"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow"
              rows={3}
              required
            />
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <label className="block text-white mb-2">Additional Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional information about the service needed"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-custom-yellow"
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-custom-yellow text-black rounded-lg hover:bg-yellow-400 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Booking...' : 'Book Service'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/browse')}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const LiveTrackingPage = () => {
  const { id } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch real booking from API
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const storedAuth = localStorage.getItem('service-hive-auth')
        const authData = storedAuth ? JSON.parse(storedAuth) : null
        const token = authData?.token

        if (!token || !id) {
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          // Service model uses 'title' not 'name'
          const serviceName = typeof data.serviceId === 'object' && data.serviceId?.title
            ? data.serviceId.title
            : typeof data.serviceId === 'object' && data.serviceId?.category
              ? data.serviceId.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
              : 'Service #' + (data.serviceId?.toString().slice(-4) || 'N/A')

          const providerName = typeof data.providerId === 'object' && data.providerId?.name
            ? data.providerId.name
            : 'Provider #' + (data.providerId?.toString().slice(-4) || 'N/A')

          setBooking({
            id: data._id,
            service: serviceName,
            provider: providerName,
            status: data.status,
            estimatedArrival: '2:30 PM' // This would come from real-time tracking
          })
        }
      } catch (error) {
        console.error('Error fetching booking:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tracking information...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Booking not found</p>
          <a href="/customer/bookings" className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors inline-block">
            My Bookings
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Live Tracking</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Service Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Service</p>
                <p className="text-lg text-white">{booking.service}</p>
              </div>
              <div>
                <p className="text-gray-400">Provider</p>
                <p className="text-lg text-white">{booking.provider}</p>
              </div>
              <div>
                <p className="text-gray-400">Status</p>
                <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  {booking.status?.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-gray-400">Estimated Arrival</p>
                <p className="text-lg text-white">{booking.estimatedArrival}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Live Map</h2>
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Map integration would go here</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Provider</h2>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Chat
            </button>
            <button className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
              <Phone className="w-5 h-5 inline mr-2" />
              Call
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}




// const MyBookingsPage = () => {
//   const { bookings, fetchBookings } = useBookings()
//   const { user } = useAuth()
//   const [confirmingId, setConfirmingId] = useState('')
//   const [pageError, setPageError] = useState('')

//   // Filter customer bookings
//   const myBookings = bookings.filter((booking) => {
//     const bookingCustomerId = typeof booking.customerId === 'object' 
//       ? String(booking.customerId?._id || booking.customerId?.id) 
//       : String(booking.customerId)
//     const currentUserId = String(user?.id || user?._id)
//     return bookingCustomerId === currentUserId
//   })

//   // NEW: Customer confirms completion
//   const handleCustomerConfirm = async (bookingId) => {
//     setConfirmingId(bookingId)
//     try {
//       const storedAuth = localStorage.getItem('service-hive-auth')
//       const authData = storedAuth ? JSON.parse(storedAuth) : null
//       const token = authData?.token

//       const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/confirm-complete`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })

//       if (!response.ok) throw new Error(`Failed: ${response.status}`)

//       const result = await response.json()
//       await fetchBookings()

//       if (result.bothConfirmed) {
//         alert('Service confirmed complete! Payment released to provider.')
//       } else {
//         alert('Confirmation recorded. Waiting for provider to confirm.')
//       }
//     } catch (error) {
//       setPageError(error.message)
//     } finally {
//       setConfirmingId('')
//     }
//   }

//   return (
//     <div className="space-y-10">
//       <PageSection
//         eyebrow="My bookings"
//         title="Your service bookings"
//         description="Track your bookings and confirm when services are completed."
//       />

//       {pageError ? (
//         <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
//           {pageError}
//         </div>
//       ) : null}

//       <div className="grid gap-6 xl:grid-cols-2">
//         {myBookings.map((booking) => (
//           <Card key={booking._id || booking.id} hover={false}>
//             <div className="space-y-4">
//               <div className="flex items-start justify-between gap-4">
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">
//                     {booking.serviceId?.title || booking.serviceTitle || 'Service'}
//                   </h3>
//                   <p className="mt-1 text-sm text-slate-400">
//                     {booking.location?.address || booking.address || 'No address'}
//                   </p>
//                 </div>
//                 <span className="badge-chip">{bookingBadge(booking.status)}</span>
//               </div>

//               <p className="text-slate-200">
//                 {booking.bookingDate 
//                   ? new Date(booking.bookingDate).toLocaleDateString() 
//                   : 'N/A'}
//               </p>

//               <p className="text-sm text-cyan-200">
//                 {formatMoney(booking.totalAmount || booking.amount || 0)}
//               </p>

//               {/* Payment status indicator */}
//               {booking.paymentStatus === 'held' && (
//                 <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2">
//                   <p className="text-xs text-amber-300">Payment held in escrow</p>
//                 </div>
//               )}
//               {booking.paymentStatus === 'released' && (
//                 <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
//                   <p className="text-xs text-emerald-300">Payment released to provider</p>
//                 </div>
//               )}

//               <div className="flex flex-wrap gap-3">
//                 {/* NEW: Customer confirm completion button */}
//                 {booking.status === 'completed' && !booking.customerConfirmed && (
//                   <Button 
//                     disabled={confirmingId === (booking._id || booking.id)}
//                     onClick={() => handleCustomerConfirm(booking._id || booking.id)}
//                   >
//                     {confirmingId === (booking._id || booking.id) ? 'Confirming...' : 'Confirm service complete'}
//                   </Button>
//                 )}

//                 {booking.customerConfirmed && (
//                   <span className="text-sm text-emerald-400 flex items-center gap-1">
//                     <CheckCircle className="h-4 w-4" />
//                     You confirmed completion
//                   </span>
//                 )}
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>
//       {!myBookings.length ? (
//         <Card className="p-8 text-center text-slate-300" hover={false}>
//           No bookings yet. Browse services to make your first booking.
//         </Card>
//       ) : null}
//     </div>
//   )
// }
const MyBookingsPage = () => {
  const { bookings, fetchBookings } = useBookings()
  const { user } = useAuth()
  const [confirmingId, setConfirmingId] = useState('')
  const [cancelingId, setCancelingId] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const [pageError, setPageError] = useState('')

  // ── Chat drawer state ────────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false)
  const [chatBooking, setChatBooking] = useState(null)
  const openChat  = (b) => { setChatBooking(b); setChatOpen(true) }
  const closeChat = ()  => { setChatOpen(false); setChatBooking(null) }
  // ────────────────────────────────────────────────────────────────────────

  // Filter customer bookings
  const myBookings = bookings.filter((booking) => {
    const bookingCustomerId = typeof booking.customerId === 'object' 
      ? String(booking.customerId?._id || booking.customerId?.id) 
      : String(booking.customerId)
    const currentUserId = String(user?.id || user?._id)
    return bookingCustomerId === currentUserId
  })

  // Customer confirms completion
  const handleCustomerConfirm = async (bookingId) => {
    setConfirmingId(bookingId)
    try {
      const storedAuth = localStorage.getItem('service-hive-auth')
      const authData = storedAuth ? JSON.parse(storedAuth) : null
      const token = authData?.token

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/confirm-complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`Failed: ${response.status}`)

      const result = await response.json()
      await fetchBookings()

      if (result.bothConfirmed) {
        alert('Service confirmed complete! Payment released to provider.')
      } else {
        alert('Confirmation recorded. Waiting for provider to confirm.')
      }
    } catch (error) {
      setPageError(error.message)
    } finally {
      setConfirmingId('')
    }
  }

  // Customer cancels service after it starts (Scenario 2)
  const handleCancelService = async (bookingId) => {
    if (!window.confirm('Cancel this service now? A 6% refund fee will be applied.')) {
      return
    }

    setCancelingId(bookingId)
    try {
      const storedAuth = localStorage.getItem('service-hive-auth')
      const authData = storedAuth ? JSON.parse(storedAuth) : null
      const token = authData?.token

      if (!token) {
        setPageError('Session expired. Please log in again.')
        return
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Failed: ${response.status}`)
      }

      await fetchBookings()
      alert('Service cancelled. Admin will process your refund shortly.')
    } catch (error) {
      setPageError(`Cancellation failed: ${error.message}`)
    } finally {
      setCancelingId('')
    }
  }

  // Delete booking for completed or rejected services
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return
    }

    setDeletingId(bookingId)
    try {
      const storedAuth = localStorage.getItem('service-hive-auth')
      const authData = storedAuth ? JSON.parse(storedAuth) : null
      const token = authData?.token

      if (!token) {
        setPageError('Session expired. Please log in again.')
        return
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed: ${response.status}`)
      }

      await fetchBookings()
      alert('Booking deleted successfully.')
    } catch (error) {
      setPageError(`Delete failed: ${error.message}`)
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div className="space-y-10">

      {/* Chat Drawer — slides in from the right when Chat button clicked */}
      <BookingChatDrawer
        bookingId={chatBooking ? String(chatBooking._id || chatBooking.id) : null}
        title={chatBooking ? `Chat · ${chatBooking.serviceId?.title || chatBooking.serviceTitle || 'Service'}` : 'Chat'}
        isOpen={chatOpen}
        onClose={closeChat}
      />

      <PageSection
        eyebrow="My bookings"
        title="Your service bookings"
        description="Track your bookings and confirm when services are completed."
      />

      {pageError ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {pageError}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {myBookings.map((booking) => (
          <Card key={booking._id || booking.id} hover={false}>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {booking.serviceId?.title || booking.serviceTitle || 'Service'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {booking.location?.address || booking.address || 'No address'}
                  </p>
                </div>

                {/* Status badge + Chat button side by side */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Chat button — only visible when provider has accepted */}
                  {['accepted', 'in_progress', 'completed'].includes(booking.status) && (
                    <button
                      onClick={() => openChat(booking)}
                      className="flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400 hover:bg-cyan-500/25 transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Chat
                    </button>
                  )}
                  <span className="badge-chip">{bookingBadge(booking.status)}</span>
                </div>
              </div>

              <p className="text-slate-200">
                {booking.bookingDate 
                  ? new Date(booking.bookingDate).toLocaleDateString() 
                  : 'N/A'}
              </p>

              <p className="text-sm text-cyan-200">
                {formatMoney(booking.totalAmount || booking.amount || 0)}
              </p>

              {/* Payment status indicator */}
              {booking.paymentStatus === 'held' && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2">
                  <p className="text-xs text-amber-300">Payment held in escrow</p>
                </div>
              )}
              {booking.paymentStatus === 'released' && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
                  <p className="text-xs text-emerald-300">Payment released to provider</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {/* Cancel service button during in_progress */}
                {booking.status === 'in_progress' && (
                  <Button
                    variant="secondary"
                    className="border-red-500/30 hover:bg-red-500/10"
                    disabled={cancelingId === (booking._id || booking.id)}
                    onClick={() => handleCancelService(booking._id || booking.id)}
                  >
                    {cancelingId === (booking._id || booking.id) ? 'Cancelling...' : 'Cancel Service'}
                  </Button>
                )}

                {/* Customer confirm completion button */}
                {booking.status === 'completed' && !booking.customerConfirmed && (
                  <Button
                  variant='outline'
                    disabled={confirmingId === (booking._id || booking.id)}
                    onClick={() => handleCustomerConfirm(booking._id || booking.id)}
                  >
                    {confirmingId === (booking._id || booking.id) ? 'Confirming...' : 'Confirm service complete'}
                  </Button>
                )}

                {booking.customerConfirmed && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    You confirmed completion
                  </span>
                )}

                {/* Delete button for all bookings */}
                <Button
                  variant="secondary"
                  className="border-red-500/30 hover:bg-red-500/10"
                  disabled={deletingId === (booking._id || booking.id)}
                  onClick={() => handleDeleteBooking(booking._id || booking.id)}
                >
                  {deletingId === (booking._id || booking.id) ? 'Deleting...' : 'Delete Booking'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!myBookings.length ? (
        <Card className="p-8 text-center text-slate-300" hover={false}>
          No bookings yet. Browse services to make your first booking.
        </Card>
      ) : null}
    </div>
  )
}





const PaymentsPage = () => {
  const { token, user } = useAuth()
  const { bookings, fetchBookings } = useBookings()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    totalProviderPayout: 0,
    heldCount: 0,
    releasedCount: 0
  })

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      setLoading(false)
      return
    }

    const fetchAdminData = async () => {
      try {
        // Fetch all bookings for admin view
        const response = await fetch('http://localhost:5000/api/bookings/admin/payments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPayments(data.payments || [])
          setStats(data.stats || {})
        } else {
          // Fallback: calculate from bookings hook
          const allBookings = bookings
          const held = allBookings.filter(b => b.paymentStatus === 'held')
          const released = allBookings.filter(b => b.paymentStatus === 'released')

          setPayments(released.map(b => ({
            id: b._id,
            service: b.serviceId?.title || 'Service',
            customer: b.customerId?.name || 'Customer',
            provider: b.providerId?.name || 'Provider',
            amount: b.totalAmount || 0,
            commission: b.adminCommission || 0,
            providerPayout: b.providerPayout || 0,
            status: b.paymentStatus,
            date: b.releasedAt || b.updatedAt
          })))

          setStats({
            totalRevenue: released.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
            totalCommission: released.reduce((sum, b) => sum + (b.adminCommission || 0), 0),
            totalProviderPayout: released.reduce((sum, b) => sum + (b.providerPayout || 0), 0),
            heldCount: held.length,
            releasedCount: released.length
          })
        }
      } catch (error) {
        console.error('Error fetching admin payments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [token, user, bookings])

  const dynamicAdminStats = [
    { 
      label: 'Total Revenue', 
      value: formatMoney(stats.totalRevenue || 0), 
      note: 'Gross booking volume', 
      icon: Banknote
    },
    { 
      label: 'Admin Commission (8%)', 
      value: formatMoney(stats.totalCommission || 0), 
      note: 'Platform earnings', 
      icon: TrendingUp 
    },
    { 
      label: 'Provider Payouts', 
      value: formatMoney(stats.totalProviderPayout || 0), 
      note: 'Net paid to providers', 
      icon: Users 
    },
    { 
      label: 'Held in Escrow', 
      value: String(stats.heldCount || 0), 
      note: 'Awaiting completion', 
      icon: Clock 
    },
  ]

  return (
    <div className="space-y-10">
      <PageSection
        eyebrow="Payments and reports"
        title="Payment Reports"
        description="Review escrow status, commission earnings, and provider payouts across all platform bookings."
        aside={(
          <Card className="p-6" hover={false}>
            <p className="section-eyebrow">Revenue snapshot</p>
            <p className="mt-4 text-4xl font-bold text-white">{formatMoney(stats.totalRevenue || 0)}</p>
            <p className="mt-2 text-slate-400">Gross volume from all bookings</p>
          </Card>
        )}
      >
        <StatGrid items={dynamicAdminStats} />
      </PageSection>

      {/* Escrow Status Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6" hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4">Held in Escrow</h3>
          <p className="text-3xl font-bold text-amber-400">{stats.heldCount || 0}</p>
          <p className="text-sm text-slate-400 mt-1">Bookings awaiting dual confirmation</p>
        </Card>
        <Card className="p-6" hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4">Released Payments</h3>
          <p className="text-3xl font-bold text-emerald-400">{stats.releasedCount || 0}</p>
          <p className="text-sm text-slate-400 mt-1">Completed and paid out</p>
        </Card>
      </div>

      <ListPanel 
        title="Payment Transactions" 
        description="All completed payments with commission breakdown." 
        items={payments.length ? payments.map((payment) => ({
          title: payment.service || 'Service',
          provider: `${payment.customer || 'Customer'} → ${payment.provider || 'Provider'}`,
          status: `${formatMoney(payment.amount || 0)} total | ${formatMoney(payment.commission || 0)} commission | ${formatMoney(payment.providerPayout || 0)} payout`,
          price: payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'
        })) : [{
          title: 'No released payments yet',
          provider: 'Payments will appear after both parties confirm completion',
          status: '—',
          price: '—'
        }]} 
      />
    </div>
  )
}
const ReviewsPage = () => {
  const { token, user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [pendingReviews, setPendingReviews] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const authHeaders = buildAuthHeaders(token, user)

  const loadReviews = async () => {
    setLoading(true)
    try {
      const data = await fetchReviewsRequest(authHeaders)
      setReviews(data.reviews || [])
      setPendingReviews(data.pendingReviews || [])
    } catch (fetchError) {
      console.error('Error fetching reviews:', fetchError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token || !user) {
      setLoading(false)
      return
    }
    loadReviews()
  }, [token, user])

  const openReviewForm = (booking) => {
    setActiveBooking(booking)
    setRating(5)
    setComment('')
    setError('')
    setSuccess('')
  }

  const closeReviewForm = () => {
    setActiveBooking(null)
    setComment('')
    setError('')
    setSuccess('')
  }

  const handleSubmitReview = async () => {
    if (!activeBooking) return
    if (!comment.trim()) {
      setError('Please add a short review comment.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await createReviewRequest(
        {
          serviceId: activeBooking.serviceId,
          bookingId: activeBooking.bookingId,
          rating,
          comment: comment.trim(),
        },
        authHeaders
      )
      setSuccess('Review submitted successfully.')
      closeReviewForm()
      await loadReviews()
    } catch (submitError) {
      console.error('Error submitting review:', submitError)
      setError(submitError.message || 'Failed to submit review.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (value) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${index < value ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">My Reviews</h1>
            <p className="text-gray-400 mt-2">See submitted reviews and leave feedback for completed bookings.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-semibold text-white">{reviews.length}</div>
              <div className="text-sm text-gray-500">Submitted reviews</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-white">{pendingReviews.length}</div>
              <div className="text-sm text-gray-500">Pending reviews</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your reviews...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Submitted Reviews</h2>
                  <p className="text-gray-500 text-sm">Reviews you have shared for completed services.</p>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
                  <p className="text-gray-400">No reviews yet. Complete a booking to post your first review.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{review.serviceTitle}</h3>
                          <p className="text-gray-400">Provider: {review.providerName}</p>
                        </div>
                        <div className="text-right">
                          {renderStars(review.rating)}
                          <p className="text-sm text-gray-500 mt-1">{review.date}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Pending Reviews</h2>
                  <p className="text-gray-500 text-sm">Leave feedback for your recently completed bookings.</p>
                </div>
                {pendingReviews.length > 0 && (
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">{pendingReviews.length} open</span>
                )}
              </div>

              {pendingReviews.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
                  <p className="text-gray-400">No completed bookings awaiting a review right now.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {pendingReviews.map((booking) => (
                    <div key={booking.bookingId} className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{booking.serviceTitle}</h3>
                          <p className="text-gray-400">Provider: {booking.providerName}</p>
                          <p className="text-sm text-gray-500 mt-1">Completed: {booking.completedAt || 'N/A'}</p>
                        </div>
                        <Button onClick={() => openReviewForm(booking)}>
                          Write Review
                        </Button>
                      </div>

                      {activeBooking?.bookingId === booking.bookingId && (
                        <div className="space-y-4 border-t border-white/10 pt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Rating</label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className={`rounded-full p-2 ${star <= rating ? 'bg-yellow-400 text-slate-950' : 'bg-white/5 text-gray-300'} transition`}
                                >
                                  <Star className="w-4 h-4" />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-300" htmlFor="reviewComment">Review</label>
                            <textarea
                              id="reviewComment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              rows={4}
                              className="mt-2 w-full rounded-3xl border border-white/10 bg-slate-950 px-4 py-3 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                              placeholder="Tell us about your experience"
                            />
                          </div>

                          {error && <p className="text-sm text-rose-400">{error}</p>}
                          {success && <p className="text-sm text-emerald-400">{success}</p>}

                          <div className="flex flex-wrap items-center gap-3">
                            <Button onClick={handleSubmitReview} disabled={submitting}>
                              {submitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                            <Button variant="ghost" onClick={closeReviewForm}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

const CustomerServiceDetails = () => {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const getProviderName = (provider) => {
    if (!provider) return "Unknown Provider";
    if (typeof provider === "string") return provider;
    if (typeof provider === "object" && provider.name) return provider.name;
    if (typeof provider === "object" && provider._id) return `Provider ${provider._id}`;
    return "Unknown Provider";
  }

  useEffect(() => {
    // Simulate API call to fetch service details
    setTimeout(() => {
      setService({
        id: id,
        name: 'Home Cleaning',
        description: 'Professional home cleaning services including deep cleaning, sanitizing, and regular upkeep.',
        price: 150,
        provider: 'John Doe',
        rating: 4.8,
        reviews: 124,
        category: 'Home Services',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85',
        features: ['Deep cleaning', 'Sanitization', 'Eco-friendly products', 'Insured and bonded'],
        availability: 'Same-day slots available'
      })
      setIsLoading(false)
    }, 1000)
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Service not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              src={service.image} 
              alt={String(service.name || 'service')}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h1 className="text-3xl font-bold text-white mb-4">{String(service.name || '—')}</h1>
            <p className="text-gray-300 mb-6">{String(service.description || '—')}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(Number(service.rating) || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                  />
                ))}
                <span className="text-white ml-2">{String(service.rating || '0')}</span>
              </div>
              <span className="text-gray-400">({String(service.reviews || '0')} reviews)</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Provider:</span>
                <span className="text-white">{getProviderName(service.provider)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category:</span>
                <span className="text-white">{String(service.categoryLabel || service.category || service.slug || '—')}</span>
              </div>
                          </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Book This Service</h2>
            
            <div className="text-3xl font-bold text-cyan-400 mb-6">
              ${String(service.price || '0')}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
              <ul className="space-y-2">
                {(service.features || []).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    {String(feature || '—')}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/customer/booking/${service.id}`)}
                className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
              >
                Book Now
              </button>
              <button
                onClick={() => navigate('/browse-services')}
                className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// PageLibrary component that exports all individual components
const PageLibrary = {
  // Available components
  CustomerProfileSettings,
  EditServicePage,
  ManageServicesPage,
  BookingRequestsPage,
  ActiveJobsPage,
  EarningsPage,
  ProviderProfilePage,
  AdminProfileSettings,
  LiveLocationTogglePage,
  ApproveProvidersPage,
  AdminManageServicesPage,
  AllBookingsPage,
  PaymentsReportsPage,
  LiveMonitoringMapPage,
  // Additional components for routing
  BookingFormPage,
  CustomerDashboard,
  ProviderDashboard,
  AdminDashboard,
  LandingPage,
  LiveTrackingPage,
  MyBookingsPage,
  PaymentsPage,
  ReviewsPage,
  CustomerServiceDetails,
  ServiceSubcategoryPage,
  ProviderServiceManagementPage,
  ManageUsersPage,
}

// Export individual components for routing
export { CustomerProfileSettings, EditServicePage, ManageServicesPage, BookingRequestsPage, ActiveJobsPage, EarningsPage, ProviderProfilePage, AdminProfileSettings, LiveLocationTogglePage, ApproveProvidersPage, AdminManageServicesPage, AllBookingsPage, PaymentsReportsPage, LiveMonitoringMapPage, BookingFormPage, CustomerDashboard, ProviderDashboard, AdminDashboard, LandingPage, LiveTrackingPage, MyBookingsPage, PaymentsPage, ReviewsPage, CustomerServiceDetails, ServiceSubcategoryPage, ProviderServiceManagementPage, ManageUsersPage }

export default PageLibrary
