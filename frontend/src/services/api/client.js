// import {
//   ADMIN_SEED_EMAIL,
//   ADMIN_SEED_PASSWORD,
//   createId,
//   delay,
//   publicUser,
//   readMockDb,
//   writeMockDb,
// } from './mockDb'
// import { BOOKING_STATUS } from '../../utils/bookingStatus'
// import { platformFeeAmount, providerNetAmount } from '../../utils/earnings'

// const API_BASE_URL = 'http://localhost:5000' // Force real API usage

// const ADMIN_LOGIN = {
//   email: ADMIN_SEED_EMAIL,
//   password: ADMIN_SEED_PASSWORD,
// }

// const createToken = (user) => `mock|${user.id}`

// const MIN_SERVICE_IMAGES = 2
// const MAX_SERVICE_IMAGES = 5

// const withServiceImages = (service) => {
//   if (!service) {
//     return service
//   }
//   const list = Array.isArray(service.images) && service.images.length
//     ? service.images.filter(Boolean)
//     : service.image
//       ? [service.image]
//       : []
//   return {
//     ...service,
//     images: list,
//     image: list[0] || service.image || '',
//   }
// }

// const validateServiceImageList = (images, { required = false } = {}) => {
//   const list = Array.isArray(images) ? images.filter(Boolean) : []
//   if (required && (list.length < MIN_SERVICE_IMAGES || list.length > MAX_SERVICE_IMAGES)) {
//     throw new Error(`Provide between ${MIN_SERVICE_IMAGES} and ${MAX_SERVICE_IMAGES} images for this service.`)
//   }
//   if (!required && list.length && (list.length < MIN_SERVICE_IMAGES || list.length > MAX_SERVICE_IMAGES)) {
//     throw new Error(`Use between ${MIN_SERVICE_IMAGES} and ${MAX_SERVICE_IMAGES} images.`)
//   }
//   return list
// }

// /** Digits only; used to match CNIC across formats. */
// const normalizeProviderCnic = (cnic) => String(cnic || '').replace(/\D/g, '')

// const normalizeAccountEmail = (email) => String(email || '').trim().toLowerCase()

// const ADMIN_USER_PATCH_KEYS = ['isApproved', 'rejectionReason', 'isSuspended']

// const providerCnicIsBlocked = (state, cnic) => {
//   const key = normalizeProviderCnic(cnic)
//   if (key.length < 5) {
//     return false
//   }
//   return (state.blockedProviderCnics || []).includes(key)
// }

// const parseQuery = (path) => {
//   const [pathname, query = ''] = path.split('?')
//   const params = new URLSearchParams(query)
//   return { pathname, params }
// }

// const getCurrentUser = (headers) => {
//   const userId = headers?.['x-user-id']
//   const state = readMockDb()

//   if (userId) {
//     // First check mock database
//     let user = state.users.find((user) => user.id === userId)
    
//     // If not found in mock DB, check localStorage registered users
//     if (!user) {
//       try {
//         const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
//         user = registeredUsers.find((user) => user.id === userId)
//       } catch (error) {
//         console.error('Error reading registered users:', error)
//       }
//     }
    
//     return user || null
//   }

//   const authHeader = headers?.Authorization || headers?.authorization

//   if (!authHeader) {
//     return null
//   }

//   const token = authHeader.replace(/^Bearer\s+/i, '')
  
//   if (token.startsWith('mock|')) {
//     const id = token.slice(5)
//     let user = state.users.find((user) => user.id === id)
    
//     // If not found in mock DB, check localStorage registered users
//     if (!user) {
//       try {
//         const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
//         user = registeredUsers.find((user) => user.id === id)
//       } catch (error) {
//         console.error('Error reading registered users:', error)
//       }
//     }
    
//     return user || null
//   }

//   // Handle our custom token format: role_token_userId_timestamp
//   if (token.includes('_token_')) {
//     // For our custom tokens, extract the user ID from the token
//     try {
//       const tokenParts = token.split('_token_')
//       const userId = tokenParts[2] // role_token_userId_timestamp
      
//       const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      
//       // Find user by ID
//       const user = registeredUsers.find((user) => user.id === userId)
      
//       return user || null
//     } catch (error) {
//       console.error('Error reading registered users for custom token:', error)
//       return null
//     }
//   }

//   const legacyParts = token.split('-')
//   const legacyId = legacyParts.slice(3).join('-') || legacyParts[2]
//   let user = state.users.find((user) => user.id === legacyId)
  
//   // If not found in mock DB, check localStorage registered users
//   if (!user) {
//     try {
//       const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
//       user = registeredUsers.find((user) => user.id === legacyId)
//     } catch (error) {
//       console.error('Error reading registered users:', error)
//     }
//   }
  
//   return user || null
// }

// const mockRequest = async ({ path, method = 'GET', data, headers }) => {
//   // Remove /api prefix if present
//   let normalizedPath = path.startsWith('/api') ? path.replace('/api', '') : path
//   const { pathname, params } = parseQuery(normalizedPath)
//   const normalizedMethod = method.toUpperCase()

//   if (pathname === '/auth/register' && normalizedMethod === 'POST') {
//     if (data.role === 'admin') {
//       throw new Error('Admin accounts cannot be registered.')
//     }

//     const currentState = readMockDb()
//     const emailNorm = normalizeAccountEmail(data.email)
//     const existingUser = currentState.users.find((user) => user.email.toLowerCase() === emailNorm)

//     if (existingUser) {
//       throw new Error('An account with this email already exists.')
//     }

//     if (data.role === 'provider' && providerCnicIsBlocked(currentState, data.cnic)) {
//       throw new Error('This CNIC cannot register as a provider. Contact support if you believe this is a mistake.')
//     }

//     const newUser = {
//       id: createId(data.role),
//       name: data.fullName,
//       email: emailNorm,
//       password: data.password,
//       role: data.role,
//       phone: data.phone,
//       city: data.city,
//       cnic: data.cnic || '',
//       cnicFileName: data.cnicFileName || '',
//       cnicDocumentDataUrl: typeof data.cnicDocumentDataUrl === 'string' && data.cnicDocumentDataUrl.startsWith('data:image/')
//         ? data.cnicDocumentDataUrl
//         : '',
//       profileImageDataUrl: '',
//       isApproved: false,
//       rejectionReason: '',
//       isSuspended: false,
//     }

//     writeMockDb((state) => ({
//       ...state,
//       users: [...state.users, newUser],
//       notifications: [
//         ...state.notifications,
//         {
//           id: createId('notification'),
//           userId: 'admin-super',
//           title: 'New account pending approval',
//           body: `${newUser.name} (${data.email}) registered as ${data.role}. Open Approvals to approve or reject.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         },
//       ],
//     }))

//     return delay({
//       pendingApproval: true,
//       user: publicUser(newUser),
//     })
//   }

//   if (pathname === '/auth/login' && normalizedMethod === 'POST') {
//     const em = data.email?.trim().toLowerCase()
//     const isAdminEmailLogin = em === ADMIN_LOGIN.email.toLowerCase() && data.password === ADMIN_LOGIN.password
//     if (isAdminEmailLogin) {
//       if (data.role && data.role !== 'admin') {
//         throw new Error('This account is an admin login. Choose Admin as your role, then sign in.')
//       }
//       let adminUser = readMockDb().users.find(
//         (u) => u.id === 'admin-super' || u.email?.toLowerCase() === ADMIN_LOGIN.email.toLowerCase(),
//       )
//       if (!adminUser) {
//         writeMockDb((state) => ({
//           ...state,
//           users: [
//             {
//               id: 'admin-super',
//               name: 'Admin',
//               email: ADMIN_SEED_EMAIL,
//               password: ADMIN_SEED_PASSWORD,
//               role: 'admin',
//               phone: '+92 300 0000000',
//               city: 'Karachi',
//               isApproved: true,
//               profileImageDataUrl: '',
//             },
//             ...(state.users || []),
//           ],
//         }))
//         adminUser = readMockDb().users.find((u) => u.id === 'admin-super')
//       }
//       return delay({
//         token: createToken(adminUser),
//         user: publicUser(adminUser),
//       })
//     }

//     const currentState = readMockDb()
//     const user = currentState.users.find((entry) => entry.email.toLowerCase() === em)

//     if (!user || user.password !== data.password) {
//       throw new Error('Invalid email or password.')
//     }

//     if (user.isSuspended) {
//       throw new Error('Your account has been suspended. Contact support for assistance.')
//     }

//     if (user.role === 'admin') {
//       throw new Error('Use your admin email and password to sign in.')
//     }

//     if (data.role && user.role !== data.role) {
//       throw new Error(`This account is registered as a ${user.role}. Pick the matching role to continue.`)
//     }

//     if (user.rejectionReason) {
//       throw new Error('Your registration was not approved. Contact support if you believe this is a mistake.')
//     }

//     if (!user.isApproved) {
//       throw new Error('Your account is pending admin approval. You will be able to sign in after approval.')
//     }

//     return delay({
//       token: createToken(user),
//       user: publicUser(user),
//     })
//   }

//   if (pathname === '/auth/profile' && normalizedMethod === 'PATCH') {
//     const currentUser = getCurrentUser(headers)
//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }
//     const allowedKeys = ['name', 'phone', 'city', 'profileImageDataUrl']
//     const patch = {}
//     allowedKeys.forEach((k) => {
//       if (data[k] !== undefined) {
//         patch[k] = data[k]
//       }
//     })
//     if (Object.keys(patch).length === 0) {
//       throw new Error('Nothing to update.')
//     }
//     if (patch.profileImageDataUrl !== undefined && patch.profileImageDataUrl) {
//       const v = String(patch.profileImageDataUrl)
//       if (!v.startsWith('data:image/')) {
//         throw new Error('Profile photo must be an image (JPG, PNG, or WebP).')
//       }
//       if (v.length > 550000) {
//         throw new Error('Photo is too large. Use a smaller image (about 400KB or less).')
//       }
//     }
//     let updatedUser = null
//     writeMockDb((state) => ({
//       ...state,
//       users: state.users.map((u) => {
//         if (u.id !== currentUser.id) {
//           return u
//         }
//         updatedUser = { ...u, ...patch }
//         if (patch.profileImageDataUrl === '') {
//           updatedUser.profileImageDataUrl = ''
//         }
//         return updatedUser
//       }),
//     }))
//     if (!updatedUser) {
//       throw new Error('User not found.')
//     }
//     return delay(publicUser(updatedUser))
//   }

//   const serviceByIdMatch = pathname.match(/^\/services\/([^/?]+)$/)

//   if (serviceByIdMatch && normalizedMethod === 'GET') {
//     const currentState = readMockDb()
//     const serviceId = serviceByIdMatch[1]
//     const found = currentState.services.find((s) => s.id === serviceId || s.slug === serviceId)
//     if (!found) {
//       throw new Error('Service not found.')
//     }
//     return delay(withServiceImages(found))
//   }

//   if (serviceByIdMatch && normalizedMethod === 'PATCH') {
//     const currentUser = getCurrentUser(headers)
//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }
//     const serviceId = serviceByIdMatch[1]
//     const currentState = readMockDb()
//     const existing = currentState.services.find((s) => s.id === serviceId)
//     if (!existing) {
//       throw new Error('Service not found.')
//     }
//     const isOwner = existing.providerId === currentUser.id
//     const isAdmin = currentUser.role === 'admin'
//     if (!isOwner && !isAdmin) {
//       throw new Error('You can only update your own services.')
//     }
//     if (isOwner && currentUser.role === 'provider') {
//       const dbUser = currentState.users.find((u) => u.id === currentUser.id)
//       if (dbUser?.isSuspended) {
//         throw new Error('Your account is suspended. You cannot update services.')
//       }
//       if (providerCnicIsBlocked(currentState, dbUser?.cnic)) {
//         throw new Error('This provider identity cannot update services. Contact support.')
//       }
//     }
//     let nextImages = withServiceImages(existing).images
//     if (data.images !== undefined) {
//       nextImages = validateServiceImageList(data.images, { required: true })
//     }
//     const { images: _ignoreImages, image: _ignoreImage, ...restPatch } = data
//     const merged = {
//       ...existing,
//       ...restPatch,
//       images: nextImages,
//       image: nextImages[0] || '',
//     }
//     const oldSlug = existing.slug
//     const newSlug = merged.slug
//     const slugChanged = newSlug !== undefined && newSlug !== oldSlug

//     writeMockDb((state) => ({
//       ...state,
//       services: state.services.map((s) => (s.id === serviceId ? merged : s)),
//       bookings: slugChanged
//         ? state.bookings.map((b) => (b.serviceId === oldSlug ? { ...b, serviceId: newSlug } : b))
//         : state.bookings,
//     }))
//     return delay(withServiceImages(merged))
//   }

//   if (serviceByIdMatch && normalizedMethod === 'DELETE') {
//     const currentUser = getCurrentUser(headers)
//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }
//     const serviceId = serviceByIdMatch[1]
//     const currentState = readMockDb()
//     const existing = currentState.services.find((s) => s.id === serviceId)
//     if (!existing) {
//       throw new Error('Service not found.')
//     }
//     const isOwner = existing.providerId === currentUser.id
//     const isAdmin = currentUser.role === 'admin'
//     if (!isOwner && !isAdmin) {
//       throw new Error('You can only delete your own services.')
//     }
//     if (isOwner && currentUser.role === 'provider') {
//       const dbUser = currentState.users.find((u) => u.id === currentUser.id)
//       if (dbUser?.isSuspended) {
//         throw new Error('Your account is suspended. You cannot delete services.')
//       }
//     }
//     writeMockDb((state) => ({
//       ...state,
//       services: state.services.filter((s) => s.id !== serviceId),
//       bookings: state.bookings.filter(
//         (b) => b.serviceId !== existing.slug && b.serviceId !== existing.id,
//       ),
//     }))
//     return delay({ ok: true, id: serviceId })
//   }

//   if (pathname === '/services' && normalizedMethod === 'GET') {
//     const currentState = readMockDb()
//     const search = params.get('search')?.toLowerCase() || ''
//     const category = params.get('category')?.toLowerCase() || ''
//     const group = params.get('group')?.toLowerCase() || ''
//     const providerId = params.get('providerId')

//     const filteredServices = currentState.services.filter((service) => {
//       const matchesSearch = search
//         ? `${service.title} ${service.description} ${service.category} ${service.group || ''}`.toLowerCase().includes(search)
//         : true
//       const matchesCategory = category ? service.slug === category || service.category.toLowerCase() === category : true
//       const matchesGroup = group ? String(service.group || '').toLowerCase() === group : true
//       const matchesProvider = providerId ? service.providerId === providerId : true
//       return matchesSearch && matchesCategory && matchesGroup && matchesProvider
//     })

//     return delay(filteredServices.map(withServiceImages))
//   }

//   if (pathname === '/services' && normalizedMethod === 'POST') {
    
//     // Check for any undefined or empty required fields
//     const requiredFields = ['title', 'category', 'description', 'basePrice', 'eta', 'images']
//     const missingFields = requiredFields.filter(field => {
//       const value = data[field]
//       return value === undefined || value === null || value === ''
//     })
    
//     if (missingFields.length > 0) {
//       throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
//     }
    
//     const currentUser = getCurrentUser(headers)

//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }

//     if (currentUser.role !== 'provider') {
//       throw new Error('Only providers can create service listings.')
//     }

//     const currentState = readMockDb()
//     const dbUser = currentState.users.find((u) => u.id === currentUser.id)
//     if (dbUser?.isSuspended) {
//       throw new Error('Your account is suspended. You cannot add a service.')
//     }
//     if (providerCnicIsBlocked(currentState, dbUser?.cnic)) {
//       throw new Error('This provider identity cannot publish services. Contact support.')
//     }
//     const listingsForProvider = currentState.services.filter((s) => s.providerId === currentUser.id).length
//     if (listingsForProvider >= 1) {
//       throw new Error('You already have a service listing. Edit it from Manage services, or delete it before creating another.')
//     }

//     if (!Array.isArray(data.images) || data.images.length < MIN_SERVICE_IMAGES) {
//       throw new Error(`Include an "images" array with ${MIN_SERVICE_IMAGES}–${MAX_SERVICE_IMAGES} images (file uploads or URLs).`)
//     }
    
//     const imageList = validateServiceImageList(data.images, { required: true })

//     const newService = {
//       id: createId('service'),
//       slug: data.category,
//       group: data.group || 'home',
//       providerId: currentUser.id,
//       title: data.title,
//       category: data.categoryLabel || data.category,
//       description: data.description,
//       images: imageList,
//       image: imageList[0],
//       price: Number(data.price), // Backend expects price
//       duration: data.duration, // Backend expects duration
//       availability: data.availability || '',
//       location: data.location || '',
//       rating: 0,
//       providerCount: 1,
//       isApproved: false,
//       // Additional fields from frontend form
//       serviceArea: data.serviceArea || 'Bahawalpur',
//       requirements: data.requirements || '',
//       features: data.features || [],
//       keywords: data.keywords || [],
//       // Metadata fields
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       status: 'pending', // pending, approved, rejected
//       // Provider info
//       providerName: currentUser.name || 'Provider',
//       providerEmail: currentUser.email || '',
//       providerPhone: currentUser.phone || '',
//       // Service details (using correct field names)
//       priceRange: `${data.price} - ${Math.ceil(Number(data.price) * 1.5)}`,
//       serviceType: data.group || 'home',
//       // Location details
//       city: 'Bahawalpur',
//       coordinates: { lat: 29.3943, lng: 71.6837 }, // Default Bahawalpur coordinates
//       // Additional metadata
//       views: 0,
//       bookings: 0,
//       reviews: [],
//       averageRating: 0,
//       isActive: false, // Becomes true after admin approval
//       isFeatured: false,
//     }

//     writeMockDb((state) => ({
//       ...state,
//       services: [newService, ...state.services],
//     }))

//     return delay(withServiceImages(newService))
//   }

//   if (pathname === '/bookings' && normalizedMethod === 'GET') {
//     const currentUser = getCurrentUser(headers)
//     const currentState = readMockDb()

//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }

//     const bookings = currentState.bookings.filter((booking) => {
//       if (currentUser.role === 'customer') {
//         return booking.customerId === currentUser.id
//       }
//       if (currentUser.role === 'provider') {
//         return booking.providerId === currentUser.id
//       }
//       return true
//     })

//     return delay(bookings)
//   }

//   if (pathname === '/bookings' && normalizedMethod === 'POST') {
//     const currentUser = getCurrentUser(headers)
//     const currentState = readMockDb()

//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }

//     const service = currentState.services.find((entry) => entry.id === data.serviceId || entry.slug === data.serviceId)

//     if (!service) {
//       throw new Error('Service not found.')
//     }

//     if (!service.providerId) {
//       throw new Error('No provider is assigned to this service yet. Choose another category that has an active provider.')
//     }

//     const newBooking = {
//       id: createId('booking'),
//       customerId: currentUser.id,
//       providerId: service.providerId,
//       serviceId: service.slug,
//       serviceTitle: service.title,
//       status: BOOKING_STATUS.PAYMENT_PENDING,
//       paymentStatus: 'unpaid',
//       scheduledDate: data.date,
//       scheduledTime: data.time,
//       address: data.address,
//       amount: Number(data.amount || service.basePrice),
//       packageType: data.packageType,
//       tracking: {
//         lat: 31.5204,
//         lng: 74.3587,
//         etaMinutes: 25,
//       },
//     }

//     writeMockDb((state) => ({
//       ...state,
//       bookings: [newBooking, ...state.bookings],
//       notifications: [
//         ...state.notifications,
//         {
//           id: createId('notification'),
//           userId: currentUser.id,
//           title: 'Booking created',
//           body: `${service.title} is reserved. Complete payment to send the request to your provider.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         },
//         {
//           id: createId('notification'),
//           userId: newBooking.providerId,
//           title: 'New booking (payment pending)',
//           body: `${currentUser.name} started booking ${service.title}.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         },
//       ],
//     }))

//     return delay(newBooking)
//   }

//   if (pathname.startsWith('/bookings/') && normalizedMethod === 'PATCH') {
//     const bookingId = pathname.split('/')[2]
//     const currentUser = getCurrentUser(headers)

//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }

//     const existing = readMockDb().bookings.find((b) => b.id === bookingId)
//     if (!existing) {
//       throw new Error('Booking not found.')
//     }
//     if (currentUser.role === 'provider' && existing.providerId !== currentUser.id) {
//       throw new Error('Unauthorized')
//     }
//     if (currentUser.role === 'customer' && existing.customerId !== currentUser.id) {
//       throw new Error('Unauthorized')
//     }

//     let updatedBooking = null
//     const extraNotifications = []

//     writeMockDb((state) => {
//       const booking = state.bookings.find((b) => b.id === bookingId)
//       if (!booking) {
//         return state
//       }

//       let next = { ...booking, ...data, tracking: { ...booking.tracking, ...(data.tracking || {}) } }

//       if (data.status === BOOKING_STATUS.CANCELLED && currentUser.role === 'customer') {
//         next = {
//           ...next,
//           status: BOOKING_STATUS.CANCELLED,
//           cancellationFeePercent: 8,
//           cancellationNote: 'An 8% service fee was deducted from your refund (simulation).',
//           paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus,
//         }
//         extraNotifications.push({
//           id: createId('notification'),
//           userId: booking.providerId,
//           title: 'Booking cancelled',
//           body: `${booking.serviceTitle} was cancelled by the customer.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         })
//       }

//       if (data.status === BOOKING_STATUS.ACCEPTED && currentUser.role === 'provider') {
//         extraNotifications.push({
//           id: createId('notification'),
//           userId: booking.customerId,
//           title: 'Booking accepted',
//           body: `Your provider accepted ${booking.serviceTitle}. You can track and chat during the job.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         })
//       }

//       if (data.status === BOOKING_STATUS.REJECTED && currentUser.role === 'provider') {
//         next = {
//           ...next,
//           status: BOOKING_STATUS.REJECTED,
//           paymentStatus: booking.paymentStatus === 'paid' ? 'refunded' : booking.paymentStatus,
//         }
//         extraNotifications.push({
//           id: createId('notification'),
//           userId: booking.customerId,
//           title: 'Booking declined',
//           body: `The provider could not take ${booking.serviceTitle}. Any payment will be refunded (simulation).`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         })
//       }

//       if (data.status === BOOKING_STATUS.IN_PROGRESS && currentUser.role === 'provider') {
//         extraNotifications.push({
//           id: createId('notification'),
//           userId: booking.customerId,
//           title: 'Service in progress',
//           body: `Your professional started work on ${booking.serviceTitle}.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         })
//       }

//       if (data.status === BOOKING_STATUS.COMPLETED && currentUser.role === 'provider') {
//         extraNotifications.push({
//           id: createId('notification'),
//           userId: booking.customerId,
//           title: 'Service completed',
//           body: `${booking.serviceTitle} is marked complete. Please leave a review.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         })
//       }

//       updatedBooking = next

//       return {
//         ...state,
//         bookings: state.bookings.map((b) => (b.id === bookingId ? next : b)),
//         notifications: [...state.notifications, ...extraNotifications],
//       }
//     })

//     if (!updatedBooking) {
//       throw new Error('Booking not found.')
//     }

//     return delay(updatedBooking)
//   }

//   if (pathname === '/messages' && normalizedMethod === 'GET') {
//     const currentUser = getCurrentUser(headers)
//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }
//     const bookingId = params.get('bookingId')
//     const currentState = readMockDb()
//     const booking = currentState.bookings.find((b) => b.id === bookingId)
//     if (!booking) {
//       return delay([])
//     }
//     if (currentUser.role === 'customer' && booking.customerId !== currentUser.id) {
//       throw new Error('Unauthorized')
//     }
//     if (currentUser.role === 'provider' && booking.providerId !== currentUser.id) {
//       throw new Error('Unauthorized')
//     }
//     const msgs = currentState.messages.filter((m) => m.bookingId === bookingId)
//     return delay(msgs)
//   }

//   if (pathname === '/messages' && normalizedMethod === 'POST') {
//     const currentUser = getCurrentUser(headers)
//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }
//     const booking = readMockDb().bookings.find((b) => b.id === data.bookingId)
//     if (!booking) {
//       throw new Error('Booking not found.')
//     }
//     if (currentUser.role === 'customer' && booking.customerId !== currentUser.id) {
//       throw new Error('Unauthorized')
//     }
//     if (currentUser.role === 'provider' && booking.providerId !== currentUser.id) {
//       throw new Error('Unauthorized')
//     }

//     const message = {
//       id: createId('message'),
//       bookingId: data.bookingId,
//       senderId: currentUser.id,
//       senderRole: currentUser.role,
//       body: data.body,
//       sentAt: new Date().toISOString(),
//     }

//     writeMockDb((state) => ({
//       ...state,
//       messages: [...state.messages, message],
//     }))

//     return delay(message)
//   }

//   if (pathname === '/payments/checkout' && normalizedMethod === 'POST') {
//     const currentState = readMockDb()
//     const booking = currentState.bookings.find((entry) => entry.id === data.bookingId)

//     if (!booking) {
//       throw new Error('Booking not found.')
//     }

//     const payment = {
//       id: createId('payment'),
//       bookingId: booking.id,
//       amount: booking.amount,
//       status: 'requires_confirmation',
//       sessionId: createId('stripe-session'),
//       clientSecret: `${createId('pi')}_secret_${createId('secret')}`,
//     }

//     writeMockDb((state) => ({
//       ...state,
//       payments: [payment, ...state.payments.filter((entry) => entry.bookingId !== booking.id)],
//       bookings: state.bookings.map((b) => (b.id === booking.id ? { ...b, status: BOOKING_STATUS.PAYMENT_SUCCESSFUL } : b)),
//     }))

//     return delay(payment)
//   }

//   if (pathname === '/payments/confirm' && normalizedMethod === 'POST') {
//     let confirmedPayment = null
//     const bookingSnapshot = readMockDb().bookings.find((b) => b.id === data.bookingId)
//     const gross = Number(bookingSnapshot?.amount || 0)

//     writeMockDb((state) => ({
//       ...state,
//       payments: state.payments.map((payment) => {
//         if (payment.bookingId !== data.bookingId) {
//           return payment
//         }

//         confirmedPayment = {
//           ...payment,
//           status: 'paid',
//           providerShare: providerNetAmount(gross),
//           platformFee: platformFeeAmount(gross),
//         }
//         return confirmedPayment
//       }),
//       bookings: state.bookings.map((booking) => (
//         booking.id === data.bookingId
//           ? {
//               ...booking,
//               paymentStatus: 'paid',
//               status: BOOKING_STATUS.PENDING_PROVIDER,
//             }
//           : booking
//       )),
//       notifications: [
//         ...state.notifications,
//         {
//           id: createId('notification'),
//           userId: bookingSnapshot?.providerId,
//           title: 'Paid booking',
//           body: `Payment received for ${bookingSnapshot?.serviceTitle || 'a service'}. Please accept or decline.`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         },
//       ],
//     }))

//     return delay(confirmedPayment)
//   }

//   if (pathname === '/payments' && normalizedMethod === 'GET') {
//     const currentUser = getCurrentUser(headers)
//     const currentState = readMockDb()

//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }

//     const relatedPayments = currentState.payments.filter((payment) => {
//       const booking = currentState.bookings.find((entry) => entry.id === payment.bookingId)

//       if (!booking) {
//         return false
//       }

//       if (currentUser.role === 'customer') {
//         return booking.customerId === currentUser.id
//       }

//       if (currentUser.role === 'provider') {
//         return booking.providerId === currentUser.id
//       }

//       return true
//     })

//     return delay(relatedPayments)
//   }

//   if (pathname === '/reviews' && normalizedMethod === 'GET') {
//     const currentUser = getCurrentUser(headers)
//     const currentState = readMockDb()

//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }

//     const reviews = currentUser.role === 'customer'
//       ? currentState.reviews.filter((review) => review.customerId === currentUser.id)
//       : currentState.reviews

//     return delay(reviews)
//   }

//   if (pathname === '/reviews' && normalizedMethod === 'POST') {
//     const currentUser = getCurrentUser(headers)

//     if (!currentUser) {
//       throw new Error('Unauthorized')
//     }

//     const state = readMockDb()
//     const booking = state.bookings.find((b) => b.id === data.bookingId)

//     if (!booking || booking.customerId !== currentUser.id) {
//       throw new Error('Booking not found.')
//     }

//     if (booking.status !== BOOKING_STATUS.COMPLETED) {
//       throw new Error('You can only review completed bookings.')
//     }

//     const review = {
//       id: createId('review'),
//       bookingId: data.bookingId,
//       serviceId: data.serviceId,
//       providerId: data.providerId,
//       customerId: currentUser.id,
//       rating: data.rating,
//       comment: data.comment,
//       createdAt: new Date().toISOString(),
//     }

//     writeMockDb((s) => ({
//       ...s,
//       reviews: [review, ...s.reviews],
//     }))

//     return delay(review)
//   }

//   if (pathname === '/admin/overview' && normalizedMethod === 'GET') {
//     const currentState = readMockDb()

//     const pendingApproval = (u) => (
//       u.role !== 'admin'
//       && !u.isSuspended
//       && !u.isApproved
//     )

//     return delay({
//       users: currentState.users.length,
//       services: currentState.services.length,
//       bookings: currentState.bookings.length,
//       revenue: currentState.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
//       pendingProviders: currentState.users.filter((user) => user.role === 'provider' && pendingApproval(user)).length,
//       pendingCustomers: currentState.users.filter((user) => user.role === 'customer' && pendingApproval(user)).length,
//       pendingRegistrations: currentState.users.filter((user) => pendingApproval(user)).length,
//     })
//   }

//   if (pathname === '/admin/users' && normalizedMethod === 'GET') {
//     return delay(readMockDb().users.map(publicUser))
//   }

//   if (pathname === '/admin/users' && normalizedMethod === 'POST') {
//     const currentUser = getCurrentUser(headers)
//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Unauthorized')
//     }
//     if (data.role === 'admin') {
//       throw new Error('Cannot create admin accounts here.')
//     }
//     if (!['customer', 'provider'].includes(data.role)) {
//       throw new Error('Role must be customer or provider.')
//     }
//     const em = normalizeAccountEmail(data.email)
//     const state = readMockDb()
//     if (state.users.some((u) => u.email.toLowerCase() === em)) {
//       throw new Error('An account with this email already exists.')
//     }
//     if (data.role === 'provider') {
//       const cnicKey = normalizeProviderCnic(data.cnic)
//       if (cnicKey.length < 5) {
//         throw new Error('Service providers need a valid CNIC (use at least 5 digits).')
//       }
//       if (providerCnicIsBlocked(state, data.cnic)) {
//         throw new Error('This CNIC cannot be used for a provider account.')
//       }
//     }
//     const newUser = {
//       id: createId(data.role),
//       name: data.fullName || data.name,
//       email: em,
//       password: data.password,
//       role: data.role,
//       phone: data.phone || '',
//       city: data.city || '',
//       cnic: data.cnic || '',
//       cnicFileName: data.cnicFileName || '',
//       cnicDocumentDataUrl: typeof data.cnicDocumentDataUrl === 'string' && data.cnicDocumentDataUrl.startsWith('data:image/')
//         ? data.cnicDocumentDataUrl
//         : '',
//       profileImageDataUrl:
//         typeof data.profileImageDataUrl === 'string' && data.profileImageDataUrl.startsWith('data:image/')
//           ? data.profileImageDataUrl
//           : '',
//       isApproved: data.isApproved !== false,
//       rejectionReason: '',
//       isSuspended: false,
//     }
//     writeMockDb((s) => ({
//       ...s,
//       users: [...s.users, newUser],
//     }))
//     return delay(publicUser(newUser))
//   }

//   const adminUserIdMatch = pathname.match(/^\/admin\/users\/([^/?]+)$/)

//   if (adminUserIdMatch && normalizedMethod === 'DELETE') {
//     const currentUser = getCurrentUser(headers)
//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Unauthorized')
//     }
//     const userId = adminUserIdMatch[1]
//     if (userId === currentUser.id) {
//       throw new Error('You cannot delete your own account.')
//     }
//     const state = readMockDb()
//     const target = state.users.find((u) => u.id === userId)
//     if (!target) {
//       throw new Error('User not found.')
//     }
//     if (target.role === 'admin') {
//       throw new Error('Cannot delete admin accounts.')
//     }
//     writeMockDb((s) => ({
//       ...s,
//       users: s.users.filter((u) => u.id !== userId),
//       services: s.services.filter((svc) => svc.providerId !== userId),
//       bookings: s.bookings.filter((b) => b.customerId !== userId && b.providerId !== userId),
//       notifications: s.notifications.filter((n) => n.userId !== userId),
//     }))
//     return delay({ ok: true, id: userId })
//   }

//   if (pathname.startsWith('/admin/users/') && normalizedMethod === 'PATCH') {
//     const currentUser = getCurrentUser(headers)
//     const userId = pathname.split('/')[3]

//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Unauthorized')
//     }

//     const patchData = {}
//     ADMIN_USER_PATCH_KEYS.forEach((key) => {
//       if (data[key] !== undefined) {
//         patchData[key] = data[key]
//       }
//     })

//     if (Object.keys(patchData).length === 0) {
//       throw new Error('Admins can only change approval, rejection reason, or suspension for this account.')
//     }

//     let updatedUser = null

//     writeMockDb((state) => {
//       const userBefore = state.users.find((u) => u.id === userId)
//       const users = state.users.map((user) => {
//         if (user.id !== userId) {
//           return user
//         }

//         const merged = { ...user, ...patchData }
//         if (merged.isApproved === true) {
//           merged.rejectionReason = ''
//         }
//         updatedUser = merged

//         return updatedUser
//       })

//       if (!updatedUser || !userBefore) {
//         return state
//       }

//       let notifications = [...state.notifications]
//       const becameApproved = updatedUser.isApproved && !userBefore.isApproved
//       const rejectionText = patchData.rejectionReason && String(patchData.rejectionReason).trim()
//       const becameRejectedNew = rejectionText && !updatedUser.isApproved && !userBefore.isApproved
//       const approvalRevoked = rejectionText && !updatedUser.isApproved && userBefore.isApproved

//       if (becameApproved) {
//         notifications = [
//           ...notifications,
//           {
//             id: createId('notification'),
//             userId,
//             title: 'Account approved',
//             body: 'Your ServiceHive account is approved. You can sign in now.',
//             read: false,
//             createdAt: new Date().toISOString(),
//           },
//         ]
//       } else if (becameRejectedNew) {
//         notifications = [
//           ...notifications,
//           {
//             id: createId('notification'),
//             userId,
//             title: 'Registration not approved',
//             body: `Your application was not approved: ${rejectionText}`,
//             read: false,
//             createdAt: new Date().toISOString(),
//           },
//         ]
//       } else if (approvalRevoked) {
//         notifications = [
//           ...notifications,
//           {
//             id: createId('notification'),
//             userId,
//             title: 'Account access revoked',
//             body: `Your account is no longer approved: ${rejectionText}`,
//             read: false,
//             createdAt: new Date().toISOString(),
//           },
//         ]
//       }

//       let blockedProviderCnics = [...(state.blockedProviderCnics || [])]
//       const suspendingNow = patchData.isSuspended === true && !userBefore.isSuspended
//       if (suspendingNow && updatedUser.role === 'provider') {
//         const cnicKey = normalizeProviderCnic(updatedUser.cnic)
//         if (cnicKey.length >= 5 && !blockedProviderCnics.includes(cnicKey)) {
//           blockedProviderCnics = [...blockedProviderCnics, cnicKey]
//         }
//       }

//       return { ...state, users, notifications, blockedProviderCnics }
//     })

//     if (!updatedUser) {
//       throw new Error('User not found.')
//     }

//     return delay(publicUser(updatedUser))
//   }

//   if (pathname.startsWith('/admin/services/') && normalizedMethod === 'PATCH') {
//     const currentUser = getCurrentUser(headers)
//     const serviceId = pathname.split('/')[3]

//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Unauthorized')
//     }

//     let updatedService = null

//     writeMockDb((state) => ({
//       ...state,
//       services: state.services.map((service) => {
//         if (service.id !== serviceId) {
//           return service
//         }

//         let nextImages = withServiceImages(service).images
//         if (data.images !== undefined) {
//           nextImages = validateServiceImageList(data.images, { required: true })
//         }
//         const { images: _a, image: _b, ...restAdmin } = data
//         updatedService = {
//           ...service,
//           ...restAdmin,
//           images: nextImages,
//           image: nextImages[0] || '',
//         }

//         return updatedService
//       }),
//     }))

//     if (!updatedService) {
//       throw new Error('Service not found.')
//     }

//     return delay(withServiceImages(updatedService))
//   }

//   const approveServiceMatch = pathname.match(/^\/services\/([^/?]+)\/approve$/)
//   if (approveServiceMatch && normalizedMethod === 'PATCH') {
//     const currentUser = getCurrentUser(headers)
//     const serviceId = approveServiceMatch[1]

//     if (!currentUser || currentUser.role !== 'admin') {
//       throw new Error('Unauthorized')
//     }

//     let updatedService = null
//     let serviceProviderId = null

//     writeMockDb((state) => {
//       const service = state.services.find((s) => s.id === serviceId)
//       if (!service) {
//         return state
//       }

//       serviceProviderId = service.providerId
//       updatedService = {
//         ...service,
//         isApproved: true,
//         isActive: true,
//         status: 'approved',
//         updatedAt: new Date().toISOString(),
//       }

//       const notifications = [
//         ...state.notifications,
//         {
//           id: createId('notification'),
//           userId: serviceProviderId,
//           title: 'Service approved!',
//           body: `Your service "${service.title}" has been approved and is now live!`,
//           read: false,
//           createdAt: new Date().toISOString(),
//         },
//       ]

//       return {
//         ...state,
//         services: state.services.map((s) => (s.id === serviceId ? updatedService : s)),
//         notifications,
//       }
//     })

//     if (!updatedService) {
//       throw new Error('Service not found.')
//     }

//     return delay(withServiceImages(updatedService))
//   }

//   throw new Error(`No mock handler for ${normalizedMethod} ${pathname}`)
// }

// export const apiRequest = async ({ path, method = 'GET', data, headers = {} }) => {
//   try {
//     console.log('Trying real API for:', path)
//     const response = await fetch(`${API_BASE_URL}${path}`, {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         ...headers,
//       },
//       body: data ? JSON.stringify(data) : undefined,
//     })
    
//     if (!response.ok) {
//       console.log('Real API not OK, falling back to mock')
//       throw new Error('Real API failed, falling back to mock')
//     }
    
//     const payload = await response.json()
//     console.log('Real API response:', payload)
//     return payload
//   } catch (error) {
//     console.log('Real API failed, falling back to mock for:', path, error)
//     // Fallback to mock API for any error (network, server down, etc.)
//     return mockRequest({ path, method, data, headers })
//   }
// }


// src/services/api/client.js
// REAL API ONLY — NO MOCK FALLBACK

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Make a real API request. No mock fallback.
 */
export const apiRequest = async ({ path, method = 'GET', data, headers = {} }) => {
  const url = `${API_BASE_URL}${path}`

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(url, config)

  // Always try to parse JSON, even for error responses
  const responseData = await response.json().catch(() => ({}))

  if (!response.ok) {
    const unwrap = (d) => {
      if (d == null) return ''
      if (typeof d === 'string') return d
      if (typeof d.message === 'string') return d.message
      if (Array.isArray(d.details)) return d.details.filter(Boolean).join('. ')
      try {
        return JSON.stringify(d)
      } catch {
        return String(d)
      }
    }
    const msg =
      unwrap(responseData.message) ||
      unwrap(responseData.error) ||
      unwrap(responseData.detail) ||
      `HTTP ${response.status}: ${response.statusText}`
    const error = new Error(msg)
    error.status = response.status
    error.data = responseData
    throw error
  }

  return responseData
}