

// // src/api/Paymentapi.js
// import { apiRequest } from './client'

// export const createCheckoutSessionRequest = (payload, authHeaders) =>
//   apiRequest({
//     path: '/api/payments/checkout',
//     method: 'POST',
//     data: payload,
//     headers: authHeaders,
//   })

// export const createPaymentIntentRequest = (payload, authHeaders) =>
//   apiRequest({
//     path: '/api/payments/create-intent',
//     method: 'POST',
//     data: payload,
//     headers: authHeaders,
//   })

// export const confirmPaymentRequest = (payload, authHeaders) =>
//   apiRequest({
//     path: '/api/payments/confirm',
//     method: 'POST',
//     data: payload,
//     headers: authHeaders,
//   })

// export const fetchPaymentsRequest = (authHeaders) =>
//   apiRequest({
//     path: '/api/payments',
//     headers: authHeaders,
//   })

// export const fetchAdminPaymentsRequest = (authHeaders) =>
//   apiRequest({
//     path: '/api/admin/payments',
//     headers: authHeaders,
//   })








// src/api/Paymentapi.js
import { apiRequest } from './client'

export const createCheckoutSessionRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/payments/checkout',
    method: 'POST',
    data: payload,
    headers: authHeaders,
  })

export const createPaymentIntentRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/payments/create-intent',
    method: 'POST',
    data: payload,
    headers: authHeaders,
  })

export const confirmPaymentRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/payments/confirm',
    method: 'POST',
    data: payload,
    headers: authHeaders,
  })

export const fetchPaymentsRequest = (authHeaders) =>
  apiRequest({
    path: '/api/payments',
    headers: authHeaders,
  })

export const fetchAdminPaymentsRequest = (authHeaders) =>
  apiRequest({
    path: '/api/admin/payments',
    headers: authHeaders,
  })

// NEW: Mark payment as held in escrow after Stripe success
export const holdPaymentRequest = (bookingId, authHeaders) =>
  apiRequest({
    path: `/api/bookings/${bookingId}/payment-held`,
    method: 'POST',
    headers: authHeaders,
  })

// NEW: Release payment to provider (admin only)
export const releasePaymentRequest = (bookingId, authHeaders) =>
  apiRequest({
    path: `/api/bookings/${bookingId}/confirm-complete`,
    method: 'POST',
    headers: authHeaders,
  })