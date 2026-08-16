import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, X, CheckCircle, AlertTriangle, Info, XCircle, ExternalLink } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useBookings } from '../hooks/useBookings'

const TYPE_STYLES = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    icon_color: 'text-emerald-400',
    badge: 'bg-emerald-500',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10 border-amber-500/20',
    icon_color: 'text-amber-400',
    badge: 'bg-amber-500',
  },
  error: {
    icon: XCircle,
    bg: 'bg-rose-500/10 border-rose-500/20',
    icon_color: 'text-rose-400',
    badge: 'bg-rose-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10 border-blue-500/20',
    icon_color: 'text-blue-400',
    badge: 'bg-blue-500',
  },
}

const AdminNotificationBell = () => {
  const { token } = useAuth()
  const { fetchBookings } = useBookings()
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [releasingId, setReleasingId] = useState(null)
  const [error, setError] = useState('')
  const panelRef = useRef(null)

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // ── Fetch unread notifications ──────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!token) return
    try {
      const res  = await fetch('http://localhost:5000/api/notifications', { headers: authHeaders })
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Failed to fetch notifications:', e)
    }
  }, [token])

  // Poll every 30 seconds so admin sees new notifications without refresh
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  // ── Mark single notification as read ───────────────────────────────────────
  const markRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: authHeaders,
      })
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error('Failed to mark notification read:', e)
    }
  }

  // ── Dismiss / delete notification ──────────────────────────────────────────
  const dismiss = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setNotifications(prev => prev.filter(n => n._id !== id))
    } catch (e) {
      console.error('Failed to delete notification:', e)
    }
  }

  // ── Release payment ─────────────────────────────────────────────────────────
  const handleReleasePayment = async (notification) => {
    const bookingId = notification.relatedId
    if (!bookingId) return

    setReleasingId(notification._id)
    setError('')
    try {
      const res  = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/release-payment`, {
        method:  'POST',
        headers: authHeaders,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Failed to release payment')

      // Remove this notification from the list (backend marked it read)
      setNotifications(prev => prev.filter(n => n._id !== notification._id))

      // Refresh bookings data to update awaiting settlement section
      await fetchBookings()

      // Show a brief success message
      alert(`✅ Payment released! Provider receives PKR ${data.providerPayout?.toLocaleString()}, Commission: PKR ${data.adminCommission?.toLocaleString()}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setReleasingId(null)
    }
  }

  // ── Process refund ─────────────────────────────────────────────────────────
  const handleProcessRefund = async (notification) => {
    const bookingId = notification.relatedId
    if (!bookingId) return

    setReleasingId(notification._id)
    setError('')
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/refund`, {
        method: 'POST',
        headers: authHeaders,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Failed to process refund')

      // Remove this notification from the list
      setNotifications(prev => prev.filter(n => n._id !== notification._id))

      // Refresh bookings data to update awaiting settlement section
      await fetchBookings()

      // Show a brief success message
      alert(`✅ Refund processed! Customer receives PKR ${data.refundAmount?.toLocaleString()}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setReleasingId(null)
    }
  }

  // ── Mark all as read ────────────────────────────────────────────────────────
  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead)
    await Promise.all(unread.map(n => markRead(n._id)))
  }

  return (
    <div className="relative z-50" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => { setOpen(o => !o); if (!open) fetchNotifications() }}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 text-slate-300 transition-all hover:border-amber-400/30 hover:bg-slate-700/60 hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {open && (
        <div className="absolute right-0 top-12 z-[100] w-96 max-h-[min(560px,calc(100vh-6rem))] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50 ring-1 ring-white/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h3 className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-400">{unreadCount} unread</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-4 mt-3 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Notification List */}
          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Bell className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map(notification => {
                const style = TYPE_STYLES[notification.type] || TYPE_STYLES.info
                const Icon  = style.icon
                const isPaymentRelease = notification.actionText === 'Release Payment'
                const isRefundProcess = notification.actionText === 'Process Refund'

                return (
                  <div
                    key={notification._id}
                    className={`relative border-b border-white/5 p-4 transition-colors last:border-0 ${
                      !notification.isRead ? 'bg-white/[0.03]' : ''
                    }`}
                  >
                    {/* Unread dot */}
                    {!notification.isRead && (
                      <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-amber-400" />
                    )}

                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border ${style.bg}`}>
                        <Icon className={`h-4 w-4 ${style.icon_color}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white leading-snug">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>

                        {/* Action buttons */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {/* ✅ Release Payment button for payment notifications */}
                          {isPaymentRelease && (
                            <button
                              onClick={() => handleReleasePayment(notification)}
                              disabled={releasingId === notification._id}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {releasingId === notification._id ? (
                                <>
                                  <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                                  Releasing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Release Payment
                                </>
                              )}
                            </button>
                          )}

                          {/* ✅ Process Refund button for refund notifications */}
                          {isRefundProcess && (
                            <button
                              onClick={() => handleProcessRefund(notification)}
                              disabled={releasingId === notification._id}
                              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {releasingId === notification._id ? (
                                <>
                                  <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Process Refund
                                </>
                              )}
                            </button>
                          )}

                          {/* Dismiss - only show for non-refund notifications */}
                          {!isRefundProcess && (
                            <button
                              onClick={() => dismiss(notification._id)}
                              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-rose-500/30 hover:text-rose-400"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminNotificationBell