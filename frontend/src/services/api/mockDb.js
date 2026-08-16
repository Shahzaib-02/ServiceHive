import { serviceCategories } from '../../data/catalog'
import { BOOKING_STATUS } from '../../utils/bookingStatus'

const STORAGE_KEY = 'service-hive-mock-db'

/** Admin sign-in (mock API). Set Role → Admin on the login screen. Not shown in the UI. */
export const ADMIN_SEED_EMAIL = 'servicehive.admin@gmail.com'
export const ADMIN_SEED_PASSWORD = 'servicehive'

const defaultUsers = [
  {
    id: 'admin-super',
    name: 'Admin',
    email: ADMIN_SEED_EMAIL,
    password: ADMIN_SEED_PASSWORD,
    role: 'admin',
    phone: '+92 300 0000000',
    city: 'Karachi',
    isApproved: true,
    isSuspended: false,
    profileImageDataUrl: '',
  },
  {
    id: 'p1',
    name: 'Bilal Khan',
    email: 'bilal.khan@example.com',
    password: 'password123',
    role: 'provider',
    phone: '+92 300 1234567',
    city: 'Bahawalpur',
    isApproved: true,
    isSuspended: false,
    profileImageDataUrl: '',
  },
  {
    id: 'p2',
    name: 'Sarah Ahmed',
    email: 'sarah.ahmed@example.com',
    password: 'password123',
    role: 'provider',
    phone: '+92 300 9876543',
    city: 'Bahawalpur',
    isApproved: true,
    isSuspended: false,
    profileImageDataUrl: '',
  },
]

const CATALOG_TEMPLATE_IDS = new Set(serviceCategories.map((c) => c.id))

const createDefaultState = () => ({
  users: defaultUsers,
  /** No catalog rows in DB — providers add real listings; customers browse templates when the API list is empty. */
  services: [
    {
      id: 's1',
      title: 'Car Mechanic',
      description: 'Professional car repair and maintenance services',
      category: 'auto-mechanic',
      categoryLabel: 'Auto Mechanic',
      group: 'automotive',
      location: 'Bilal Colony',
      images: [],
      providerId: 'p1',
      providerName: 'Bilal Khan',
      status: 'pending',
      isApproved: false,
      basePrice: 2000,
      price: 2000,
      eta: '1 hour',
      duration: '1 hour',
      rating: 0,
      reviews: [],
      bookings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 's2',
      title: 'Home Cleaning',
      description: 'Professional home cleaning and sanitization services',
      category: 'home-cleaning',
      categoryLabel: 'Home Cleaning',
      group: 'home',
      location: 'Model Town',
      images: [],
      providerId: 'p2',
      providerName: 'Sarah Ahmed',
      status: 'active',
      isApproved: true,
      basePrice: 1500,
      price: 1500,
      eta: '2 hours',
      duration: '2 hours',
      rating: 4.5,
      reviews: [],
      bookings: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  bookings: [],
  reviews: [],
  payments: [],
  messages: [],
  notifications: [],
  /** Digits-only CNIC keys for providers suspended by admin; blocks re-registration and new listings. */
  blockedProviderCnics: [],
})

const defaultAdminUser = defaultUsers[0]

const ensureAdminUser = (state) => {
  const hasAdmin = state.users?.some((u) => u.id === 'admin-super' || u.email?.toLowerCase() === ADMIN_SEED_EMAIL.toLowerCase())
  if (hasAdmin) {
    return state
  }
  return {
    ...state,
    users: [defaultAdminUser, ...(state.users || [])],
  }
}

/** Sync admin account to current seed Gmail/password (upgrades old localStorage). */
const migrateAdminSeedCredentials = (state) => {
  let changed = false
  const users = (state.users || []).map((u) => {
    if (u.id !== 'admin-super') {
      return u
    }
    if (u.email === ADMIN_SEED_EMAIL && u.password === ADMIN_SEED_PASSWORD) {
      return u
    }
    changed = true
    return {
      ...u,
      email: ADMIN_SEED_EMAIL,
      password: ADMIN_SEED_PASSWORD,
      isApproved: true,
    }
  })
  if (!changed) {
    return state
  }
  return { ...state, users }
}

/** Remove legacy demo customer (customers come from registration only). */
const migrateRemoveSeedCustomer = (state) => {
  if (!state.users?.some((u) => u.id === 'customer-001')) {
    return state
  }
  const users = (state.users || []).filter((u) => u.id !== 'customer-001')
  const bookings = (state.bookings || []).filter((b) => b.customerId !== 'customer-001')
  const keptBookingIds = new Set(bookings.map((b) => b.id))
  const reviews = (state.reviews || []).filter((r) => keptBookingIds.has(r.bookingId))
  const payments = (state.payments || []).filter((p) => keptBookingIds.has(p.bookingId))
  const messages = (state.messages || []).filter((m) => keptBookingIds.has(m.bookingId))
  const notifications = (state.notifications || []).filter((n) => n.userId !== 'customer-001')
  return {
    ...state,
    users,
    bookings,
    reviews,
    payments,
    messages,
    notifications,
  }
}

/** Remove legacy demo provider and unassign their listings (providers come from registration only). */
const migrateRemoveStaticProvider = (state) => {
  const hadLegacy = state.users?.some((u) => u.id === 'provider-001')
  if (!hadLegacy) {
    return state
  }
  const users = (state.users || []).filter((u) => u.id !== 'provider-001')
  const services = (state.services || []).map((s) => (
    s.providerId === 'provider-001' ? { ...s, providerId: null } : s
  ))
  const bookings = (state.bookings || []).filter((b) => b.providerId !== 'provider-001')
  const keptBookingIds = new Set(bookings.map((b) => b.id))
  const reviews = (state.reviews || []).filter((r) => keptBookingIds.has(r.bookingId))
  const payments = (state.payments || []).filter((p) => keptBookingIds.has(p.bookingId))
  const messages = (state.messages || []).filter((m) => keptBookingIds.has(m.bookingId))
  const notifications = (state.notifications || []).filter((n) => n.userId !== 'provider-001')
  return {
    ...state,
    users,
    services,
    bookings,
    reviews,
    payments,
    messages,
    notifications,
  }
}

/** Drop old seeded catalog copies (ids match static catalog); keep only provider-created listings. */
const migrateStripCatalogTemplateServices = (state) => {
  const services = (state.services || []).filter((s) => !CATALOG_TEMPLATE_IDS.has(s.id))
  if (services.length === (state.services || []).length) {
    return state
  }
  return { ...state, services }
}

const migrateBlockedProviderCnics = (state) => {
  if (Array.isArray(state.blockedProviderCnics)) {
    return state
  }
  return { ...state, blockedProviderCnics: [] }
}

const migrateUserSuspensionFlags = (state) => {
  let changed = false
  const users = (state.users || []).map((u) => {
    if (u.isSuspended !== undefined) {
      return u
    }
    changed = true
    return { ...u, isSuspended: false }
  })
  return changed ? { ...state, users } : state
}

const migrateUserProfileImages = (state) => {
  let changed = false
  const users = (state.users || []).map((u) => {
    if (u.profileImageDataUrl !== undefined) {
      return u
    }
    changed = true
    return { ...u, profileImageDataUrl: '' }
  })
  return changed ? { ...state, users } : state
}

const migrateLegacyBookings = (state) => {
  let changed = false
  const bookings = (state.bookings || []).map((b) => {
    if (b.status === 'pending' && b.paymentStatus === 'unpaid') {
      changed = true
      return { ...b, status: BOOKING_STATUS.PAYMENT_PENDING }
    }
    if (b.status === 'pending' && b.paymentStatus === 'paid') {
      changed = true
      return { ...b, status: BOOKING_STATUS.PENDING_PROVIDER }
    }
    if (b.status === 'confirmed') {
      changed = true
      return { ...b, status: BOOKING_STATUS.ACCEPTED }
    }
    return b
  })
  if (!changed) {
    return state
  }
  return { ...state, bookings }
}

const readStorage = () => {
  const rawState = localStorage.getItem(STORAGE_KEY)
  if (!rawState) {
    const nextState = createDefaultState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
    return nextState
  }

  try {
    const parsed = JSON.parse(rawState)
    const snapshot = JSON.stringify(parsed)
    let next = ensureAdminUser(parsed)
    next = migrateAdminSeedCredentials(next)
    next = migrateRemoveSeedCustomer(next)
    next = migrateRemoveStaticProvider(next)
    next = migrateStripCatalogTemplateServices(next)
    next = migrateBlockedProviderCnics(next)
    next = migrateUserSuspensionFlags(next)
    next = migrateUserProfileImages(next)
    next = migrateLegacyBookings(next)
    if (JSON.stringify(next) !== snapshot) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }
    return next
  } catch {
    const nextState = createDefaultState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
    return nextState
  }
}

export const readMockDb = () => readStorage()

export const writeMockDb = (updater) => {
  const currentState = readStorage()
  const nextState = typeof updater === 'function' ? updater(currentState) : updater
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  return nextState
}

export const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`

export const delay = (value, wait = 350) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(value), wait)
  })

export const publicUser = (user) => {
  if (!user) {
    return null
  }

  const { password, ...safeUser } = user
  return safeUser
}
