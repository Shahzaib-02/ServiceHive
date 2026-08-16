

















import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { io as socketIO } from 'socket.io-client'
import { loginRequest, registerRequest, updateProfileRequest } from '../services/api/authApi'
import {
  createBookingRequest,
  fetchBookingsRequest,
  updateBookingRequest,
  confirmCompletionRequest,
  fetchProviderEarningsRequest,
  fetchAdminPaymentsRequest,
  deleteBookingRequest
} from '../services/api/bookingsApi'
import { confirmPaymentRequest, createCheckoutSessionRequest } from '../services/api/paymentsApi'
import { fetchServicesRequest, normalizeServicesList } from '../services/api/servicesApi'

export const AppContext = createContext({
  user: null, token: '', role: 'guest', isAuthenticated: false,
  isLoading: false, error: '',
  login: () => {}, register: () => {}, logout: () => {}, updateProfile: () => {},
  services: [], filters: { search: '', category: '', group: '' },
  isLoadingServices: false, servicesError: '', fetchServices: () => {}, setFilters: () => {},
  bookings: [], isLoadingBookings: false, bookingsError: '',
  fetchBookings: () => {}, createBooking: () => {}, updateBooking: () => {},
  updateBookingStatus: () => {}, confirmCompletion: () => {},
  selectedBooking: null, setSelectedBooking: () => {},
  checkoutState: null, startCheckout: () => {}, confirmPayment: () => {},
  providerLocation: { lat: 31.5204, lng: 74.3587 },
  messages: [], notifications: [], sendMessage: () => {},
  chatBookingId: null, setChatBookingId: () => {},
  socketConnected: false, chatRoomJoined: false, chatError: '',
  providerEarnings: null, fetchProviderEarnings: () => {},
  adminPayments: [], fetchAdminPayments: () => {},
})

const AUTH_STORAGE_KEY = 'service-hive-auth'
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : { user: null, token: '' }
  } catch {
    return { user: null, token: '' }
  }
}

export const AppProvider = ({ children }) => {
  const [authState, setAuthState]       = useState(readStoredAuth)
  const [authLoading, setAuthLoading]   = useState(false)
  const [authError, setAuthError]       = useState('')
  const [bookings, setBookings]         = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsError, setBookingsError]     = useState('')
  const [services, setServices]         = useState([])
  const [filters, setFilters]           = useState({ search: '', category: '', group: '' })
  const [servicesLoading, setServicesLoading] = useState(false)
  const [servicesError, setServicesError]     = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [checkoutState, setCheckoutState]     = useState(null)
  const [providerEarnings, setProviderEarnings] = useState(null)
  const [adminPayments, setAdminPayments]       = useState([])
  const [providerLocation, setProviderLocation] = useState({ lat: 31.5204, lng: 74.3587 })
  const [chatBookingId, setChatBookingId]       = useState(null)

  // ── Real-time state ───────────────────────────────────────────────────────
  const [messages, setMessages]         = useState([])
  const [notifications, setNotifications] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [chatRoomJoined, setChatRoomJoined] = useState(false)
  const [chatError, setChatError] = useState('')
  const socketRef   = useRef(null)
  const chatBookingIdRef = useRef(null)
  const filtersRef  = useRef(filters)

  useEffect(() => {
    chatBookingIdRef.current = chatBookingId
  }, [chatBookingId])

  const { user, token } = authState
  const isAuthenticated = Boolean(token)

  const authHeaders = useMemo(() => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token])

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
  }, [authState])

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // ── Create / destroy socket when token changes ────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setSocketConnected(false)
      }
      return
    }

    const socket = socketIO(`${SOCKET_URL}/chat`, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })
    socketRef.current = socket

    const joinChatRoom = (bookingId) => {
      if (!bookingId || !token) return
      setChatRoomJoined(false)
      setChatError('')
      socket.emit('chat:join', { bookingId: String(bookingId), token })
    }

    socket.on('connect', () => {
      setSocketConnected(true)
      if (chatBookingIdRef.current) {
        joinChatRoom(chatBookingIdRef.current)
      }
    })

    socket.on('disconnect', () => {
      setSocketConnected(false)
      setChatRoomJoined(false)
    })

    socket.on('chat:joined', ({ bookingId }) => {
      if (String(bookingId) === String(chatBookingIdRef.current)) {
        setChatRoomJoined(true)
        setChatError('')
      }
    })

    socket.on('chat:message', (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => String(m.id) === String(msg.id))
        if (exists) return prev
        return [...prev, { ...msg, id: String(msg.id) }]
      })
    })

    socket.on('chat:error', (err) => {
      const message = err?.message || 'Chat error'
      setChatError(message)
      setChatRoomJoined(false)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setSocketConnected(false)
    }
  }, [isAuthenticated, token]) // ← only recreate socket when auth changes

  // ── Join / leave room when chatBookingId or socket connection changes ─────
  useEffect(() => {
    const socket = socketRef.current
    if (!token) return

    if (chatBookingId) {
      setChatRoomJoined(false)
      setChatError('')
      setMessages([])

      if (socket?.connected) {
        socket.emit('chat:join', { bookingId: String(chatBookingId), token })
      }

      fetch(`${SOCKET_URL}/api/chat/${chatBookingId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setMessages(res.data.map((m) => ({ ...m, id: String(m.id) })))
          } else if (res.message) {
            setChatError(res.message)
          }
        })
        .catch((err) => {
          console.error('[Chat] History fetch error:', err)
          setChatError('Could not load message history')
        })
    } else {
      setMessages([])
      setChatRoomJoined(false)
      setChatError('')
    }
  }, [chatBookingId, token, socketConnected])

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = async (payload) => {
    setAuthLoading(true); setAuthError('')
    try {
      const response = await loginRequest(payload)
      setAuthState({ user: response.user, token: response.token })
      return response
    } catch (e) { setAuthError(e.message); throw e }
    finally { setAuthLoading(false) }
  }

  const register = async (payload) => {
    setAuthLoading(true); setAuthError('')
    try {
      const response = await registerRequest(payload)
      if (response.pendingApproval) return response
      setAuthState({ user: response.user, token: response.token })
      return response
    } catch (e) { setAuthError(e.message); throw e }
    finally { setAuthLoading(false) }
  }

  const logout = () => {
    setAuthState({ user: null, token: '' })
    setBookings([]); setSelectedBooking(null); setChatBookingId(null)
    setProviderEarnings(null); setAdminPayments([])
    setMessages([]); setNotifications([])
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const updateProfile = async (payload) => {
    if (!isAuthenticated) throw new Error('Sign in to update your profile.')
    setAuthLoading(true); setAuthError('')
    try {
      console.log('updateProfile payload:', payload)
      console.log('updateProfile authHeaders:', authHeaders)
      const updated = await updateProfileRequest(payload, authHeaders)
      setAuthState((prev) => ({ ...prev, user: updated }))
      return updated
    } catch (e) { setAuthError(e.message); throw e }
    finally { setAuthLoading(false) }
  }

  // ── Bookings ──────────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated) { setBookings([]); return [] }
    setBookingsLoading(true); setBookingsError('')
    try {
      const response = await fetchBookingsRequest(authHeaders)
      setBookings(response)
      return response
    } catch (e) { setBookingsError(e.message); return [] }
    finally { setBookingsLoading(false) }
  }, [authHeaders, isAuthenticated])

  // ── Services ──────────────────────────────────────────────────────────────
  const fetchServices = useCallback(async (nextFilters) => {
    const resolvedFilters = nextFilters ?? filtersRef.current
    setServicesLoading(true); setServicesError('')
    try {
      const response = await fetchServicesRequest(resolvedFilters)
      setServices(normalizeServicesList(response))
      if (nextFilters) {
        setFilters((current) => {
          const isSame = current.search === nextFilters.search &&
            current.category === nextFilters.category && current.group === nextFilters.group
          return isSame ? current : nextFilters
        })
      }
      return response
    } catch (e) { setServicesError(e.message); return [] }
    finally { setServicesLoading(false) }
  }, [])

  useEffect(() => { if (isAuthenticated) fetchBookings() }, [isAuthenticated, user?.id, fetchBookings])

  useEffect(() => {
    if (!isAuthenticated) {
      setServices([])
      return
    }

    const role = user?.role
    if (role === 'customer') {
      fetchServices({ search: '', category: '', group: '', isApproved: 'true' })
    } else if (role === 'provider') {
      const providerId = user?.id || user?._id || ''
      fetchServices({ search: '', category: '', group: '', providerId })
    } else if (role === 'admin') {
      fetchServices({ search: '', category: '', group: '' })
    }
  }, [isAuthenticated, user?.id, user?.role, fetchServices])

  const createBooking = async (payload) => {
    const response = await createBookingRequest(payload, authHeaders)
    await fetchBookings(); setSelectedBooking(response); return response
  }

  const updateBooking = async (bookingId, payload) => {
    const response = await updateBookingRequest(bookingId, payload, authHeaders)
    await fetchBookings()
    setSelectedBooking((current) =>
      current?._id === bookingId || current?.id === bookingId ? response : current)
    return response
  }

  const updateBookingStatus = async (bookingId, status) => {
    const response = await updateBookingRequest(bookingId, { status }, authHeaders)
    await fetchBookings(); return response
  }

  const deleteBooking = async (bookingId) => {
    const response = await deleteBookingRequest(bookingId, authHeaders)
    await fetchBookings(); return response
  }

  const confirmCompletion = async (bookingId) => {
    const response = await confirmCompletionRequest(bookingId, authHeaders)
    await fetchBookings(); return response
  }

  const fetchProviderEarnings = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'provider') return
    try {
      const response = await fetchProviderEarningsRequest(authHeaders)
      setProviderEarnings(response); return response
    } catch (e) { console.error('Fetch earnings error:', e); return null }
  }, [authHeaders, isAuthenticated, user?.role])

  const fetchAdminPayments = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'admin') return
    try {
      const response = await fetchAdminPaymentsRequest(authHeaders)
      setAdminPayments(response); return response
    } catch (e) { console.error('Fetch admin payments error:', e); return [] }
  }, [authHeaders, isAuthenticated, user?.role])

  const startCheckout = async (bookingId) => {
    const response = await createCheckoutSessionRequest({ bookingId }, authHeaders)
    setCheckoutState(response); await fetchBookings(); return response
  }

  const confirmPayment = async (bookingId) => {
    const response = await confirmPaymentRequest({ bookingId }, authHeaders)
    await fetchBookings(); return response
  }

  // ── sendMessage via socket (REST fallback if room not joined) ─────────────
  const sendMessage = useCallback(async (body) => {
    if (!chatBookingId || !user || !body?.trim() || !token) return null

    const trimmed = body.trim()
    const bookingId = String(chatBookingId)
    const socket = socketRef.current

    if (socket?.connected && chatRoomJoined) {
      socket.emit('chat:message', { bookingId, body: trimmed })
      return null
    }

    try {
      const res = await fetch(`${SOCKET_URL}/api/chat/${bookingId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: trimmed }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setChatError(data.message || 'Failed to send message')
        return null
      }
      if (data.data) {
        setMessages((prev) => {
          const exists = prev.some((m) => String(m.id) === String(data.data.id))
          if (exists) return prev
          return [...prev, { ...data.data, id: String(data.data.id) }]
        })
      }
    } catch (err) {
      console.error('[Chat] Send error:', err)
      setChatError('Failed to send message')
    }
    return null
  }, [chatBookingId, user, token, chatRoomJoined])

  // ── Context value ─────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    user: authState.user, token: authState.token,
    role: authState.user?.role || 'guest',
    isAuthenticated, isLoading: authLoading, error: authError,
    login, register, logout, updateProfile,
    services, filters, isLoadingServices: servicesLoading, servicesError,
    fetchServices, setFilters,
    bookings, isLoadingBookings: bookingsLoading, bookingsError,
    fetchBookings, createBooking, updateBooking, updateBookingStatus,
    deleteBooking, confirmCompletion,
    selectedBooking, setSelectedBooking, checkoutState, startCheckout, confirmPayment,
    providerLocation, messages, notifications, sendMessage,
    chatBookingId, setChatBookingId, socketConnected, chatRoomJoined, chatError,
    providerEarnings, fetchProviderEarnings, adminPayments, fetchAdminPayments,
  }), [
    authState, authLoading, authError, isAuthenticated,
    services, filters, servicesLoading, servicesError,
    bookings, bookingsLoading, bookingsError,
    selectedBooking, checkoutState, providerLocation,
    messages, notifications, chatBookingId, socketConnected, chatRoomJoined, chatError,
    providerEarnings, adminPayments,
    login, register, logout, updateProfile,
    fetchServices, fetchBookings, createBooking, updateBooking,
    updateBookingStatus, deleteBooking, confirmCompletion,
    startCheckout, confirmPayment, sendMessage,
    fetchProviderEarnings, fetchAdminPayments,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}