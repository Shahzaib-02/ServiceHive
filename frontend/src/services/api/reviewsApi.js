import { apiRequest } from './client'

export const fetchReviewsRequest = (authHeaders) =>
  apiRequest({
    path: '/api/reviews',
    headers: authHeaders,
  })

export const createReviewRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/reviews',
    method: 'POST',
    data: payload,
    headers: authHeaders,
  })
