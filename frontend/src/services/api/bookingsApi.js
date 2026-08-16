

import { apiRequest } from './client'

export const fetchBookingsRequest = (authHeaders) =>
  apiRequest({
    path: '/api/bookings',
    headers: authHeaders,
  })

export const createBookingRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/bookings',
    method: 'POST',
    data: payload,
    headers: authHeaders,
  })

// FIX: Use PATCH /:id/status to match backend route
export const updateBookingRequest = (bookingId, payload, authHeaders) =>
  apiRequest({
    path: `/api/bookings/${bookingId}/status`,
    method: 'PATCH',
    data: payload,
    headers: authHeaders,
  })

// NEW: Confirm completion for escrow release
export const confirmCompletionRequest = (bookingId, authHeaders) =>
  apiRequest({
    path: `/api/bookings/${bookingId}/confirm-complete`,
    method: 'POST',
    headers: authHeaders,
  })

// NEW: Fetch provider earnings
export const fetchProviderEarningsRequest = (authHeaders) =>
  apiRequest({
    path: '/api/bookings/provider/earnings',
    headers: authHeaders,
  })

// NEW: Fetch admin payments
export const fetchAdminPaymentsRequest = (authHeaders) =>
  apiRequest({
    path: '/api/admin/payments',
    headers: authHeaders,
  })

// NEW: Delete booking (Admin only)
export const deleteBookingRequest = (bookingId, authHeaders) =>
  apiRequest({
    path: `/api/bookings/${bookingId}`,
    method: 'DELETE',
    headers: authHeaders,
  })