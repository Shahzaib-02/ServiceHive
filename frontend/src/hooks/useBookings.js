

import { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContext'

export const useBookings = () => {
  const ctx = useContext(AppContext)

  // Handle null context
  if (!ctx) {
    return {
      bookings: [],
      isLoading: false,
      error: '',
      fetchBookings: () => Promise.resolve([]),
      createBooking: () => Promise.reject(new Error('Context not initialized')),
      updateBooking: () => Promise.reject(new Error('Context not initialized')),
      updateBookingStatus: () => Promise.reject(new Error('Context not initialized')),
      deleteBooking: () => Promise.reject(new Error('Context not initialized')),
      confirmCompletion: () => Promise.reject(new Error('Context not initialized')),
      selectedBooking: null,
      setSelectedBooking: () => {},
      checkoutState: null,
      startCheckout: () => Promise.reject(new Error('Context not initialized')),
      confirmPayment: () => Promise.reject(new Error('Context not initialized')),
      providerEarnings: null,
      fetchProviderEarnings: () => Promise.resolve(null),
      adminPayments: [],
      fetchAdminPayments: () => Promise.resolve([]),
    }
  }

  return useMemo(() => ({
    bookings: ctx.bookings,
    isLoading: ctx.isLoadingBookings,
    error: ctx.bookingsError,
    fetchBookings: ctx.fetchBookings,
    createBooking: ctx.createBooking,
    updateBooking: ctx.updateBooking,
    updateBookingStatus: ctx.updateBookingStatus,
    deleteBooking: ctx.deleteBooking,
    confirmCompletion: ctx.confirmCompletion,
    selectedBooking: ctx.selectedBooking,
    setSelectedBooking: ctx.setSelectedBooking,
    checkoutState: ctx.checkoutState,
    startCheckout: ctx.startCheckout,
    confirmPayment: ctx.confirmPayment,
    providerEarnings: ctx.providerEarnings,
    fetchProviderEarnings: ctx.fetchProviderEarnings,
    adminPayments: ctx.adminPayments,
    fetchAdminPayments: ctx.fetchAdminPayments,
  }), [
    ctx.bookings,
    ctx.isLoadingBookings,
    ctx.bookingsError,
    ctx.fetchBookings,
    ctx.createBooking,
    ctx.updateBooking,
    ctx.updateBookingStatus,
    ctx.deleteBooking,
    ctx.confirmCompletion,
    ctx.selectedBooking,
    ctx.setSelectedBooking,
    ctx.checkoutState,
    ctx.startCheckout,
    ctx.confirmPayment,
    ctx.providerEarnings,
    ctx.fetchProviderEarnings,
    ctx.adminPayments,
    ctx.fetchAdminPayments,
  ])
}






