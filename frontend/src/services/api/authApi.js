import { apiRequest } from './client'

export const registerRequest = (payload) =>
  apiRequest({
    path: '/api/auth/signup',
    method: 'POST',
    data: payload,
  })

export const loginRequest = (payload) =>
  apiRequest({
    path: '/api/auth/login',
    method: 'POST',
    data: payload,
  })

export const updateProfileRequest = (payload, authHeaders) =>
  apiRequest({
    path: '/api/auth/profile',
    method: 'PATCH',
    data: payload,
    headers: authHeaders,
  })
